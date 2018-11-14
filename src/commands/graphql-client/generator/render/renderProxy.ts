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

${generatedQuery}
${generatedMutation}
${generatedSubscription}

interface GraphqlCallOptions {
	fetchPolicy?: FetchPolicy
}

interface DefaultOptions {
	query?: GraphqlCallOptions
	mutation?: GraphqlCallOptions
	subscription?: GraphqlCallOptions
}

export interface Client {
	query: Query
	mutation: Mutation
	subscription: Subscription
}

export default function (client: ApolloClient<any>, defaultOptions: DefaultOptions = {}): Client {
	return {
		query: new Query(client, defaultOptions.query || {}),
		mutation: new Mutation(client, defaultOptions.mutation || {}),
		subscription: new Subscription(client, defaultOptions.subscription || {}),
	}
}
`
}
