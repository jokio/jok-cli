#! /usr/bin/env node

import chalk from 'chalk'
import * as program from 'commander'
const pkg = require('../package.json')

import graphqlClientCommand from './commands/graphql-client'
import initCommand from './commands/init'

program
	.name('Jok CLI')
	.description(pkg.description)
	.version(pkg.version)

// init command
program
	.command('init <directory-name>')
	.description('Initialize new pre-configured project')
	.usage(`[options] ${chalk.green('<directory-name>')}`)
	.option('--nextjs', 'with next.js')
	.option('--graphql', 'with graphql')
	.action((name, { nextjs, graphql }) => {
		initCommand({
			projectName: name,
			nextjs,
			graphql,
		})
	})
	.on('--help', () => {
		console.log()
		console.log('Examples:')
		console.log(`  ${chalk.gray('$')} jok init ${chalk.green('cool-app')}`)
		console.log(`  ${chalk.gray('$')} jok init ${chalk.green('server-app')} --graphql`)
		console.log(`  ${chalk.gray('$')} jok init ${chalk.green('client-app')} --nextjs`)
		console.log()
	})

// graphql-client command
program
	.command('graphql-client')
	.description('Generate graphql client')
	.option('-e, --endpointUrl <endpointUrl>', 'graphql endpoint url', /.+/i)
	.option('-o, --output <output>', 'result file address', /.+/i)
	.action(({ endpointUrl, output }) => {
		if (!endpointUrl || !output) {
			console.warn(`${chalk.red('Missing options')} please pass --endpointUrl and --output`)
			return
		}

		graphqlClientCommand({
			endpointUrl,
			output,
		})
	})
	.on('--help', () => {
		console.log()
		console.log('Examples:')
		console.log(`  ` +
			`${chalk.gray('$')} jok graphql-client ` +
			`--e ${chalk.green('https://server.jok.io')} ` +
			`--o ${chalk.green('src/generated/jokio.ts')}`)
		console.log()
	})

program.parse(process.argv)
