import { IntrospectionInputValue } from 'graphql'

export default function buildVariablesPassString(inputs: ReadonlyArray<IntrospectionInputValue>) {
	if (!inputs.length)
		return ''

	const items = inputs
		.map(x => `${x.name}: $${x.name}`)
		.join(', ')

	return `(${items})`
}
