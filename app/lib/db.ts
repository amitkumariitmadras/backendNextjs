import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

console.log("Mongo string",MONGO_URI);

const connect = async () => {

    const connectionState = mongoose.connection.readyState;

    if(connectionState === 1){
        console.log("Database already connected");
        return;
    }

    if(connectionState ===2){
        console.log("connecting...");
        return;
    }

    try{
        mongoose.connect(MONGO_URI!,{
            dbName:"vtovGM",
            bufferCommands:true
        })
        console.log("connected");
    } catch(error:any){
        console.log(error);
        throw new Error("Error: ",error);
    }

}

export default connect;