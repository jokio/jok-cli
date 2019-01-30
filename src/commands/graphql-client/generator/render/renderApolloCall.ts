import { RootType } from '../../utils/rootType'

export default function ({
	rootType,
	hasVariables,
	queryName,
	returnType,
	isWatchQuery = false,
}: Props) {

	let methodName = {
		[RootType.Query]: 'query',
		[RootType.Mutation]: 'mutate',
		[RootType.Subscription]: 'subscribe',
	}[rootType]

	if (isWatchQuery && (rootType === RootType.Query)) {
		methodName = 'watchQuery'
	}

	const renderOptions = `
		const { fetchPolicy } = defaultOptions || this.defaultOptions
	`

	if (rootType === RootType.Subscription) {
		return `
		${renderOptions}
		// apollo call
		return this.client.${methodName}({
			query: ${rootType},${hasVariables ? `
			variables: props,` : ''}
			fetchPolicy,
		}).map(x => {
			if (!x.data) {
				return <${returnType}><any>null
			}

			return <${returnType}><any>x.data['${queryName}']
		})`
	}

	if (isWatchQuery) {
		return `
		${renderOptions}
		const zenObs = this.client.watchQuery<${returnType}>({
			query,${hasVariables ? `
			variables: props,` : ''}
			fetchPolicy,
		})

		return from(fixObservable(zenObs)).pipe(
			map((result: any) => {
				// if error, throw it
				if (result.errors) {
					throw new Error(<any>result.errors)
				}

				if (!result.data) {
					return <${returnType}><any>null
				}

				// cast the result and return (need any for scalar types, to avoid compilation error)
				return <${returnType}><any>result.data['${queryName}']
			})
		)`
	}

	return `
		${renderOptions}
		// apollo call
		return this.client.${methodName}({
			${rootType},${hasVariables ? `
			variables: props,` : ''}
			fetchPolicy,
		}).then(result => {
			// if error, throw it
			if (result.errors) {
				throw new Error(<any>result.errors)
			}

			if (!result.data) {
				return <${returnType}><any>null
			}

			// cast the result and return (need any for scalar types, to avoid compilation error)
			return <${returnType}><any>result.data['${queryName}']
		})`
}

interface Props {
	rootType: RootType
	hasVariables: boolean
	queryName: string
	returnType: any
	isWatchQuery?: boolean
}
