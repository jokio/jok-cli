import generateProxy from './generator/generateProxy'
import getIntropsectionSchema from './integration/getIntropsectionSchema'
import saveGeneratedFile from './integration/saveGeneratedFile'

export default async function ({
  graphqlUrl,
  outputUrl,
  generateDefaultFragments,
}) {
  const introspectionSchema = await getIntropsectionSchema(graphqlUrl)
  const output = generateProxy(
    introspectionSchema,
    generateDefaultFragments,
  )

  saveGeneratedFile(outputUrl, output)
}
