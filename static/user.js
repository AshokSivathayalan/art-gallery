function updateUser(id){
    console.log(id);
    //Checking if the user wants to change their account type
    let change = document.getElementById("switch").checked;
    if(!change) return;
    //Updating the account type
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 204){
            alert("Successfully updated");
        }
    }
    xhttp.open("PUT", `/users/${id}`);
    xhttp.send(change);
}

function deleteReviews(ids){
    //Getting all the reviews that must be deleted
    let toDelete = [];
    for(const id of ids){
        if(document.getElementById(`checkbox${id}`).checked){
            toDelete.push(id);
        }
    }
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 204){
            alert("Reviews deleted");
        }
    }
    //Sending the reviews to the server
    xhttp.open("DELETE", "/reviews");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(toDelete));
}