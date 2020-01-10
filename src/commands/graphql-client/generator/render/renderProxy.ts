import renderImports from './renderImports'

export default function ({
	generatedOtherTypes,
	generatedQuery,
	generatedWatchQuery,
	generatedRefetchQuery,
	generatedMutation,
	generatedSubscription,
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
${generatedMutation || ''}
${generatedSubscription || ''}

// helper types
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
${generatedQuery ? `
type OmittedQueryOptions = Omit<Partial<QueryOptions<OperationVariables>>, 'query' | 'variables'>
type OmittedWatchQueryOptions = Omit<Partial<WatchQueryOptions<OperationVariables>>, 'variables' | 'query'>` : ''}
${generatedMutation ? `
type OmittedMutationOptions = Omit<Partial<MutationOptions<OperationVariables>>, 'mutation' | 'variables'>` : ''}
${generatedSubscription ? `
type OmittedSubscriptionOptions = Omit<Partial<SubscriptionOptions<OperationVariables>>, 'query' | 'variables'>` : ''}



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
	${generatedRefetchQuery ? 'refetchQuery: RefetchQuery' : ''}
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
		generatedRefetchQuery
			? 'refetchQuery: new RefetchQuery(client, defaultOptions.query || {}),'
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
