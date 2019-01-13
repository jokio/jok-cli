import {
	IntrospectionEnumType,
	IntrospectionInputObjectType,
	IntrospectionObjectType,
	IntrospectionScalarType,
	IntrospectionType,
	IntrospectionUnionType,
} from 'graphql'
import getTypescriptField from './getTypescriptField'

export default function (type: IntrospectionType) {

	if (type.name.startsWith('__')) {
		return
	}

	switch (type.kind) {
		case 'OBJECT':
			return objectType(type)

		case 'INPUT_OBJECT':
			return inputObjectType(type)

		case 'ENUM':
			return enumType(type)

		case 'SCALAR':
			return scalarType(type)

		case 'UNION':
			return unionType(type)

		default:
			console.log('MISSED GENERATION FOR', type.kind, type.name)
			return
	}
}

function objectType(type: IntrospectionObjectType) {
	const fields = type.fields
		.map(x => getTypescriptField(x.name, x.type, { isNull: false, isList: false }))
		.map(x => `\t${x}`)
		.join('\n')

	const typeName = type.name

	return `
export interface ${typeName} {
${fields}
}`
}

function inputObjectType(type: IntrospectionInputObjectType) {
	const fields = type.inputFields
		.map(x => getTypescriptField(x.name, x.type, { isNull: false, isList: false }))
		.map(x => `\t${x}`)
		.join('\n')

	const typeName = type.name

	return `
export interface ${typeName} {
${fields}
}`
}

function enumType(type: IntrospectionEnumType) {
	const typeName = type.name
	const fields = type.enumValues
		.map(x => `\t${x.name} = '${x.name}',`)
		.join('\n')

	return `
export enum ${typeName} {
${fields}
}`
}

function scalarType(type: IntrospectionScalarType) {
	const typeName = type.name
	let tsType = ''

	switch (typeName) {
		case 'ID':
			tsType = 'any'
			break

		case 'String':
			tsType = 'string'
			break

		case 'Int':
			tsType = 'number'
			break

		case 'Float':
			tsType = 'number'
			break

		case 'Boolean':
			tsType = 'boolean'
			break

		case 'DateTime':
		case 'Time':
			tsType = 'Date'
			break

		// Date already exists in JS
		case 'Date':
			return ''

		case 'JSON':
			tsType = 'any'
			break

		default:
			console.log('MISSED SCALAR TYPE', typeName)
			return ''
	}

	return `type ${typeName} = ${tsType}`
}

function unionType(type: IntrospectionUnionType) {
	const typeName = type.name
	const valueTypes = type.possibleTypes
		.map(x => x.name).join(' | ')

	return `export type ${typeName} = ${valueTypes}`
}
