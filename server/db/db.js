import mongoose from "mongoose";

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDB Connected Succesfully")
    } catch (error) {
        console.log("MongoDB connection Error",error.message)
    }
}

export default connectToDatabase