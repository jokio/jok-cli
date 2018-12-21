import { express as voyagerMiddleware } from 'graphql-voyager/middleware'
import resolvers from './resolvers'
import typeDefs from './schema'
import { ApolloServer } from './server'

const server = new ApolloServer({
	typeDefs,
	resolvers,
	subscriptions: {
		path: '/',
	},
})

server.express.use('/voyager', voyagerMiddleware({ endpointUrl: '/' }))

server.listen({ port: 4000 }).then(({ url, subscriptionsUrl }) => {
	console.log(`🚀 Server ready at ${url}`)
	console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
})
