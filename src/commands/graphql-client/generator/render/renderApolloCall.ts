import { RootType } from '../../utils/rootType'

export default function ({
	rootType,
	hasVariables,
	returnType,
}: Props) {

	const methodName = {
		[RootType.Query]: 'query',
		[RootType.Mutation]: 'mutate',
		[RootType.Subscription]: 'subscribe',
	}[rootType]


	return `	// apollo call
		return this.client.${methodName}({
			${rootType},${hasVariables ? `
			variables: props,` : ''}
		}).then(result => {
			// if error, throw it
			if (result.errors) {
				throw new Error(<any>result.errors)
			}

			// cast the result and return (need any for scalar types, to avoid compilation error)
			return <${returnType}><any>result.data
		})`
}

interface Props {
	rootType: RootType
	hasVariables: boolean
	returnType: any
}
