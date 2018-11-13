import * as fs from 'fs'
import * as path from 'path'
import * as messages from './messages'
import copyDir from './utils/copy-dir'
import install from './utils/install'

export default function ({
	projectName,
	nextjs,
	graphql,
}) {
	createJokioApp({
		projectName,
		nextjs,
		graphql,
	})
}

function createJokioApp(opts) {
	const projectName = opts.projectName

	if (!projectName) {
		console.log(messages.missingProjectName())
		process.exit(1)
	}

	if (fs.existsSync(projectName) && projectName !== '.') {
		console.log(messages.alreadyExists(projectName))
		process.exit(1)
	}

	const projectPath = opts.projectPath = process.cwd() + '/' + projectName

	let templateName = 'default'

	if (opts.nextjs) {
		templateName = 'nextjs'
	}

	if (opts.graphql) {
		templateName = 'graphql'
	}

	const templatePath = path.resolve(__dirname, `../../../templates/project/${templateName}`)

	copyDir({
		templatePath: templatePath,
		templateName: templateName,
		projectPath: projectPath,
		projectName: projectName,
	}).then(installWithMessageFactory(opts))
		.catch(function (err) {
			throw err
		})
}

function installWithMessageFactory(opts) {
	const projectName = opts.projectName
	const projectPath = opts.projectPath

	return function installWithMessage() {
		return install({
			projectName: projectName,
			projectPath: projectPath,
			packages: [],
		}).then(function () {
			console.log(messages.start(projectName))
		}).catch(function (err) {
			throw err
		})
	}
}
