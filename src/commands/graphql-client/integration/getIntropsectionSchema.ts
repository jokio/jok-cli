import { IntrospectionSchema } from 'graphql'
import fetch from 'node-fetch'

export default async function (graphqlUrl): Promise<IntrospectionSchema> {
	const body = requestData
		.replace(/\n/g, '')
		.replace(/\t/g, ' ')

	const result = await fetch(graphqlUrl, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body,
	})

	const json = await result.json()

	return json.data.__schema
}

const requestData = `{
	"operationName": "IntrospectionQuery",
	"variables": {},
	"query": "query IntrospectionQuery {
		__schema {
		  queryType {
			name
		  }
		  mutationType {
			name
		  }
		  subscriptionType {
			name
		  }
		  types {
			...FullType
		  }
		  directives {
			name
			description
			locations
			args {
			  ...InputValue
			}
		  }
		}
	  }

	  fragment FullType on __Type {
		kind
		name
		description
		fields(includeDeprecated: true) {
		  name
		  description
		  args {
			...InputValue
		  }
		  type {
			...TypeRef
		  }
		  isDeprecated
		  deprecationReason
		}
		inputFields {
		  ...InputValue
		}
		interfaces {
		  ...TypeRef
		}
		enumValues(includeDeprecated: true) {
		  name
		  description
		  isDeprecated
		  deprecationReason
		}
		possibleTypes {
		  ...TypeRef
		}
	  }

	  fragment InputValue on __InputValue {
		name
		description

		type {
		  ...TypeRef
		}
		defaultValue
	  }

	  fragment TypeRef on __Type {
		kind
		name
		ofType {
		  kind
		  name
		  ofType {
			kind
			name
			ofType {
			  kind
			  name
			  ofType {
				kind
				name
				ofType {
				  kind
				  name
				  ofType {
					kind
					name
					ofType {
					  kind
					  name
					}
				  }
				}
			  }
			}
		  }
		}
	  }
	  "
}`
