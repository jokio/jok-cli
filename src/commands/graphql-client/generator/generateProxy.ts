import { IntrospectionSchema, IntrospectionType } from 'graphql'
import { RootType } from '../utils/rootType'
import generateRootType from './generateRootType'
import generateType from './helper/generateType'
import renderProxy from './render/renderProxy'

export default function (introspectionSchema: IntrospectionSchema) {
	const {
		queryType: { name: queryTypeName },
		types,
	}: IntrospectionSchema = introspectionSchema

	const mutationTypeName = introspectionSchema.mutationType
		? introspectionSchema.mutationType.name
		: null

	const subscriptionTypeName = introspectionSchema.subscriptionType
		? introspectionSchema.subscriptionType.name
		: null

	const queryType = <IntrospectionType> types.find(x => x.name === queryTypeName)
	const mutationType = <IntrospectionType> types.find(x => x.name === mutationTypeName)
	const subscriptionType = <IntrospectionType> types.find(x => x.name === subscriptionTypeName)

	const otherTypes = types.filter(x =>
		(x !== queryType) &&
		(x !== mutationType) &&
		(x !== subscriptionType),
	)

	// start generation
	const generatedQuery = generateRootType(RootType.Query, otherTypes)(queryType)
	const generatedWatchQuery = generateRootType('watchQuery', otherTypes)(queryType)
	const generatedMutation = generateRootType(RootType.Mutation, otherTypes)(mutationType)
	const generatedSubscription = generateRootType(RootType.Subscription, otherTypes)(subscriptionType)

	const generatedOtherTypes = otherTypes
		.sort(sortTypesByKind)
		.map(generateType)
		.filter(x => !!x)
		.join('\n')

	return renderProxy({
		generatedQuery,
		generatedWatchQuery,
		generatedMutation,
		generatedSubscription,
		generatedOtherTypes,
	})
}

function sortTypesByKind(a: IntrospectionType, b: IntrospectionType) {
	return getSortValue(b) - getSortValue(a)
}

function getSortValue(x: IntrospectionType) {
	switch (x.kind) {
		case 'SCALAR':
			return 10

		case 'UNION':
			return 9

		case 'ENUM':
			return 8

		case 'INPUT_OBJECT':
			return 7

		case 'OBJECT':
			return 6

		default:
			return 0
	}
}
