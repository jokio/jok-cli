export default function () {
	return `
import ApolloClient, {
	ErrorPolicy,
	FetchPolicy,
	MutationOptions,
	OperationVariables,
	QueryOptions,
	SubscriptionOptions,
	WatchQueryOptions,
} from 'apollo-client'

// gql2 - to ignore apollo extention validation
// for now there is no better way
import gql2 from 'graphql-tag'

// rx library
import { from, observable } from 'rxjs'
import { map } from 'rxjs/operators'

`
}
