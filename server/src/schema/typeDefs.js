import gql from 'graphql-tag';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    profilePicture: String
    headline: String
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    updateProfile(id: ID!, username: String, headline: String): User
  }
`;

export default typeDefs;