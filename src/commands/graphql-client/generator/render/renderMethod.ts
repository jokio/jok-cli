import { RootType } from '../../utils/rootType'

export default function ({
	rootType,
	methodName,
	generateDefaultFragments,
	hasProps,
	propsType,
	renderContent,
	hasResultType,
}) {
	const omittedOptionsType = {
		[RootType.Query]: 'OmittedQueryOptions',
		watchQuery: 'OmittedWatchQueryOptions',
		updateCacheQuery: 'OmittedQueryOptions',
		[RootType.Mutation]: 'OmittedMutationOptions',
		[RootType.Subscription]: 'OmittedSubscriptionOptions',
	}[rootType]

	const isUpdateCacheMode = rootType === 'updateCacheQuery'

	const fragmentRequiredSymbol = generateDefaultFragments ? '?' : ''

	const fragmentProp = hasResultType
		? `fragment${fragmentRequiredSymbol}: string | any,`
		: ''

	const fragmentType = hasResultType ? 'FragmentOptions' : ''

	// if (!hasProps) {
	// 	return `
	// ${methodName}(
	// 	${fragmentProp}
	// 	options?: GraphqlCallOptions ${fragmentType} & ${omittedOptionsType},
	// ) {
	// ${renderContent()}
	// }`
	// }

	return `
	${methodName}(
		${hasProps ? `props: ${propsType},` : ``}
		${isUpdateCacheMode
			? `data: any,
			${fragmentProp}`
			: `
			${fragmentProp}
			options?: GraphqlCallOptions ${fragmentType ? `& ${fragmentType}` : ''} & ${omittedOptionsType},`
		}
	) {
	${renderContent()}
	}`
}
