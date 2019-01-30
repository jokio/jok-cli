export default function ({
	hasFragment,
	graphqlTypeName,
	queryName,
	variablesDeclarationString,
	variablesString,
}) {
	if (!hasFragment) {
		return `	// build query
		const subscription = gql2\`
		subscription ${queryName}${variablesDeclarationString} {
			${queryName}${variablesString}
		}
		\``
	}

	return `		const finishedFragment = fragment || \`fragment \${fragmentName} on ${graphqlTypeName} \${localFragment}\`

		// build query
		const subscription = gql2\`
		subscription ${queryName}${variablesDeclarationString} {
			${queryName}${variablesString} {
				...\${fragmentName}
			}
		}

		\${finishedFragment}
		\``
}
