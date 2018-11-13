import { IntrospectionTypeRef } from 'graphql'
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter'

export default function getGraphqlTypeString({
	type,
	capitalizeName,
	onlyName,
}: Props) {
	switch (type.kind) {
		case 'INPUT_OBJECT':
		case 'ENUM':
		case 'OBJECT':
		case 'INTERFACE':
		case 'SCALAR':
		case 'UNION':
			return capitalizeName
				? capitalizeFirstLetter(type.name)
				: type.name

		case 'NON_NULL':
			return !onlyName
				? getGraphqlTypeString({ type: type.ofType, capitalizeName, onlyName }) + '!'
				: getGraphqlTypeString({ type: type.ofType, capitalizeName, onlyName })

		case 'LIST':
			return !onlyName
				? `[${getGraphqlTypeString({ type: type.ofType, capitalizeName, onlyName })}]`
				: getGraphqlTypeString({ type: type.ofType, capitalizeName, onlyName })

		default:
			throw new Error(`UNKNOWN_TYPE_KIND`)
	}
}

interface Props {
	type: IntrospectionTypeRef
	capitalizeName?: boolean
	onlyName?: boolean
}
