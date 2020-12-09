import { IntrospectionTypeRef } from 'graphql'

export default function getTypescriptField(
  fieldName: string,
  type: IntrospectionTypeRef,
  {
    isNullable = true,
    isList = false,
    isListItemNullable = true,
  }: Props = {
    isNullable: true,
    isList: false,
    isListItemNullable: true,
  },
) {
  switch (type.kind) {
    case 'INPUT_OBJECT':
    case 'ENUM':
    case 'OBJECT':
    case 'INTERFACE':
    case 'SCALAR':
    case 'UNION':
      return buildField(
        fieldName,
        type.name,
        isNullable,
        isList,
        isListItemNullable,
      )

    case 'NON_NULL':
      // if NON_NULL appears before list, then the field/arg is non nullable
      // otherwise the INNER elements are non-nullable
      return getTypescriptField(fieldName, type.ofType, {
        isList,
        isNullable: isList ? isNullable : false,
        isListItemNullable: isList ? false : isListItemNullable,
      })

    case 'LIST':
      return getTypescriptField(fieldName, type.ofType, {
        isList: true,
        isNullable: isNullable,
        isListItemNullable: isListItemNullable,
      })

    default:
      throw new Error(`UNKNOWN_TYPE_KIND`)
  }
}

const buildField = (
  fieldName,
  typeName,
  isNullable,
  isList,
  isListItemNullable,
) => {
  const nullableSymbol = isNullable ? '?' : ''
  if (isList) {
    // if list items can be nullable, allow for array to have undefined fields
    // NOTE: maybe this should be null and not undefined?
    const nullableItems = isListItemNullable
      ? `(${typeName} | undefined)`
      : typeName

    return `${fieldName}${nullableSymbol}: ${nullableItems}[]`
  } else {
    return `${fieldName}${nullableSymbol}: ${typeName}`
  }
}
interface Props {
  /** graphql types are assumed nullable until explicitly marked non-null */
  isNullable?: boolean
  isList?: boolean
  isListItemNullable?: boolean
}
