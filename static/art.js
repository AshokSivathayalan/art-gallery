function review(userid, artid, hasReviewed){
    console.log(userid);
    //Creating the review object
    let review = {};
    review.text = document.getElementById("written").value;
    review.rating = Number(document.getElementById("rating").value);
    review.user = userid;
    review.art = artid;
    //Sending the review to the server
    let xhttp = new XMLHttpRequest();
    
    console.log(review);
    if(hasReviewed){
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 204){
                alert("Review updated.");
            }
        }
        xhttp.open("PUT", `/reviews`);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(review));
    }
    else{
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 201){
                alert("Review added.");
            }
        }
        xhttp.open("POST", `/reviews`);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(review));
    }
    
}