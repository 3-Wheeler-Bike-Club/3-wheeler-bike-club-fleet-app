import mongoose from "mongoose"

const ProfileSchema = new mongoose.Schema(
    {
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
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        firstname: {
            type: String,
        },
        othername: {
            type: String,
        },
        lastname: {
            type: String,
        },
        id: {
            type: String,
            enum: ["passport", "national", "self.xyz"],
        },
        files: {
            type: Array,
        },
        compliant: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    }, 
    {
        timestamps: true, // Add timestamps
    }
)  

const Profile = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema)

export default Profile