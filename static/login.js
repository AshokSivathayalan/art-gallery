function login(){
    //Getting the login info
    let info = {};
    info.username = document.getElementById("username").value;
    info.password = document.getElementById("password").value;
    console.log(info);

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        //If the login was successful, redirecting to the user's profile
        if(this.readyState == 4 && this.status == 201){
            console.log("id: " + this.responseText);
            let id = this.responseText;
            console.log(this.responseText);
            location.href = `http://localhost:3000/users/${id}`
        }
        //Telling the user if their login failed
        else if(this.readyState == 4 && this.status == 401){
            alert(this.responseText);
        }
    }
    //Sending to the server
    xhttp.open("POST", "/login");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(info));
}