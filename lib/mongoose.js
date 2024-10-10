import mongoose from "mongoose";

const connectionToDataBase = async () => {

    try{
        await mongoose.connect(process.env.MongoURL)
        console.log("connected to DB")
    }catch(err){
        console.log(err)
    }
}

export default connectionToDataBase