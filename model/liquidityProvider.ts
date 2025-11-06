import mongoose from "mongoose"

const LiquidityProviderSchema = new mongoose.Schema(
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

const LiquidityProvider = mongoose.models.LiquidityProvider || mongoose.model("LiquidityProvider", LiquidityProviderSchema)

export default LiquidityProvider;