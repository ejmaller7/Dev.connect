import User from '../models/User.js';

const resolvers = {
  Query: {
    users: async () => await User.find(),
    user: async (_, { id }) => await User.findById(id),
  },
  Mutation: {
    updateProfile: async (_, { id, username, headline }) => {
      return await User.findByIdAndUpdate(id, { username, headline }, { new: true });
    },
  },
};

export default resolvers;
