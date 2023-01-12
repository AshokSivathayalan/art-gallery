function search(){
    let newLoc = location.pathname + "?";
    let name = document.getElementById("name").value;
    let category = document.getElementById("category").value;
    let medium = document.getElementById("medium").value;
    let year = document.getElementById("year").value;
    let artist = document.getElementById("artist").value;

    //Adding desired queries
    if(name != ""){
        newLoc += `name=${name}&`;
    }
    if(category != ""){
        newLoc += `category=${category}&`;
    }
    if(medium != ""){
        newLoc += `medium=${medium}&`;
    }
    if(year != ""){
        newLoc += `year=${Number(year)}&`;
    }
    if(artist != ""){
        newLoc += `artist=${artist}`;
    }
    //Redirecting to desired page
    location.href=newLoc;
}