export default function () {
	return `import ApolloClient, { FetchPolicy } from 'apollo-client'

// gql2 - to ignore apollo extention validation
// for now there is no better way
import gql2 from 'graphql-tag'

// rx libraries
import { from, observable } from 'rxjs'
import { map } from 'rxjs/operators'
`
}
