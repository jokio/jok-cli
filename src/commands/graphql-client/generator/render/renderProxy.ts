import renderImports from './renderImports'

export default function ({
	generatedOtherTypes,
	generatedQuery,
	generatedMutation,
	generatedSubscription,
}) {
	return `${renderImports()}

// types
${generatedOtherTypes}

${generatedQuery || ''}
${generatedMutation || ''}
${generatedSubscription || ''}

interface GraphqlCallOptions {
	fetchPolicy?: FetchPolicy
}

interface DefaultOptions {
	${generatedQuery ? 'query?: GraphqlCallOptions' : ''}
	${generatedMutation ? 'mutation?: GraphqlCallOptions' : ''}
	${generatedSubscription ? 'subscription?: GraphqlCallOptions' : ''}
}

export interface Client {
	${generatedQuery ? 'query: Query' : ''}
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
`
}
