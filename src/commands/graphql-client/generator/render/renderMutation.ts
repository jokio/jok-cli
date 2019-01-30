export default function ({
	hasFragment,
	graphqlTypeName,
	queryName,
	variablesDeclarationString,
	variablesString,
}) {
	if (!hasFragment) {
		return `	// build query
		const mutation = gql2\`
		mutation ${queryName}${variablesDeclarationString} {
			${queryName}${variablesString}
		}
		\``
	}

	return `		const finishedFragment = fragment || \`fragment \${fragmentName} on ${graphqlTypeName} \${localFragment}\`

		// build query
		const mutation = gql2\`
		mutation ${queryName}${variablesDeclarationString} {
			${queryName}${variablesString} {
				...\${fragmentName}
			}
		}

		\${finishedFragment}
		\``
}
