export default function (fragmentName, hasResultType) {
	const fragmentNameSection = hasResultType
		? `
			fragmentName = '${fragmentName}'`
		: ''

	return `
		const {
			fetchPolicy,${fragmentNameSection}
		} = options || <any>this.defaultOptions
`
}
