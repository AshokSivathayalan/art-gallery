import fs from 'fs';
import Art from './ArtModel.js';
import User from './UserModel.js';
import pkg from 'mongoose';

let arts = {};

fs.readFile('gallery.json', 'utf-8', function(err, data){
    if(err) throw err;
    arts = JSON.parse(data);
});


const {connect, connection} = pkg;

const loadData = async () => {
    //Connecting to the database and emptying it
    await connect('mongodb://localhost:27017/db');

    await connection.dropDatabase();


    //Creating a new Art for each artwork object
    let artwork = arts.map(art => new Art(art));
    
    let userObj = [];

    artwork.forEach(function(art){
        //If this art's artist is not in the userObj array, add it 
        if (userObj.filter(user => user.username == art.artist).length == 0){
            let u = {username: art.artist, password: 'badsecurity', isArtist: true, artwork: [], reviews: []};
            u.artwork.push(art._id);
            userObj.push(u);
        }
        else{
            //Adding the art to the user
            userObj.filter(user => user.username == art.artist)[0].artwork.push(art._id);
        }
    });
    //Creating Users based on the user objects 
    let users = userObj.map(user => new User(user));

    //Adding the documents to the database
    await Art.create(artwork);
    await User.create(users);
}

loadData().then((result) => {
    console.log("Closing database connection.");
    connection.close();
}).catch(err => console.log(err));