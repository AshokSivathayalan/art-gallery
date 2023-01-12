import mongoose from 'mongoose';

let userSchema = mongoose.Schema({
    username: {type: String, required: true}, 
    password: {type: String, required: true},
    isArtist: {type: Boolean, required: true},
    artwork: {type: [mongoose.Schema.Types.ObjectID], ref: 'Art'},
    reviews: {type: [mongoose.Schema.Types.ObjectID], required: true}
});

let userModel = mongoose.model('User', userSchema);

export default userModel;