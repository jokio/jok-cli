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

	if (rootType === RootType.Subscription) {
		return `
		// apollo call
		const zenObs = this.client.${methodName}<${returnType}>({
			...mergedOptions,
			query: ${rootType},${hasVariables ? `
			variables: props,` : ''}
		})

		return from(fixObservable(zenObs)).pipe(
			map((result: any) => {
				if (!result.data) {
					return <${returnType}><any>null
				}

				// cast the result and return (need any for scalar types, to avoid compilation error)
				return <${returnType}><any>result.data['${queryName}']
			})
		)`
	}

	if (isWatchQuery) {
		return `
		const zenObs = this.client.watchQuery<${returnType}>({
			...mergedOptions,
			query,${hasVariables ? `
			variables: props,` : ''}
		})

		return from(fixObservable(zenObs)).pipe(
			map((result: any) => {
				if (!result.data) {
					return <${returnType}><any>null
				}

				// cast the result and return (need any for scalar types, to avoid compilation error)
				return <${returnType}><any>result.data['${queryName}']
			})
		)`
	}

	return `
		// apollo call
		return this.client.${methodName}({
			...mergedOptions,
			${rootType},${hasVariables ? `
			variables: props,` : ''}
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
