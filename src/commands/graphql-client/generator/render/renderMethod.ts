
export default function ({
	methodName,
	hasProps,
	propsType,
	renderContent,
}) {
	if (!hasProps) {
		return `
	${methodName}(fragment?: string) {
	${renderContent()}
	}`
	}

	// with props
	return `
	${methodName}(props: ${propsType}, fragment?: string) {
	${renderContent()}
	}`
}
