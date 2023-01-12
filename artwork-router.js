import express from 'express';
let router = express.Router();
import Art from './ArtModel.js';
import User from './UserModel.js';

router.get("/", respondArtwork);

async function respondArtwork(request, response){
    //Getting the specified query parameters
    let searchParams = {};
    if(request.query.hasOwnProperty("name")) searchParams.name = request.query.name;
    if(request.query.hasOwnProperty("year")) searchParams.year = request.query.year;
    if(request.query.hasOwnProperty("category")) searchParams.category = request.query.category;
    if(request.query.hasOwnProperty("medium")) searchParams.medium = request.query.medium;
    if(request.query.hasOwnProperty("artist")) searchParams.artist = request.query.artist;
    //Searching for matching artwork
    let arts = await Art.find(searchParams);
    //Responding with the desired format
    response.format({
        "text/html": () => {response.render("artList", {arts: arts, session: request.session})},
        "application/json": () => {response.status(200).json(arts)},
        default: () => {response.status(406).send("Not Acceptable")}
    });
}

router.post("/", addArtwork);

async function addArtwork(request, response){
    let user = await User.findOne({username: request.session.username});
    //If the user does not exist, or is not an artist, returning a 403 Forbidden
    if(user == null || !user.isArtist){
        response.status(403).send();
        return;
    }
    //Getting the art json
    let art = request.body;
    let exists = await Art.findOne({name: request.name});
    if(exists != null){
        response.status(400).send("Art by that name already exists");
        return;
    }
    art.artist = request.session.username;
    console.log("adding art " + art);

    await Art.create(art, async function(err, newA){
        if(err) throw err;
        console.log("Created " + newA);
        //Adding the art's ID to the User
        user.artwork.push(newA._id);
        user.markModified('artwork');
        console.log(newA._id);
        console.log(user.artwork);
        await user.save();
        response.status(201).send(newA._id.toString());
    });
}

import artRouter from './art-router.js';

router.param("artID", function(request, response, next, id){
    request.aID = id;
    next();
});

router.use("/:artID", artRouter);

export default router;