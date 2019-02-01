export default function (fragmentName, hasResultType) {
	const fragmentNameSection = hasResultType
		? `
		const fragmentName = mergedOptions.fragmentName || '${fragmentName}'`
		: ''

	return `
		const mergedOptions = {
			...<any>this.defaultOptions,
			...options,
		}

		${fragmentNameSection}
`
}
