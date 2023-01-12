import express from 'express';
let router = express.Router();
import Art from './ArtModel.js';
import User from './UserModel.js';
import Review from './ReviewModel.js';

//router.get("/", respondReviews);

//Not functioning, as review route was changed from /artwork/:artID/reviews to /reviews
/*async function respondReviews(request, response){
    response.format({
        "application/json": async () => {
            let a = await Art.findOne({_id: request.aID});
            if(a == null){
                response.status(404).send();
            }
            else{
                let reviews = [];
                for(const id in a.reviews){
                    let r = await Review.findOne({_id: id});
                    reviews.push(r);
                }
                response.status(200).send(reviews)
            }
        },
        default: () => {response.status(406).send("Not acceptable")}
    });
}*/

router.get("/:reviewID", respondReview);

async function respondReview(request, response){
    let r = await Review.findOne({_id: request.params.reviewID});
    response.format({
        "application/json": () => {response.send(200).json(r)},
        default: () => {response.status(406).send("Not acceptable")}
    });
}

router.post("/", addReview);

async function addReview(request, response){
    //Getting the review, and finding the relevant work of art
    let review = request.body;
    let art = await Art.findOne({_id: review.art});
    //Sending failed status codes if any error is encountered
    if(art == null){
        response.status(404).send("Failed");
        return;
    }
    else if(!request.session.loggedin){
        response.status(403).send("Must be logged in to review art");
    }
    else if(art.artist == request.session.username){
        response.status(403).send("Cannot review your own art");
    }
    else{
        //Finding the user
        let user = await User.findOne({_id: review.user});
        if(user == null){
            response.status(404).send("Failed");
            return;
        }
        //Creating the review
        await Review.create(review, async function(err, newR){
            if(err) throw err;
            console.log("created review");
            //Adding the review to the Art and User
            user.reviews.push(newR._id);
            await user.save();
            art.reviews.push(newR._id);
            await art.save();
            response.status(201).send();
        }); 
        
    }
}

router.put("/", updateReview);

async function updateReview(request, response){

    let review = request.body;
    let user = await User.findOne({_id: review.user});
    let art = await Art.findOne({_id: review.art});
    if(user == null || art == null){
        response.status(404).send();
        return;
    }
    let r = await Review.findOne({art: art._id, user: user._id});
    if(r == null){
        response.status(404).send("Review not found");
        return;
    }
    if(user.username != request.session.username){
        response.status(403).send("Can only update your own reviews");
        return;
    }
    r.text = review.text;
    r.rating = review.rating;
    r.save();
    response.status(204).send();
}

router.delete("/", deleteReviews);

async function deleteReviews(request, response){
    let toDelete = request.body;
    //Looping through each review
    for(const id of toDelete){
        //Getting the documents to update
        let r = await Review.findOne({_id: id});
        if(r == null){
            response.status(404).send("Review not found");
            return;
        }
        let a = await Art.findOne({_id: r.art});
        let u = await User.findOne({_id: r.user});
        //Removing the review ID from the user and artist
        a.reviews.splice(a.reviews.indexOf(id), 1);
        u.reviews.splice(u.reviews.indexOf(id), 1);
        await a.save();
        await u.save();
        //Deleting the review
        Review.deleteOne({_id: id});

    }
    response.status(204).send();
}

router.delete("/:reviewID", deleteReview);

async function deleteReview(request, response){
    let r = await Review.findOne({_id: request.params.reviewID});
    let a = await User.findOne({_id: r.user});
    if(a.username != request.session.username){
        response.status(403).send("Cannot delete other people's reviews");
        return;
    }
    try{
        Review.deleteOne({_id: r._id});
        response.status(204).send();
    }
    catch{
        response.status(400).send();
    }
}

export default router;