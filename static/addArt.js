function addArt(){
    if(!validInput()){
        alert("Invalid Input - fill in all fields");
        return;
    }
    //Creating the art objects
    let art = {};
    art.name = document.getElementById("title").value;
    art.year = Number(document.getElementById("year").value);
    art.medium = document.getElementById("medium").value;
    art.category = document.getElementById("category").value;
    art.description = document.getElementById("description").value;
    art.image = document.getElementById("link").value;
    console.log(art);
    //Sending the request to the server
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 201){
            location.href = `/artwork/${this.responseText}`
        }
        else if(this.status == 400){
            alert(this.responseText);
        }
    }
    xhttp.open("POST", "/artwork");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(art));

}

function validInput(){
    let title = document.getElementById("title").value;
    let year = document.getElementById("year").value;
    let medium = document.getElementById("medium").value;
    let category = document.getElementById("category").value;
    let description = document.getElementById("description").value;
    let link = document.getElementById("link").value;
    return !(link == "" || category == "" || medium == "" || year == "" || title == ""|| description == "");
}