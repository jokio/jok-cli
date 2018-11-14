export default function ({
	className,
	renderPropTypes,
	renderMethods,
}) {
	return `
// ${className} props -----------------------------------
${renderPropTypes()}

// ${className} apis ------------------------------------
class ${className} {

	constructor(private client: ApolloClient<any>, private defaultOptions: GraphqlCallOptions = {}) { }
${renderMethods()}
}
`
}
