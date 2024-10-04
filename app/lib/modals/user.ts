import {Schema, model, models} from "mongoose";

// schema for the user

const userSchema = new Schema({
    username:{type: "string", required: true, unique: true},
    email:{type:"string", required: true, unique: true},
    password:{type: "string", required: true},
},
    {
        timestamps: true
    }

)

// model for the user

const User = models.User || model("User",userSchema);

export default User;
