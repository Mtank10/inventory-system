import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    tokenVersion: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

userSchema.methods.setPassword = async function (plain) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(plain, salt);
};


userSchema.methods.comparePassword = async function (plain) {
    return bcrypt.compare(plain, this.passwordHash);
};


const User = mongoose.model('User', userSchema);
export default User;