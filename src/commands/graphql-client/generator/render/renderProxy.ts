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

interface GraphqlCallOptions {
	fetchPolicy?: FetchPolicy
}

interface DefaultOptions {
	${generatedQuery ? 'query?: GraphqlCallOptions' : ''}
	${generatedWatchQuery ? 'watchQuery?: GraphqlCallOptions' : ''}
	${generatedMutation ? 'mutation?: GraphqlCallOptions' : ''}
	${generatedSubscription ? 'subscription?: GraphqlCallOptions' : ''}
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
