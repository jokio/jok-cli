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
		'watchQuery': 'OmittedWatchQueryOptions',
		[RootType.Mutation]: 'OmittedMutationOptions',
		[RootType.Subscription]: 'OmittedSubscriptionOptions',
	}[rootType]

	const fragmentRequiredSymbol = generateDefaultFragments
		? '?'
		: ''

	const fragmentProp = hasResultType
		? `fragment${fragmentRequiredSymbol}: string,`
		: ''

	const fragmentType = hasResultType
		? '& FragmentOptions'
		: ''

	if (!hasProps) {
		return `
	${methodName}(
		${fragmentProp}
		options?: GraphqlCallOptions ${fragmentType} & ${omittedOptionsType},
	) {
	${renderContent()}
	}`
	}

	// with props
	return `
	${methodName}(
		props: ${propsType},
		${fragmentProp}
		options?: GraphqlCallOptions ${fragmentType} & ${omittedOptionsType},
	) {
	${renderContent()}
	}`
}
