import { RootType } from '../../utils/rootType'

export default function ({
	rootType,
	hasVariables,
	queryName,
	returnType,
}: Props) {

	const methodName = {
		[RootType.Query]: 'query',
		[RootType.Mutation]: 'mutate',
		[RootType.Subscription]: 'subscribe',
	}[rootType]

	if (rootType === RootType.Subscription) {
		return `	// apollo call
		return this.client.${methodName}({
			query: ${rootType},${hasVariables ? `
			variables: props,` : ''}
		}).map(x => {
			if (!x.data) {
				return <${returnType}><any>null
			}

			return <${returnType}><any>x.data['${queryName}']
		})`
	}

	return `	// apollo call
		return this.client.${methodName}({
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
}
