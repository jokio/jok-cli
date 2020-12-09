import * as execa from 'execa'
import * as consoleOutput from '../../integration/output'
import run from './run'

export default function ({
  endpointUrl,
  output: outputUrl,
  generateDefaultFragments = false,
  useApolloClientV3 = false,
  includeTypeName = false,
}) {
  const stopSpinner = consoleOutput.wait(
    'Fetching graphql endpoint (schema introspection)',
  )

  run({
    graphqlUrl: endpointUrl,
    outputUrl,
    generateDefaultFragments,
    useApolloClientV3,
    includeTypeName,
  })
    .then(async () => {
      let isTslintApplied = false

      try {
        // try to apply tslint rules (if tslint available)
        await execa('tslint', ['--fix', outputUrl])
        isTslintApplied = true
      } catch {
        // just ignore
      }

      stopSpinner()
      consoleOutput.success(`Generated successfully at: ${outputUrl}`)
      if (isTslintApplied) {
        consoleOutput.success(`Applied tslint rules`)
      }
    })
    .catch(err => {
      stopSpinner()
      consoleOutput.error(err)
    })
}
