import { gql } from 'apollo-server-express'

export default gql`
  type Query {
    """
    Hello world field
    """
    hello: String!
  }
`
