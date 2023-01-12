import express from 'express';
let router = express.Router();
import User from './UserModel.js';
import Art from './ArtModel.js';
import Review from './ReviewModel.js';

router.get("/", respondUser);

async function respondUser(request, response){
    //Finding the user, returning error if it was not found
    let u = await User.findOne({_id: request.uID});
    if(u == null){
        console.log("User does not exist");
        response.status(404).send("Error 404: User does not exist");
    }
    else{
        //console.log(artNames);
        //Responding with desired format
        response.format({
            "text/html": async () => {
                //Getting data related to user, so it can be displayed on their page
            let isCurr = (u._id.toString() == request.session.userID);
            let artNames = [];
            let reviews = [];
            let reviewedNames = [];
            //Going through each of their arts
            for(const id of u.artwork){
                let a = await Art.findOne({_id: id});
                artNames.push(a.name);
                //console.log(a.name);
            }
            //Going through each of their reviews
            for(const id of u.reviews){
                let r = await Review.findOne({_id: id});
                reviews.push(r);
                let a = await Art.findOne({_id: r.art});
                reviewedNames.push(a.name);
            }
            console.log(u.artwork);
                response.render("user", {wasArtist: (u.artwork.length > 0), user: u, isCurr: isCurr, session: request.session, artNames: artNames, reviewed: reviewedNames, reviews: reviews});
            },
            "application/json": () => {response.status(200).send(u)},
            default: () => {response.status(406).send("Not acceptable")}
        });
    }
}

router.put("/", updateUser);

async function updateUser(request, response){
    let toUpdate = request.body;
    console.log(toUpdate);
    if(!toUpdate){
        response.status(204).send();
        return;
    }
    //Checking that the current user is updating their own account
    if(request.uID != request.session.userID){
        response.status(403).send("Can only update your own account");
        return;
    }
    //Finding the user and updating them, or sending failed status if it failed
    let u = await User.findOne({username: request.session.username});
    if(u == null){
        response.status(404).send("Failed");
    }
    else{
        u.isArtist = !u.isArtist;
        await u.save();
        request.session.isArtist = !request.session.isArtist;
        response.status(204).send();
    }
}

router.delete("/", deleteUser);

async function deleteUser(request, response){
    //Making sure the current user is deleting their own account
    if(request.uID != request.session.userID){
        response.status(403).send("Cannot delete someone else's account");
        return;
    }else{
        //Deleting the account
        let u = await User.findOne({_id: request.uID}); 
        if(u == null){
            response.status(404).send();
            return;
        }
        else{
            User.deleteOne({_id: u._id});
        }
        
    }
}

export default router;