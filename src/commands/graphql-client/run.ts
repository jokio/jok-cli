import generateProxy from './generator/generateProxy'
import getIntropsectionSchema from './integration/getIntropsectionSchema'
import saveGeneratedFile from './integration/saveGeneratedFile'

export default async function ({
  graphqlUrl,
  outputUrl,
  generateDefaultFragments,
  useApolloClientV3,
  includeTypeName,
  typeNamePrefix,
  typeNamePostfix,
}) {
  const introspectionSchema = await getIntropsectionSchema(graphqlUrl)
  const output = generateProxy(
    introspectionSchema,
    generateDefaultFragments,
    useApolloClientV3,
    includeTypeName,
    typeNamePrefix,
    typeNamePostfix,
  )

  saveGeneratedFile(outputUrl, output)
}
