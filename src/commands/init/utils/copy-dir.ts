import * as fs from 'fs-extra'
import * as path from 'path'
import * as output from '../../../integration/output'
import * as messages from '../messages'

export default function copyDir(opts) {
	const templatePath = opts.templatePath
	const templateName = opts.templateName
	const projectPath = opts.projectPath
	const projectName = opts.projectName

	console.log(messages.copying(projectName, templateName))

	const files = [
		{ from: './_gitignore', to: './.gitignore' },
	]

	return new Promise(function (resolve, reject) {
		const stopCopySpinner = output.wait('Copying files')

		fs.copy(templatePath, projectPath)
			.then(() => {
				return Promise.all(files.map(x => {
					const fromFullPath = path.resolve(projectPath, x.from)
					const toFullPath = path.resolve(projectPath, x.to)

					return fs.pathExists(fromFullPath).then(exists =>
						exists
							? fs.move(fromFullPath, toFullPath)
							: Promise.resolve(null),
					)
				}))
			})
			.then(() => {
				stopCopySpinner()
				output.success(`Created files for "${output.cmd(projectName)}" jokio app`)

				resolve(fs)
			})
			.catch((err) => {
				console.error(err)
				stopCopySpinner()
				output.error('Copy command failed, try again.')
				reject(err)
				process.exit(1)
			})
	})
}
