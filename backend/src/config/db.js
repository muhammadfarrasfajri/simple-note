import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DATABASE CONNECT SUCCCESSFULLY !");
  } catch (error) {
    console.error("DATABASE CONNET INVALID", error);
    process.exit(1);
  }
};
