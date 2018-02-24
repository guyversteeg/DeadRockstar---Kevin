var starList = [
   // {
   //    "_id": 12345,
   //    "name": "Johnny",
   //    "surname": "Ace",
   //    "age": 25,
   //    "why": "Suicide",
   //    "imageURL": "//upload.wikimedia.org/wikipedia/en/thumb/1/12/Johnny_Ace_photo.jpg/220px-Johnny_Ace_photo.jpg"
   // },
   // {
   //    "_id": 12346,
   //    "name": "Nick",
   //    "surname": "Acland",
   //    "band": "Lush",
   //    "age": 30,
   //    "why": "Suicide"
   // },
   // {
   //    "_id": 12347,
   //    "name": "GG",
   //    "surname": "Allin",
   //    "age": 36,
   //    "why": "Drug overdose",
   //    "imageURL": "//upload.wikimedia.org/wikipedia/en/thumb/d/dc/GGConcert.jpg/220px-GGConcert.jpg"
   // },
   // {
   //    "_id": 12348,
   //    "name": "Luther",
   //    "surname": "Allison",
   //    "age": 58,
   //    "why": "Brain tumor",
   //    "imageURL": "//upload.wikimedia.org/wikipedia/commons/thumb/5/56/LutherAllison1996.jpg/220px-LutherAllison1996.jpg"
   // },
   // {
   //    "_id": 12349,
   //    "name": "Duane",
   //    "surname": "Allman",
   //    "band": "Allman Brothers Band",
   //    "age": 24,
   //    "why": "Motorcycle accident",
   //    "imageURL": "//upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Duane_Allmann.jpg/220px-Duane_Allmann.jpg"
   // },
   // {
   //    "_id": 12350,
   //    "name": "Matthew",
   //    "surname": "Ashman",
   //    "band": "Bow Wow Wow",
   //    "age": 35,
   //    "why": "Diabetes"
   // },
   // {
   //    "_id": 12351,
   //    "name": "Chet",
   //    "surname": "Baker",
   //    "age": 58,
   //    "why": "Fell out window",
   //    "imageURL": "//upload.wikimedia.org/wikipedia/commons/thumb/d/df/Getz%26BakerSandvika1983x.jpg/220px-Getz%26BakerSandvika1983x.jpg"
   // },
   // {
   //    "_id": 12352,
   //    "name": "Florence",
   //    "surname": "Ballard",
   //    "band": "Supremes",
   //    "age": 32,
   //    "why": "Medical",
   //    "imageURL": "//upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Florence_Ballard_%281965%29.jpg/220px-Florence_Ballard_%281965%29.jpg"
   // },
   // {
   //    "_id": 12353,
   //    "name": "Carlton",
   //    "surname": "Barrett",
   //    "band": "Wailers",
   //    "age": 37,
   //    "why": "Murdered"
   // },
   // {
   //    "_id": 12354,
   //    "name": "Stiv",
   //    "surname": "Bators",
   //    "band": "Dead Boys",
   //    "age": 40,
   //    "why": "Hit by a Car",
   //    "imageURL": "//upload.wikimedia.org/wikipedia/en/thumb/1/17/Stiv_Bators.jpg/159px-Stiv_Bators.jpg"
   // }
]

// Path where data is stored
var URL = 'http://localhost:3000/stars';

// Retrieve the data file via AJAX.
function getData() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            starList = JSON.parse(xmlhttp.responseText);
            console.log(starList);
        }
    };
    // Async
    xmlhttp.open("GET", URL, true);
    // Sync
    // xmlhttp.open("GET", URL, false);
    xmlhttp.setRequestHeader("Accept", "application/json");
    xmlhttp.send();
}

function showList() {
    var allStars = document.querySelector("#allStars");
    allStars.innerHTML = "";

    for( var idx=0; idx<starList.length; idx++) {
      var rockstar = starList[idx]
       var cardEls = createRockstarHTML(rockstar);
       allStars.appendChild(cardEls);
   }

}

function createRockstarHTML(rockstar) {
   // Define the variables.
   var rockstarIds;
   var rockstarNames;
   var rockstarBand;
   var rockstarAge;
   var rockstarWhy;
   rockstarIds = rockstar._id;
   rockstarNames = rockstar.name + " " + rockstar.surname;
   rockstarBand = rockstar.band;
   rockstarAge = rockstar.age;
   rockstarWhy  = rockstar.why;
   // Create the card div
   var cardEls;
   cardEls = document.createElement("div");
   cardEls.id = rockstarIds;
   cardEls.classList.add("card");
   // Append the div to the body
   document.body.appendChild(cardEls);
   // Create the images
   var imgEls;
   imgEls = document.createElement("img");
   imgEls.src = rockstar.imageURL || './placeholder.png';
   imgEls.classList.add("photo");
   // Append the image to the card div
   cardEls.appendChild(imgEls);
   // Create the captions
   var captionEls;
   captionEls = document.createElement("div");
   captionEls.classList.add("caption");
   captionEls.innerHTML = "<b>" + rockstarNames + "</b> died at the age of " + rockstarAge + "<br /> reason: " + rockstarWhy + "<br />";
   // If the rockstar was in a band print the band.
   if (rockstarBand) {
       captionEls.innerHTML += rockstarNames + " was a member of <i>" + rockstarBand + "</i>";
   }
   // Append the caption to the card div
   cardEls.appendChild(captionEls);
   // Create the button element.
    var buttonEl
    buttonEl = document.createElement("button");
    buttonEl.classList.add("deleteButton");
    buttonEl.setAttribute("data-id", rockstarIds);
    buttonEl.innerHTML = "Delete";
    // Append the button the card div
    cardEls.appendChild(buttonEl);

    return cardEls;
}

function hookUpDeleteEvents() {
   deleteButtons = document.querySelectorAll("div.card .deleteButton");
   for(var idx=0; idx<deleteButtons.length; idx++) {
      deleteButtons[idx].addEventListener("click", function(eventInfo) {
         handleDeleteEvent(eventInfo.target);
      })
   }
}

function handleDeleteEvent(button) {
   console.log("The delete button for rockstar with id " + button.getAttribute("data-id") + " was pressed!");
   var buttonPressed = parseInt(button.getAttribute("data-id"));
   /*
      -  Write the code that removes the rockstar, both from the starList array
         and from the DOM.
      -  One way to keep this simple is to delete the rockstar from the starList
         array, then empty the entire starList in the DOM, and then use showList()
         to re-create the HTML for all remaining rockstars.
      -  To remove the rockstar from the array, you'll need a for-loop to find the
         position in the array of the star with the given _id. Then use the array.splice
         method to remove it from the array.
   */
   for (var i = 0; i < starList.length; i++) {
       // Test to output the ids.
       console.log(starList[i]._id);
       // Test to output buttonPressed
       console.log(buttonPressed);
       if (buttonPressed === starList[i]._id) {
           console.log("gelukt");
           starList.splice(i,1);
       }
   }
    // Make sure these functions are called again.
    showList();
    hookUpDeleteEvents();
}

getData();
showList();
hookUpDeleteEvents();
