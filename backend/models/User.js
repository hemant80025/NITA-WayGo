import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    name:
    {
        type:String,
        required:true
    },
    lat:
    {
        type:Number,
        required:true
    },

    lon:
    {
        type:Number,
        required:true
    },

    address: 
    {
        type:String,
        required:true
    }

});

const User = mongoose.model('User',userSchema);
export default User;