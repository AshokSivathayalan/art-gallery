# art-gallery

## About
This application acts like a social media platform where users can create accounts and post artwork, which is then visible to other users. Users can search for various types of artwork, and review them with a rating and description. 

## Installation
1. Navigate to main directory and open command line
2. Run ‘npm install’ to install required modules
3. Run ‘mongod –port 27017 –dbpath=database` to create the database
4. Open separate command line and run ‘node database-initializer.js’ to initialize the
database with the artwork stored in gallery.json
5. Run ‘node server.js’ in second command line to start the server
6. Go to ‘localhost:3000’ in a web browser to view website
