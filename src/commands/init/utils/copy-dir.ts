const path = require('path')
const Promise = require('promise')
const messages = require('../messages')
const output = require('./output')
const fs = require('fs-extra')

export default function copyDir(opts) {
	const templatePath = opts.templatePath
	const templateName = opts.templateName
	const projectPath = opts.projectPath
	const projectName = opts.projectName

	console.log(messages.copying(projectName, templateName))

	return new Promise(function (resolve, reject) {
		const stopCopySpinner = output.wait('Copying files')

		fs.copy(templatePath, projectPath)
			.then(function () {
				return fs.move(
					path.resolve(projectPath, './__gitignore'),
					path.resolve(projectPath, './.gitignore'),
				)
			})
			.then(function () {
				return fs.move(
					path.resolve(projectPath, './__editorconfig'),
					path.resolve(projectPath, './.editorconfig'),
				)
			})
			// .then(function () {
			//   return fs.move(
			//     path.resolve(projectPath, './__travis.yml'),
			//     path.resolve(projectPath, './.travis.yml')
			//   )
			// })
			.then(function () {
				return fs.move(
					path.resolve(projectPath, './__package.json'),
					path.resolve(projectPath, './package.json'),
				)
			})
			.then(function () {
				return fs.move(
					path.resolve(projectPath, './__dockerignore'),
					path.resolve(projectPath, './.dockerignore'),
				)
			})
			.then(function () {
				return fs.move(
					path.resolve(projectPath, './__env'),
					path.resolve(projectPath, './.env'),
				)
			})
			.then(function () {
				stopCopySpinner()
				output.success(`Created files for "${output.cmd(projectName)}" jokio app`)
				// return this
			})
			.then(resolve)
			.catch(function (err) {
				console.error(err)
				stopCopySpinner()
				output.error('Copy command failed, try again.')
				reject(err)
				process.exit(1)
			})
	})
}
