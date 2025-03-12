import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",  // Reference to the User model
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String,   
    },
    url: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return /^https?:\/\/[^\s$.?#].[^\s]*$/gm.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    likes: { 
        type: Number, 
        default: 0 
    },
    likedBy: { 
        type: [mongoose.Schema.Types.ObjectId], 
        ref: "User", 
        default: [] 
    },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
});

export default mongoose.model("Message", MessageSchema);

