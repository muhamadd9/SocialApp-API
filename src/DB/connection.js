import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(process.env.CONNECTION_URL)
    .then(() => {
      console.log("DB Connected");
    })
    .catch((err) => {
      console.log("DB Not Connected", err);
    });
};
export default connectDB;
