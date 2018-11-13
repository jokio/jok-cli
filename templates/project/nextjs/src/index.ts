import * as Express from 'express'
import * as nextjslib from 'next'

function run({ port }) {
	const express = Express()

	const nextApp = nextjslib({
		dev: true,
		dir: './src/',
	})

	const nextHandler = nextApp.getRequestHandler()

	return nextApp.prepare().then(() => {
		express.get('*', (req, res) => nextHandler(req, res))

		express.listen(port, () => {
			console.log(`express started at: http://localhost:${port}`)
		})
	})
}

run({ port: 3000 })
