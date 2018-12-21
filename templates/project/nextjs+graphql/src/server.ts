// Note: express is only used if you use the ApolloServer.listen API to create
// an express app for you instead of applyMiddleware (which you might not even
// use with express). The dependency is unused otherwise, so don't worry if
// you're not using express or your version doesn't quite match up.
import {
	ApolloServer as ApolloServerBase,
	Config,
	CorsOptions,
} from 'apollo-server-express'
import express from 'express'
import http from 'http'
import net from 'net'

export interface ServerInfo {
	address: string
	family: string
	url: string
	subscriptionsUrl: string
	port: number | string
	subscriptionsPath: string
	server: http.Server
}

export class ApolloServer extends ApolloServerBase {
	public express: express.Express
	private httpServer?: http.Server
	private cors?: CorsOptions | boolean
	private path?: string

	constructor(config: Config & {
		cors?: CorsOptions | boolean,
		express?: express.Express,
		path?: string,
	}) {
		super(config)
		this.cors = config && config.cors
		this.path = config && config.path
		this.express = (config && config.express) || (express && express())
	}

	private createServerInfo(
		server: http.Server,
		subscriptionsPath?: string,
	): ServerInfo {
		const serverInfo: any = {
			...(server.address() as net.AddressInfo),
			server,
			subscriptionsPath,
		}

		// Convert IPs which mean "any address" (IPv4 or IPv6) into localhost
		// corresponding loopback ip. Note that the url field we're setting is
		// primarily for consumption by our test suite. If this heuristic is
		// wrong for your use case, explicitly specify a frontend host (in the
		// `frontends.host` field in your engine config, or in the `host`
		// option to ApolloServer.listen).
		let hostForUrl = serverInfo.address
		if (serverInfo.address === '' || serverInfo.address === '::') {
			hostForUrl = 'localhost'
		}

		serverInfo.url = require('url').format({
			protocol: 'http',
			hostname: hostForUrl,
			port: serverInfo.port,
			pathname: this.graphqlPath,
		})

		serverInfo.subscriptionsUrl = require('url').format({
			protocol: 'ws',
			hostname: hostForUrl,
			port: serverInfo.port,
			slashes: true,
			pathname: subscriptionsPath,
		})

		return serverInfo
	}

	public applyMiddleware() {
		throw new Error(
			'To use Apollo Server with an existing express application, please use apollo-server-express',
		)
	}

	// Listen takes the same arguments as http.Server.listen.
	public async prepare() {
		await this.willStart()

		// This class is the easy mode for people who don't create their own express
		// object, so we have to create it.
		const app = this.express

		// provide generous values for the getting started experience
		super.applyMiddleware({
			app,
			path: this.path || '/',
			bodyParserConfig: { limit: '50mb' },
			cors:
				typeof this.cors !== 'undefined'
					? this.cors
					: {
						origin: '*',
					},
		})

		const httpServer = http.createServer(app)
		this.httpServer = httpServer

		if (this.subscriptionServerOptions) {
		this.installSubscriptionHandlers(httpServer)
		}

		const listen = async (...opts: Array<any>) => {

			await new Promise(resolve => {
				httpServer.once('listening', resolve)
				// If the user passed a callback to listen, it'll get called in addition
				// to our resolver. They won't have the ability to get the ServerInfo
				// object unless they use our Promise, though.
				httpServer.listen(...(opts.length ? opts : [{ port: 4000 }]))
			})

			return this.createServerInfo(httpServer, this.subscriptionsPath)
		}

		return listen
	}

	listen(...opts: Array<any>): Promise<ServerInfo> {
		return this.prepare().then(startListening => startListening(...opts))
	}

	public async stop() {
		if (this.httpServer) {
			const httpServer = this.httpServer
			await new Promise(resolve => httpServer.close(resolve))
			this.httpServer = undefined
		}
		await super.stop()
	}
}
