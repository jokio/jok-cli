import { IntrospectionInputValue } from 'graphql'
import getGraphqlTypeString from './getGraphqlTypeString'

export default function buildVariablesDeclarationString(
  inputs: ReadonlyArray<IntrospectionInputValue>,
) {
  if (!inputs.length) {
    return ''
  }

  const argsList = inputs
    .map(x => `$${x.name}: ${getGraphqlTypeString({ type: x.type })}`)
    .join(', ')

  return `(${argsList})`
}
