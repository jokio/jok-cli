import * as execa from 'execa'

let cmd

export default function getInstallCmd() {
  if (cmd) {
    return cmd
  }

  try {
    execa.shellSync('yarnpkg --version')
    cmd = 'yarn'
  } catch (e) {
    cmd = 'npm'
  }

  return cmd
}
