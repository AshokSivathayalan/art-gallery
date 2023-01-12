function register(){
    //Getting the username and password
    let name = document.getElementById("username").value;
    let pass = document.getElementById("password").value;
    if(name == "" || pass == ""){
        alert("Username and password cannot be empty");
        return;
    }  
    //Creating the user object
    let user = {};
    user.username = name;
    user.password = pass;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        //Notifying the user that their account was created
        if(this.readyState == 4 && this.status == 201){
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
            alert("Your account has been created");
        }
        //Notifying the user that their account was not created
        else if(this.status == 400 && this.readyState == 4){
            alert("A user by that name already exists - account not created");
        }
    }
    //Sending the account data to the server
    xhttp.open("POST", "/users");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(user));
}