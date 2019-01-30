
export default function ({
	methodName,
	generateDefaultFragments,
	hasProps,
	propsType,
	renderContent,
	hasResultType,
}) {
	const fragmentRequiredSymbol = generateDefaultFragments
		? '?'
		: ''

	const fragmentProp = hasResultType
		? `fragment${fragmentRequiredSymbol}: string,`
		: ''

	if (!hasProps) {
		return `
	${methodName}(
		${fragmentProp}
		options?: GraphqlCallOptions & FragmentOptions,
	) {
	${renderContent()}
	}`
	}

	// with props
	return `
	${methodName}(
		props: ${propsType},
		${fragmentProp}
		options?: GraphqlCallOptions & FragmentOptions,
	) {
	${renderContent()}
	}`
}
