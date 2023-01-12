import mongoose from 'mongoose';

let reviewSchema = mongoose.Schema({
    art: {type: mongoose.Schema.Types.ObjectID, required: true, ref: 'Art'},
    user: {type: mongoose.Schema.Types.ObjectID, required: true, ref: 'User'},
    text: {type: String, required: false},
    rating: {type: Number, required: true}
});

let reviewModel = mongoose.model("Review", reviewSchema);

export default reviewModel;