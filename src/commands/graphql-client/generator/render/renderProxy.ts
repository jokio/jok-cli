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


export interface Client {
	query: Query
	mutation: Mutation
	subscription: Subscription
}

export default function (client: ApolloClient<any>): Client {
	return {
		query: new Query(client),
		mutation: new Mutation(client),
		subscription: new Subscription(client),
	}
}
`
}
