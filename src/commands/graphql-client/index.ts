import * as consoleOutput from '../../integration/output'
import run from './run'

export default function ({
	endpointUrl,
	output: outputUrl,
}) {
	consoleOutput.wait('Reading remote url')

	run({
		graphqlUrl: endpointUrl,
		outputUrl,
	}).then(() =>
		consoleOutput.success('Generated successfully'),
	)
}
