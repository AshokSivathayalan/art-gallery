import express from 'express';
let router = express.Router();
//import { db } from './server.js';
import User from './UserModel.js';


router.get("/", respondUsers);

async function respondUsers(request, response){
    //Finding the specified users
    let searchParams = {};
    if(request.query.hasOwnProperty("has")){
        let r = new RegExp(`${request.query.has}`, 'g');
        searchParams.username = {"$regex": r}
    }
    if(request.query.hasOwnProperty("isArtist")) searchParams.isArtist = {"$eq": request.query.isArtist}
    let users = await User.find(searchParams);
    //Responding with the desired format
    response.format({
        "text/html": () => {response.render("userList", {users: users, session: request.session})},
        "application/json": () => {response.status(200).json({users: users})}
    });
}

//Handling registration
router.post("/", createUser);

async function createUser(request, response){
    let user = request.body;
    user.reviews = [];
    user.isArtist = false;
    //Determining if this would be a duplicate account
    let result = await User.findOne({username: user.username});
    if(result == null){
        //Creating the user and sending a successful response
        console.log("Creating user " + user);
        await User.create(user, function(err, newU){
            if(err) throw err;
            console.log("Created " + newU);
            response.status(201).send();
        });
    }
    else{
        console.log("user already exists");
        response.status(400).send();
    }
}

import userRouter from './user-router.js';

router.param("userID", function(request, response, next, id){
    request.uID = id;
    next();
});

router.use("/:userID", userRouter);


export {router as default};