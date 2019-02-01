import renderImports from './renderImports'

export default function ({
	generatedOtherTypes,
	generatedQuery,
	generatedWatchQuery,
	generatedMutation,
	generatedSubscription,
}) {
	return `${renderImports()}

// tslint:disable

// types
${generatedOtherTypes}

${generatedQuery || ''}
${generatedWatchQuery || ''}
${generatedMutation || ''}
${generatedSubscription || ''}

// helper types
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
${generatedQuery ? `
type OmittedQueryOptions = Omit<Partial<QueryOptions<OperationVariables>>, 'query' | 'variables'>
type OmittedWatchQueryOptions = Omit<Partial<WatchQueryOptions<OperationVariables>>, 'variables' | 'query'>
` : ''}
${generatedMutation ? `
type OmittedMutationOptions = Omit<Partial<MutationOptions<OperationVariables>>, 'mutation' | 'variables'>
` : ''}
${generatedSubscription ? `
type OmittedSubscriptionOptions = Omit<Partial<SubscriptionOptions<OperationVariables>>, 'query' | 'variables'>
` : ''}



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
	${generatedMutation ? `mutation?: Omit<GraphqlCallOptions, 'fetchPolicy'>` : ''}
	${generatedSubscription ? `subscription?: Omit<GraphqlCallOptions, 'errorPolicy'>` : ''}
}

export interface Client {
	${generatedQuery ? 'query: Query' : ''}
	${generatedWatchQuery ? 'watchQuery: WatchQuery' : ''}
	${generatedMutation ? 'mutation: Mutation' : ''}
	${generatedSubscription ? 'subscription: Subscription' : ''}
}

export default function (client: ApolloClient<any>, defaultOptions: DefaultOptions = {}): Client {
	return {
		${
		generatedQuery
			? 'query: new Query(client, defaultOptions.query || {}),'
			: ''
		}
		${
		generatedWatchQuery
			? 'watchQuery: new WatchQuery(client, defaultOptions.query || {}),'
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
`
}
