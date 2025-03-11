import gql from 'graphql-tag';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    profilePicture: String
    headline: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    loginUser(email: String!, password: String!): AuthPayload
    registerUser(username: String!, email: String!, password: String!): User
    updateProfile(id: ID!, username: String, headline: String): User
  }
`;

export default typeDefs;
