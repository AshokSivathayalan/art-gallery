import express from 'express';
let router = express.Router();
import Art from './ArtModel.js';
import User from './UserModel.js';
import Review from './ReviewModel.js';

router.get("/", respondArt);

async function respondArt(request, response){
    let a = await Art.findOne({_id: request.aID});
    //If the art was not found, sending 404
    if(a == null){
        response.status(404).send();
    }
    else{
        response.format({
            "text/html": async () => {
                //Getting the reviews and names of the reviewers so they can be displayed
                let hasReviewed = false;
                let reviews = [];
                let reviewerNames = [];
                for(const id of a.reviews){
                    let r = await Review.findOne({_id: id});
                    if(r == null){
                        response.status(404).send();
                        return;
                    }
                    let u = await User.findOne({_id: r.user});
                    if(u == null){
                        response.status(404).send();
                        return;
                    }
                    reviews.push(r);
                    reviewerNames.push(u.username);
                    if(u.username == request.session.username) hasReviewed = true;
                }
                let artist = await User.findOne({username: a.artist});
                response.render("art", {art: a, session: request.session, names: reviewerNames, reviews: reviews, average: await a.averageRating(), hasReviewed: hasReviewed, artistID: artist._id});
            },
            "application/json": () => {response.status(200).send(a)},
            default: () => {response.status(406).send("Not acceptable")}
        })
    }
}

//import reviewRouter from './review-router.js';

//router.use("/reviews", reviewRouter);

export default router;