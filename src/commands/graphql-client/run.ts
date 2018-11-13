import generateProxy from './generator/generateProxy'
import getIntropsectionSchema from './integration/getIntropsectionSchema'
import saveGeneratedFile from './integration/saveGeneratedFile'

export default async function ({
	graphqlUrl,
	outputUrl,
}) {
	const introspectionSchema = await getIntropsectionSchema(graphqlUrl)
	const output = generateProxy(introspectionSchema)

	saveGeneratedFile(outputUrl, output)
}
