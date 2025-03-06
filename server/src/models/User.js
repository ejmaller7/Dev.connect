import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    headline: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    githubUsername: {
      type: String,
      default: ""
    },
    experience: {
      type: String,
      default: "",
    },
    skills: {
      type: String,
      default: ""
    },
    selectedRepositories: {
      type: [
      {
        name: String,
        url: String,
        deployedURL: String,
        description: String,
        language: String,
        image: String,
        _id: false,
      }
    ],
    validate: [arrayLimit, '{PATH} exceeds the limit of 8 repositories'],
  },
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequests: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
      }
    ],
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 8;
}

// Hash password before saving the user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", UserSchema);
export default User;

