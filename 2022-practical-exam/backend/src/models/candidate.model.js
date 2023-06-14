import mongoose from "mongoose"
const { Schema, model }= mongoose

const candidateSchema = new Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    nationalId:{
        type:String,
        minLength: 16,
        maxLength: 16,
        unique:true,
        required:true
    },
    profilePicture:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        enum: ['MALE','FEMALE'],
        required:true
    },
    missionStatement:{
        type:String,
        required:true
    }
},
{timestamps:true}
)

export const Candidate = model('candidate',candidateSchema)
