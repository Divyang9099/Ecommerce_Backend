import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        enum: ["VERIFICATION", "PASSWORD_RESET"],
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }, // TTL index to automatically delete expired docs
    },
}, { timestamps: true });

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
