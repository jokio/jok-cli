import chalk from 'chalk'
// const getInstallCmd = require('./utils/get-install-cmd')
import * as output from '../../integration/output'

const program = {
	name: 'jok',
}

export function help() {
	return `
    Only ${chalk.green('<project-directory>')} is required.

    If you have any problems, do not hesitate to file an issue:
      ${chalk.cyan('https://github.com/jokio/jok-cli/issues/new')}
  `
}

export function exampleHelp() {
	return `Example from https://github.com/jokio/jok-cli/tree/master/examples/ ${output.param('example-path')}`
}

export function missingProjectName() {
	return `
Please specify the project directory:

  ${chalk.cyan(program.name)} ${chalk.green('<project-directory>')}

For example:

  ${chalk.cyan(program.name)} ${chalk.green('my-jokio-app')}
  ${chalk.cyan(program.name)} ${chalk.cyan('--example custom-server')} ${chalk.green('custom-server-app')}

Run ${chalk.cyan(`${program.name} --help`)} to see all options.
`
}

export function alreadyExists(projectName) {
	return `
Uh oh! Looks like there's already a`
		+ ` directory called ${chalk.red(projectName)}. Please try a different name or delete that folder.`
}

export function installing(packages) {
	const pkgText = packages.map(function (pkg) {
		return `    ${chalk.cyan(chalk.bold(pkg))}`
	}).join('\n')

	return `
  Installing npm modules:
${pkgText}
`
}

export function installError(packages) {
	const pkgText = packages.map(function (pkg) {
		return `${chalk.cyan(chalk.bold(pkg))}`
	}).join(', ')

	output.error(`Failed to install ${pkgText}, try again.`)
}

export function copying(projectName, templateName) {
	return `
Creating ${chalk.bold(chalk.green(projectName))} ${chalk.gray('(template: ' + templateName + ')')}...
`
}

export function start(projectName) {
	// const cmd = getInstallCmd()

	// const commands = {
	// 	install: cmd === 'npm' ? 'npm install' : 'yarn',
	// 	build: cmd === 'npm' ? 'npm run build' : 'yarn build',
	// 	start: cmd === 'npm' ? 'npm run start' : 'yarn start',
	// 	dev: cmd === 'npm' ? 'npm run dev' : 'yarn dev',
	// }

	return `
  Next steps:

  $ ${output.cmd(`code ${projectName}`)}
`
}
