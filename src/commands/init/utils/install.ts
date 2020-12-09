import * as execa from 'execa'
import * as output from '../../../integration/output'
import * as messages from '../messages'
import getInstallCmd from './get-install-cmd'

export default async function (opts) {
  const projectName = opts.projectName
  const projectPath = opts.projectPath
  const packages = opts.packages || []

  const installCmd = getInstallCmd()

  process.chdir(projectPath)

  const stopInstallSpinner = output.wait('Installing modules')

  try {
    const result = await execa(installCmd, ['install'])

    stopInstallSpinner()
    output.success(`Installed dependencies for ${projectName}`)

    return result
  } catch (err) {
    console.log(err)
    stopInstallSpinner()
    console.log(messages.installError(packages))

    throw new Error(`${installCmd} installation failed`)
  }
}

// function getInstallArgs(cmd, packages) {
// 	if (cmd === 'npm') {
// 		const args = ['install', '--save', '--save-exact']
// 		return args.concat(packages, ['--verbose'])
// 	} else if (cmd === 'yarn') {
// 		const args = ['add']
// 		return args.concat(packages)
// 	}
// }
