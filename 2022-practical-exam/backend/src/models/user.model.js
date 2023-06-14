import mongoose from "mongoose"
const { Schema, model }= mongoose

import jsonwebtoken from 'jsonwebtoken'
const {sign} = jsonwebtoken

const userSchema = new Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        minLength: 10,
        maxLength: 10,
        required:true
    },
    nationalId:{
        type:String,
        minLength: 16,
        maxLength: 16,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid'],
        required:true
    },
    password:{
        type:String,
        required:true,
        select: false
    },
    role:{
        type:String,
        enum:['admin','voter'],
        required: true,
        select: false
    }
},
{timestamps:true}
)

userSchema.methods.generateAuthToken = function(){
    const token = sign(
        {_id:this._id,role: this.role},
        (process.env.JWT).trim()
    )
    return token;
}

export const User = model('user',userSchema)
