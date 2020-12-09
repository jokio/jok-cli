export default function ({
  hasFragment,
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

  return `
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
