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
		const subscription = gql\`
		subscription ${queryName}${variablesDeclarationString} {
			${queryName}${variablesString}
		}
		\``
	}

	return `		const finishedFragment = \`fragment ${fragmentName} on ${graphqlTypeName} \${localFragment}\`

		// build query
		const subscription = gql\`
		subscription ${queryName}${variablesDeclarationString} {
			${queryName}${variablesString} {
				...${fragmentName}
			}
		}

		\${finishedFragment}
		\``
}
