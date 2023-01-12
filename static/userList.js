function search(){
    //Getting the query parameters
    let newLoc = location.pathname + "?";
    let name = document.getElementById("name").value
    if(name != ""){
        newLoc += `has=${name}&`
    }
    //Checking which radio button was selected
    const radios = document.querySelectorAll('input[name="isArtist"]');
    for(const radio of radios){
        if(radio.checked){
            if(radio.id == "artist"){
                newLoc += "isArtist=true"
            }
            else if(radio.id == "patron"){
                newLoc += "isArtist=false"
            }
            break;
        }
    }
    //Redirecting to the desired query page
    location.href = newLoc;
}