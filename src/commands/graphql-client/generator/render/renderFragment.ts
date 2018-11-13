import { IntrospectionOutputTypeRef, IntrospectionType } from 'graphql'

export default function (type: IntrospectionType) {

	let fieldNames: string[] = []

	if (type.kind === 'OBJECT' || type.kind === 'INTERFACE') {
		fieldNames = type.fields
			.filter(x => isKindAllowed(x.type))
			.map(x => `\t\t\t\t${x.name}`)
	}

	return `		if (!fragment) {
			fragment = \`{
${fieldNames.join('\n')}
			}\`
		}
`
}

function isKindAllowed(type: IntrospectionOutputTypeRef) {
	switch (type.kind) {
		case 'ENUM':
		case 'SCALAR':
			return true

		case 'NON_NULL':
		case 'LIST':
			return isKindAllowed(type.ofType)

		default:
			return false
	}
}
