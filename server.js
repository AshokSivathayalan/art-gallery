import express from 'express';
const app = express();
import mongoose from 'mongoose';
import session from 'express-session';
import { default as connectMongoDBSession} from 'connect-mongodb-session';
import User from './UserModel.js';

mongoose.connect('mongodb://127.0.0.1:27017/db');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){
    console.log("Connected to database");
    app.listen(3000);
    console.log("Server listening at http://localhost:3000");
});

//Sessions
const MongoDBStore = connectMongoDBSession(session);

var store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/demo',
    collection: 'sessions'
  });

app.use(session({
    secret: '🤔',
    resave: true,
    saveUninitialized: false,
    store: store
}));

app.use(express.json());
//Getting routers
import userRouter from "./users-router.js";
import artRouter from "./artwork-router.js";
import reviewRouter from "./review-router.js";

//For pug requests
app.set("view engine", "pug");
app.set("views", "pug");

//For CSS and JS
app.use(express.static("static"));


app.get("/", (request, response) => {
    console.log(request.session.loggedin);
    response.render("index", {session: request.session});
});

app.get("/register", (request, response) => {
    response.render("registration", {session: request.session});
});

app.get("/login", (request, response) => {
    response.render("login", {session: request.session});
})

//Handling logins
app.post("/login", login);

async function login(request, response){
    console.log(request.session.loggedin);
    //Users cannot login if the session already is  logged in
    if(request.session.hasOwnProperty("loggedin") && request.session.loggedin){
        response.status(401).send("Already logged in");
        return;
    }
    let username = request.body.username;
    let password = request.body.password;
    console.log("trying to log in");
    //Finding the user to login
    let result = await User.findOne({username: username});
    if(result != null){
        if(result.password == password){
            console.log("logged in " + username);
            //Adding data to request.session, so it may be used later
            request.session.loggedin = true;
            request.session.username = username;
            request.session.userID = result._id;
            request.session.isArtist = result.isArtist;
            response.status(201).send(result._id.toString());
        }
        else{
            response.status(401).send("Invalid password");
        } 
    }
    else{
        response.status(401).send("Failed");
    }
}

app.get("/logout", logout);

function logout(request, response){
    if(request.session.loggedin) request.session.loggedin = false;
    response.redirect("http://localhost:3000");
}

app.get("/addart", async (request, response) => {
    if(request.session.loggedin){
        //Finding the current user
        let result = await User.findOne({username: request.session.username});
        if(result != null){
            if(result.isArtist){
                //Rendering the page if they are an artist
                response.render("addArt", {session: request.session});
            }
            else{
                response.status(403).send("Must be artist to add art");
            }
        }
        else{
            response.status(404).send("Error");
        }
    }else response.status(403).send("Must be logged in as artist to add art");
});

//Using routers
app.use("/users", userRouter);

app.use("/artwork", artRouter);

app.use("/reviews", reviewRouter);
