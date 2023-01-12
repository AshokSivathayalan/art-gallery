import mongoose from 'mongoose';
import Review from './ReviewModel.js';

let artSchema = mongoose.Schema({
    name: {type: String, required: true},
    artist: {type: String, required: true},
    year: {type: Number, required: true},
    category: {type: String, required: true},
    medium: {type: String, required: true},
    description: {type: String, required: true}, 
    image: {type: String, required: true}, 
    reviews: {type: [mongoose.Schema.Types.ObjectID], required: true, ref: 'Review'}
});

//A method to get the average rating
artSchema.methods.averageRating = async function(){
    let sum = 0;
    let count = 0;
    for(const id of this.reviews){
        let r = await Review.findOne({_id: id});
        sum += r.rating;
        count++;
    }
    return sum/count;
}

let artModel = mongoose.model("Art", artSchema);

export default artModel;