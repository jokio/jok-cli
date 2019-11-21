import ansiEscapes from 'ansi-escapes'
import chalk from 'chalk'
import ora from 'ora'
const ms = require('ms')

export function info(msg) {
	console.log(`${chalk.gray('>')} ${msg}`)
}

export function error(msg) {
	let r = msg
	if (msg instanceof Error) {
		r = msg.message
	}

	console.error(`${chalk.red('> Error!')} ${r}`)
}

export function success(msg) {
	console.log(`${chalk.green('> Success!')} ${msg}`)
}

export function time() {
	const start = new Date()
	return chalk.gray(`[${ms(<any> new Date() - <any> start)}]`)
}

export function wait(msg) {
	const spinner = ora(chalk.green(msg))
	spinner.color = 'green'
	spinner.start()

	return function () {
		spinner.stop()
		process.stdout.write(ansiEscapes.eraseLine)
	}
}

export function prompt(opts) {
	return new Promise(function (resolve, reject) {
		opts.forEach(function (val, i) {
			const text = val[1]
			console.log(`${chalk.gray('>')} [${chalk.bold(i + 1)}] ${text}`)
		})

		const stdin: any = process.stdin

		const ondata = v => {
			const s = v.toString()

			function cleanup() {
				stdin.setRawMode(false)
				process.stdin.removeListener('data', ondata)
			}

			if (s === '\u0003') {
				cleanup()
				reject(new Error('Aborted'))
				return
			}

			const n = Number(s)
			if (opts[n - 1]) {
				cleanup()
				resolve(opts[n - 1][0])
			}
		}

		stdin.setRawMode(true)
		process.stdin.resume()
		process.stdin.on('data', ondata)
	})
}

export function cmd(x) {
	return chalk.bold(chalk.cyan(x))
}

export function code(x) {
	return `${chalk.gray('`')}${chalk.bold(x)}${chalk.gray('`')}`
}

export function param(x) {
	return chalk.bold(`${chalk.gray('{')}${chalk.bold(x)}${chalk.gray('}')}`)
}
