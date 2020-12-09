export default function ({
  hasFragment,
  queryName,
  variablesDeclarationString,
  variablesString,
}) {
  if (!hasFragment) {
    return `	// build query
		const query = gql2\`
		query ${queryName}${variablesDeclarationString} {
			${queryName}${variablesString}
		}
		\``
  }

  return `
		// build query
		const query = gql2\`
		query ${queryName}${variablesDeclarationString} {
			${queryName}${variablesString} {
				...\${fragmentName}
			}
		}

		\${finishedFragment}
		\``
}
