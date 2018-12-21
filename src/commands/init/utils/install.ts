import * as execa from 'execa'
import * as output from '../../../integration/output'
import * as messages from '../messages'
import getInstallCmd from './get-install-cmd'

export default function (opts) {
	const projectName = opts.projectName
	const projectPath = opts.projectPath
	const packages = opts.packages || []

	const installCmd = getInstallCmd()
	const installArgs = packages.length
		? getInstallArgs(installCmd, packages)
		: []

	process.chdir(projectPath)

	return new Promise(function (resolve, reject) {
		const stopInstallSpinner = output.wait('Installing modules')

		execa(installCmd, installArgs).then(function () {
			// Confirm that all dependencies were installed
			return execa(installCmd, ['install'])
		}).then(function () {
			stopInstallSpinner()
			output.success(`Installed dependencies for ${projectName}`)
			resolve()
		}).catch(function (err) {
			console.log(err)
			stopInstallSpinner()
			console.log(messages.installError(packages))
			return reject(new Error(`${installCmd} installation failed`))
		})
	})
}

function getInstallArgs(cmd, packages) {
	if (cmd === 'npm') {
		const args = ['install', '--save', '--save-exact']
		return args.concat(packages, ['--verbose'])
	} else if (cmd === 'yarn') {
		const args = ['add']
		return args.concat(packages)
	}
}
