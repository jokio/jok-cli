import { IntrospectionOutputTypeRef, IntrospectionType } from 'graphql'

export default function (type: IntrospectionType, generateDefaultFragments, graphqlTypeName) {

	let fieldNames: string[] = []

	if (!generateDefaultFragments) {
		return `
		const finishedFragment = fragment
		`
	}

	if (type.kind === 'OBJECT' || type.kind === 'INTERFACE') {
		fieldNames = type.fields
			.filter(x => isKindAllowed(x.type))
			.map(x => `\t\t\t${x.name}`)
	}

	return `
		const finishedFragment = fragment || \`fragment \${fragmentName} on ${graphqlTypeName} {
${fieldNames.join('\n')}
		}\`
`
}

export function isKindAllowed(type: IntrospectionOutputTypeRef) {
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
