import Express from 'express'
import nextjslib from 'next'

async function run({ port }) {
	const express = Express()

	const nextApp = nextjslib({
		dev: true,
		dir: './src/',
	})

	const nextHandler = nextApp.getRequestHandler()

	await nextApp.prepare()

	express.get('*', (req, res) => nextHandler(req, res))

	express.listen(port, () => {
		console.log(`express started at: http://localhost:${port}`)
	})
}

run({ port: 3000 })
