import renderImports from './renderImports'

export default function ({
  generatedOtherTypes,
  generatedQuery,
  generatedWatchQuery,
  generatedRefetchQuery,
  generatedCacheWriteQuery,
  generatedMutation,
  generatedSubscription,
  generatedSubscriptionDocument,
  generatedQueryTypesEnum,
}) {
  return `${renderImports()}

// tslint:disable

// types enum
${generatedQueryTypesEnum || ''}

// types
${generatedOtherTypes}

${generatedQuery || ''}
${generatedWatchQuery || ''}
${generatedRefetchQuery || ''}
${generatedCacheWriteQuery || ''}
${generatedMutation || ''}
${generatedSubscription || ''}
${generatedSubscriptionDocument || 'class SubscriptionDocument { }'}

// helper types
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
${
  generatedQuery
    ? `
type OmittedQueryOptions = Omit<Partial<QueryOptions<OperationVariables>>, 'query' | 'variables'>
type OmittedWatchQueryOptions = Omit<Partial<WatchQueryOptions<OperationVariables>>, 'variables' | 'query'>

type SubscribeToMoreOptions = {
	subscribeToMore?:
	  {
		graphqlDocument: { document: any, variables?: any } | ((subscription: SubscriptionDocument) => { document: any, variables?: any }),
		updateQuery: UpdateQueryFn<User, any, any>
	  }[]
}

`
    : ''
}
${
  generatedMutation
    ? `
type OmittedMutationOptions = Omit<Partial<MutationOptions<OperationVariables>>, 'mutation' | 'variables'>`
    : ''
}
${
  generatedSubscription
    ? `
type OmittedSubscriptionOptions = Omit<Partial<SubscriptionOptions<OperationVariables>>, 'query' | 'variables'>`
    : ''
}


interface FragmentOptions {
	fragmentName?: string
}

interface GraphqlCallOptions {
	fetchPolicy?: FetchPolicy
	errorPolicy?: ErrorPolicy
}

interface DefaultOptions {
	${generatedQuery ? 'query?: GraphqlCallOptions' : ''}
	${generatedWatchQuery ? 'watchQuery?: GraphqlCallOptions' : ''}
	${
    generatedMutation
      ? `mutation?: Omit<GraphqlCallOptions, 'fetchPolicy'>`
      : ''
  }
	${
    generatedSubscription
      ? `subscription?: Omit<GraphqlCallOptions, 'errorPolicy'>`
      : ''
  }
}

export interface Client {
	${generatedQuery ? 'query: Query' : ''}
	${generatedWatchQuery ? 'watchQuery: WatchQuery' : ''}
	${generatedRefetchQuery ? 'refetchQuery: RefetchQuery' : ''}
	${generatedCacheWriteQuery ? 'cacheWriteQuery: CacheWriteQuery' : ''}
	${generatedMutation ? 'mutation: Mutation' : ''}
	${generatedSubscription ? 'subscription: Subscription' : ''}
}

export default function (client: ApolloClient<any>, defaultOptions: DefaultOptions = {}): Client {
	${
    generatedSubscriptionDocument
      ? 'const subscriptionDocument = new SubscriptionDocument(client, defaultOptions.subscription || {})'
      : ''
  }
	return {
		${
      generatedQuery
        ? 'query: new Query(client, defaultOptions.query || {}),'
        : ''
    }
		${
      generatedWatchQuery
        ? `watchQuery: new WatchQuery(client, defaultOptions.query || {}, ${
            generatedSubscriptionDocument
              ? 'subscriptionDocument'
              : 'null'
          }),`
        : ''
    }
		${
      generatedRefetchQuery
        ? 'refetchQuery: new RefetchQuery(client, defaultOptions.query || {}),'
        : ''
    }
		${
      generatedCacheWriteQuery
        ? 'cacheWriteQuery: new CacheWriteQuery(client, defaultOptions.query || {}),'
        : ''
    }
		${
      generatedMutation
        ? 'mutation: new Mutation(client, defaultOptions.mutation || {}),'
        : ''
    }
		${
      generatedSubscription
        ? 'subscription: new Subscription(client, defaultOptions.subscription || {}),'
        : ''
    }
	}
}

function fixObservable(obs: any) {
	(obs as any)[observable] = () => obs
	return obs
}

function getResultData<T>(result, dataFieldName) {
	// if error, throw it
	if (result.errors) {
		throw new Error(<any>result.errors)
	}

	if (!result.data) {
		return <T><any>null
	}

	// cast the result and return (need any for scalar types, to avoid compilation error)
	return <T><any>result.data[dataFieldName]
}

function getFirstFragmentName(fragment: string | Object) {

	if (typeof fragment !== 'object') { return }
	if (
		!fragment['definitions'] ||
		!fragment['definitions'][0] ||
		!fragment['definitions'][0].name ||
		!fragment['definitions'][0].name.value
	) { return }

	return fragment['definitions'][0].name.value
}
`
}
