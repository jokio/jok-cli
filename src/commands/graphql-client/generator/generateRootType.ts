import { IntrospectionType } from 'graphql'
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter'
import { RootType } from '../utils/rootType'
import generateMutationMethod from './generate/generateMutationMethod'
import generateQueryMethod from './generate/generateQueryMethod'
import generateRefetchQueryMethod from './generate/generateRefetchQueryMethod'
import generateSubscriptionMethod from './generate/generateSubscriptionMethod'
import generateUpdateCacheQueryMethod from './generate/generateUpdateCacheQueryMethod'
import generateWatchQueryMethod from './generate/generateWatchQueryMethod'
import renderRootTypeClass from './render/renderRootTypeClass'

export default (
	typeName: RootType | 'watchQuery' | 'refetchQuery' | 'updateCacheQuery',
	otherTypes: IntrospectionType[],
	generateDefaultFragments: boolean,
) => (queryType: IntrospectionType) => {

	if (!queryType ||
		(queryType.kind !== 'OBJECT') ||
		!queryType.fields ||
		!queryType.fields.length
	) {
		return null
	}

	const generateOptions = {
		[RootType.Query.toString()]: generateQueryMethod,
		['watchQuery']: generateWatchQueryMethod,
		['refetchQuery']: generateRefetchQueryMethod,
		['updateCacheQuery']: generateUpdateCacheQueryMethod,
		[RootType.Mutation.toString()]: generateMutationMethod,
		[RootType.Subscription.toString()]: generateSubscriptionMethod,
	}

	const generateMethod = generateOptions[typeName]

	const methodsAndProps = queryType.fields
		.map(x => generateMethod(x, otherTypes, generateDefaultFragments))

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
