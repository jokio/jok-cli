
export default function ({
	methodName,
	hasProps,
	propsType,
	renderContent,
}) {
	if (!hasProps) {
		return `
	${methodName}(
		fragment?: string,
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
		defaultOptions?: GraphqlCallOptions
	) {
	${renderContent()}
	}`
}
