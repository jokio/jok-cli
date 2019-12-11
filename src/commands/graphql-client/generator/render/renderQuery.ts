export default function ({
	hasFragment,
	queryName,
	variablesDeclarationString,
	variablesString,
	returnQuery = false,
}) {
	if (!hasFragment) {
		return `	// build query
		${returnQuery ? 'return' : 'const query ='} gql2\`
		query ${queryName}${variablesDeclarationString} {
			${queryName}${variablesString}
		}
		\``
	}

	return `
		// build query
		${returnQuery ? 'return' : 'const query ='} gql2\`
		query ${queryName}${variablesDeclarationString} {
			${queryName}${variablesString} {
				...\${fragmentName}
			}
		}

		\${finishedFragment}
		\``
}
