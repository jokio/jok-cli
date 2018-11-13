export default function ({
	hasFragment,
	fragmentName,
	graphqlTypeName,
	queryName,
	variablesDeclarationString,
	variablesString,
}) {
	if (!hasFragment) {
		return `	// build query
		const query = gql\`
		query ${queryName}${variablesDeclarationString} {
			${queryName}${variablesString}
		}
		\``
	}

	return `		const finishedFragment = \`fragment ${fragmentName} on ${graphqlTypeName} \${localFragment}\`

		// build query
		const query = gql\`
		query ${queryName}${variablesDeclarationString} {
			${queryName}${variablesString} {
				...${fragmentName}
			}
		}

		\${finishedFragment}
		\``
}
