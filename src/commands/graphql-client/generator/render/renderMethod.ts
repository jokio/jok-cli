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
    watchQuery: `OmittedWatchQueryOptions & SubscribeToMoreOptions`,
    cacheWriteQuery: 'OmittedQueryOptions',
    [RootType.Mutation]: 'OmittedMutationOptions',
    [RootType.Subscription]: 'OmittedSubscriptionOptions',
  }[rootType]

  const isCacheWriteQueryMode = rootType === 'cacheWriteQuery'

  const fragmentRequiredSymbol = generateDefaultFragments ? '?' : ''

  const fragmentProp = hasResultType
    ? `fragment${fragmentRequiredSymbol}: string | any,`
    : ''

  const fragmentType = hasResultType ? 'FragmentOptions' : ''

  return `
	${methodName}(
		${hasProps ? `props: ${propsType},` : ``}
		${
      isCacheWriteQueryMode
        ? `data: any,
			${fragmentProp}`
        : `
			${fragmentProp}
			options?: GraphqlCallOptions ${
        fragmentType ? `& ${fragmentType}` : ''
      } & ${omittedOptionsType},`
    }
	) {
	${renderContent()}
	}`
}
