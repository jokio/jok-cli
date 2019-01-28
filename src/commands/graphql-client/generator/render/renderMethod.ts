
export default function ({
	methodName,
	fragmentName,
	hasProps,
	propsType,
	renderContent,
	hasResultType,
}) {
	const fragmentProps = hasResultType
		? `
		fragment?: string,
		fragmentName: string = '${fragmentName}',
	`
		: ''

	if (!hasProps) {
		return `
	${methodName}(${fragmentProps}
		defaultOptions?: GraphqlCallOptions,
	) {
	${renderContent()}
	}`
	}

	// with props
	return `
	${methodName}(
		props: ${propsType},${fragmentProps}
		defaultOptions?: GraphqlCallOptions,
	) {
	${renderContent()}
	}`
}
