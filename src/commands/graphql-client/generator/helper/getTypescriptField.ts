import { IntrospectionTypeRef } from 'graphql'

export default function getTypescriptField(
  fieldName: string,
  type: IntrospectionTypeRef,
  { isNull, isList }: Props,
) {
  switch (type.kind) {
    case 'INPUT_OBJECT':
    case 'ENUM':
    case 'OBJECT':
    case 'INTERFACE':
    case 'SCALAR':
    case 'UNION':
      return buildField(fieldName, type.name, isNull, isList)

    case 'NON_NULL':
      return getTypescriptField(fieldName, type.ofType, {
        isList,
        isNull: true,
      })

    case 'LIST':
      return getTypescriptField(fieldName, type.ofType, {
        isList: true,
        isNull,
      })

    default:
      throw new Error(`UNKNOWN_TYPE_KIND`)
  }
}

const buildField = (fieldName, typeName, isNull, isList) => {
  const nullableSymbol = isNull ? '' : '?'
  const arraySymbol = isList ? '[]' : ''

  return `${fieldName}${nullableSymbol}: ${typeName}${arraySymbol}`
}
interface Props {
  isNull?: boolean
  isList?: boolean
}
