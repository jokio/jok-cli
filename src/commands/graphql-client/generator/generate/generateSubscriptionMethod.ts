import { IntrospectionField } from 'graphql'
import getTypescriptPropsTypeName from '../../domain/getTypescriptPropsTypeName'
import uncapitalizeFirstLetter from '../../utils/uncapitalizeFirstLetter'
import generateProps from '../helper/generatePropsType'

export default function (field: IntrospectionField) {

	const queryName = field.name
	const propsType = getTypescriptPropsTypeName('Subscription', queryName)
	const inputs = field.args || []
	const methodName = uncapitalizeFirstLetter(queryName)

	const props = generateProps(propsType, inputs)

	const method = `
	${methodName}(props: ${propsType}, fragment?: string) {
		// TODO: implement
	}`

	return {
		method,
		props,
	}
}
