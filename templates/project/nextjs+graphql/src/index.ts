import { express as voyagerMiddleware } from 'graphql-voyager/middleware'
import nextjslib from 'next'
import resolvers from './resolvers'
import typeDefs from './schema'
import { ApolloServer } from './server'

async function run({ port, graphqlPath }) {

	const nextApp = nextjslib({
		dev: true,
		dir: './src/',
	})

	const nextHandler = nextApp.getRequestHandler()

	await nextApp.prepare()

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		path: graphqlPath,
		subscriptions: {
			path: graphqlPath,
		},
	})

	const listen = await server.prepare()

	server.express.use('/voyager', voyagerMiddleware({ endpointUrl: graphqlPath }))
	server.express.all('*', (req, res) => nextHandler(req, res))

	listen({ port }).then(({ url, subscriptionsUrl }) => {
		console.log(`🚀 Server ready at ${url}`)
		console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
	})
}

run({
	port: 3000,
	graphqlPath: '/graphql',
})
