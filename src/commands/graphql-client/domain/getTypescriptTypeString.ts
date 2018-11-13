import { IntrospectionTypeRef } from 'graphql'

export default function getTypescriptTypeString({
	type,
}: Props) {
	switch (type.kind) {
		case 'INPUT_OBJECT':
		case 'ENUM':
		case 'OBJECT':
		case 'INTERFACE':
		case 'SCALAR':
		case 'UNION':
			return type.name

		case 'SCALAR':
			return type.name

		case 'NON_NULL':
			return getTypescriptTypeString({ type: type.ofType })

		case 'LIST':
			return `${getTypescriptTypeString({ type: type.ofType })}[]`

		default:
			throw new Error(`UNKNOWN_TYPE_KIND`)
	}
}

interface Props {
	type: IntrospectionTypeRef
}
