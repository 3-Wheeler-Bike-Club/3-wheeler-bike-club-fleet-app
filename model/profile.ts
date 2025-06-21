import mongoose from "mongoose"

const ProfileSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    othername: {
        type: String,
    },
    
    id: {
        type: String,
        enum: ["passport", "national"],
    },
    files: {
        type: Array,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})  

const Profile = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema)

export default Profile