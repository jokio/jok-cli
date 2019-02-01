import { IntrospectionField, IntrospectionType } from 'graphql'
import buildVariablesDeclarationString from '../../domain/buildVariablesDeclarationString'
import buildVariablesPassString from '../../domain/buildVariablesPassString'
import getGraphqlTypeString from '../../domain/getGraphqlTypeString'
import getTypescriptPropsTypeName from '../../domain/getTypescriptPropsTypeName'
import getTypescriptTypeString from '../../domain/getTypescriptTypeString'
import { RootType } from '../../utils/rootType'
import uncapitalizeFirstLetter from '../../utils/uncapitalizeFirstLetter'
import generateResultTypeFields from '../helper/generateResultTypeFields'
import renderApolloCall from '../render/renderApolloCall'
import renderFragment from '../render/renderFragment'
import renderMethod from '../render/renderMethod'
import renderOptions from '../render/renderOptions'
import renderQuery from '../render/renderQuery'

export default function (field: IntrospectionField, types: IntrospectionType[], generateDefaultFragments: boolean) {

	const queryName = field.name
	const propsType = getTypescriptPropsTypeName('Query', queryName)
	const inputs = field.args || []
	const methodName = uncapitalizeFirstLetter(queryName)
	const hasInputs = !!inputs.length

	const returnClassFullname = getTypescriptTypeString({
		type: field.type,
	})

	const returnClassName = getGraphqlTypeString({
		type: field.type,
		capitalizeName: true,
		onlyName: true,
	})

	const returnGraphqlTypeName = returnClassName
	const fragmentName = returnClassName + 'Data'

	const resultTypeFields = generateResultTypeFields(field.type, types)
	const hasResultType = !!resultTypeFields

	const variablesDeclarationString = buildVariablesDeclarationString(inputs)
	const variablesString = buildVariablesPassString(inputs)

	const type = <IntrospectionType> types.find(x => x.name === returnGraphqlTypeName)

	const method = renderMethod({
		rootType: 'watchQuery',
		methodName,
		generateDefaultFragments,
		hasProps: hasInputs,
		propsType,
		hasResultType,
		renderContent: () =>
			// Render Query
			renderOptions(fragmentName, hasResultType) +
			(hasResultType
				? renderFragment(type, generateDefaultFragments, returnGraphqlTypeName)
				: '') +
			renderQuery({
				hasFragment: hasResultType,
				queryName,
				variablesDeclarationString,
				variablesString,
			}) +
			renderApolloCall({
				rootType: RootType.Query,
				hasVariables: hasInputs,
				queryName,
				returnType: returnClassFullname,
				isWatchQuery: true,
			}),
	})

	return {
		method,

		// props will be generated for Query
		// so there is no need to do anything
		props: '',
	}
}
