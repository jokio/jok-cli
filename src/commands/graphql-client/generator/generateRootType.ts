import { IntrospectionType } from 'graphql'
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter'
import { RootType } from '../utils/rootType'
import generateMutationMethod from './generate/generateMutationMethod'
import generateQueryMethod from './generate/generateQueryMethod'
import generateSubscriptionMethod from './generate/generateSubscriptionMethod'
import renderRootTypeClass from './render/renderRootTypeClass'

export default (typeName: RootType, otherTypes: IntrospectionType[]) => (queryType: IntrospectionType) => {
	if (!queryType ||
		(queryType.kind !== 'OBJECT') ||
		!queryType.fields ||
		!queryType.fields.length
	) {
		return null
	}

	const generateOptions = {
		[RootType.Query.toString()]: generateQueryMethod,
		[RootType.Mutation.toString()]: generateMutationMethod,
		[RootType.Subscription.toString()]: generateSubscriptionMethod,
	}

	const generateMethod = generateOptions[typeName]

	const methodsAndProps = queryType.fields
		.map(x => generateMethod(x, otherTypes))

	const methodProps = methodsAndProps
		.map(x => x.props)
		.filter(x => !!x)

	const methods = methodsAndProps
		.map(x => x.method)

	const className = capitalizeFirstLetter(typeName)

	return renderRootTypeClass({
		className,
		renderPropTypes: () => methodProps.join('\n'),
		renderMethods: () => methods.join('\n'),
	})
}
