
export default function ({
	methodName,
	fragmentName,
	hasProps,
	propsType,
	renderContent,
}) {
	if (!hasProps) {
		return `
	${methodName}(
		fragment?: string,
		fragmentName: string = '${fragmentName}',
		defaultOptions?: GraphqlCallOptions
	) {
	${renderContent()}
	}`
	}

	// with props
	return `
	${methodName}(
		props: ${propsType},
		fragment?: string,
		fragmentName: string = '${fragmentName}',
		defaultOptions?: GraphqlCallOptions
	) {
	${renderContent()}
	}`
}
