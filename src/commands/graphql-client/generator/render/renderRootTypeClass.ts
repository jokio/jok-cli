export default function ({
  className,
  renderPropTypes,
  renderMethods,
  isWatchQuery,
  onlyDocument,
}) {
  return `
// ${className} props -----------------------------------
${renderPropTypes()}

// ${className} apis ------------------------------------
export class ${className}${onlyDocument ? 'Document' : ''} {

	constructor(private client: ApolloClient<any>, private defaultOptions: GraphqlCallOptions = {} ${
    isWatchQuery
      ? ', private subscriptionDocument: SubscriptionDocument = null'
      : ''
  }) { }
${renderMethods()}
}
`
}
