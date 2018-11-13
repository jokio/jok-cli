import * as consoleOutput from '../../integration/output'
import run from './run'

export default function ({
	endpointUrl,
	output: outputUrl,
}) {
	const stopSpinner = consoleOutput.wait('Reading remote url')

	run({
		graphqlUrl: endpointUrl,
		outputUrl,
	}).then(() => {
		stopSpinner()
		consoleOutput.success('Generated successfully')
	}).catch(err => {
		stopSpinner()
		consoleOutput.error(err)
	})
}
