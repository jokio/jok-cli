import { IntrospectionSchema, IntrospectionType } from 'graphql'
import { RootType } from '../utils/rootType'
import generateRootType from './generateRootType'
import generateType from './helper/generateType'
import renderProxy from './render/renderProxy'
import renderQueryTypesEnum from './render/renderQueryTypesEnum'

export default function (
	introspectionSchema: IntrospectionSchema,
	generateDefaultFragments: boolean,
) {
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

	const queryType = <IntrospectionType>types.find(x => x.name === queryTypeName)
	const mutationType = <IntrospectionType>types.find(x => x.name === mutationTypeName)
	const subscriptionType = <IntrospectionType>types.find(x => x.name === subscriptionTypeName)

	const otherTypes = types.filter(x =>
		(x !== queryType) &&
		(x !== mutationType) &&
		(x !== subscriptionType),
	)

	const objectTypes = otherTypes.filter(x => x.kind === 'OBJECT')

	// start generation
	const generatedQuery = generateRootType(RootType.Query, otherTypes, generateDefaultFragments)(queryType)
	const generatedWatchQuery = generateRootType('watchQuery', otherTypes, generateDefaultFragments)(queryType)
	const generatedRefetchQuery = generateRootType('refetchQuery', otherTypes, generateDefaultFragments)(queryType)
	const generatedMutation = generateRootType(RootType.Mutation, otherTypes, generateDefaultFragments)(mutationType)
	const generatedSubscription =
		generateRootType(RootType.Subscription, otherTypes, generateDefaultFragments)(subscriptionType)

	const generatedOtherTypes = otherTypes
		.sort(sortTypesByKind)
		.map(generateType)
		.filter(x => !!x)
		.join('\n')

	const generatedQueryTypesEnum = renderQueryTypesEnum(objectTypes)

	return renderProxy({
		generatedQuery,
		generatedWatchQuery,
		generatedRefetchQuery,
		generatedMutation,
		generatedSubscription,
		generatedOtherTypes,
		generatedQueryTypesEnum,
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
