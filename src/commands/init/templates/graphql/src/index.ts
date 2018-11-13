import { GraphQLServer } from 'graphql-yoga'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'
import resolvers from './resolvers'


const server = new GraphQLServer({
	typeDefs: './schemas/schema.graphql',
	resolvers,
})

server.express.use('/voyager', voyagerMiddleware({ endpointUrl: '/' }))

server.start({ port: 4000 }, ({ port }) => console.log(`Server is running on localhost:${port}`))
