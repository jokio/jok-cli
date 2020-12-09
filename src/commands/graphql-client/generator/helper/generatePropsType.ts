import { IntrospectionInputValue } from 'graphql'
import getTypescriptField from './getTypescriptField'

export default function (
  interfaceName: string,
  inputs: ReadonlyArray<IntrospectionInputValue>,
) {
  if (!inputs.length) {
    return ''
  }

  const fields = inputs

    .map(x => getTypescriptField(x.name, x.type))
    .map(x => `\t${x}`)
    .join('\n')

  return `interface ${interfaceName} {
${fields}
}
`
}
