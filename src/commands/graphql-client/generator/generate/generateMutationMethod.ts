import { IntrospectionField, IntrospectionType } from 'graphql'
import buildVariablesDeclarationString from '../../domain/buildVariablesDeclarationString'
import buildVariablesPassString from '../../domain/buildVariablesPassString'
import getGraphqlTypeString from '../../domain/getGraphqlTypeString'
import getTypescriptPropsTypeName from '../../domain/getTypescriptPropsTypeName'
import getTypescriptTypeString from '../../domain/getTypescriptTypeString'
import { RootType } from '../../utils/rootType'
import uncapitalizeFirstLetter from '../../utils/uncapitalizeFirstLetter'
import generatePropsType from '../helper/generatePropsType'
import generateResultTypeFields from '../helper/generateResultTypeFields'
import renderApolloCall from '../render/renderApolloCall'
import renderFragment from '../render/renderFragment'
import renderMethod from '../render/renderMethod'
import renderMutation from '../render/renderMutation'
import renderOptions from '../render/renderOptions'

export default function (
  field: IntrospectionField,
  types: IntrospectionType[],
  generateDefaultFragments: boolean,
) {
  const queryName = field.name
  const propsType = getTypescriptPropsTypeName('Mutation', queryName)
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

  const props = generatePropsType(propsType, inputs)

  const resultTypeFields = generateResultTypeFields(field.type, types)
  const hasResultType = !!resultTypeFields

  const variablesDeclarationString = buildVariablesDeclarationString(
    inputs,
  )
  const variablesString = buildVariablesPassString(inputs)

  const type = <IntrospectionType>(
    types.find(x => x.name === returnGraphqlTypeName)
  )

  const method = renderMethod({
    rootType: RootType.Mutation,
    methodName,
    generateDefaultFragments,
    hasProps: hasInputs,
    propsType,
    hasResultType,
    returnClassFullname,
    renderContent: () =>
      // Render Query
      renderOptions(fragmentName, hasResultType) +
      (hasResultType
        ? renderFragment(
            type,
            generateDefaultFragments,
            returnGraphqlTypeName,
          )
        : '') +
      renderMutation({
        hasFragment: hasResultType,
        queryName,
        variablesDeclarationString,
        variablesString,
      }) +
      renderApolloCall({
        rootType: RootType.Mutation,
        hasVariables: hasInputs,
        queryName,
        returnType: returnClassFullname,
      }),
  })

  return {
    method,
    props,
  }
}
