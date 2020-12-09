import { IntrospectionType } from 'graphql'
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter'

export default function (types: IntrospectionType[]) {
  if (!types.length) {
    return null
  }

  const renderedFields = types
    .filter(x => !x.name.startsWith('__'))
    .map(x => capitalizeFirstLetter(x.name))
    .map(x => `	${x} = '${x}',`)
    .join('\n')

  return `
export enum QueryObjectTypes {
${renderedFields}
}
	`
}
