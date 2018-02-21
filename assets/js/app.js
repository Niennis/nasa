'use strict';

window.onload = function() {
  window.nasaConnection = new nasaConnection();
  $('#askNews').click(getNews);  
};

// -------------------------------Initializes nasaConnection.
function nasaConnection() {
  this.checkSetup();
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin');
  this.signInContainer = document.getElementById('signInContainer');
  this.dailyImgContainer = document.getElementById('dailyImgContainer');
  
  this.newsContainer = document.getElementById('newsContainer');

  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.signInButton.addEventListener('click', this.signIn.bind(this));

  this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.

nasaConnection.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};


nasaConnection.prototype.signIn = function() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};

// Signs-out of Friendly Chat.

nasaConnection.prototype.signOut = function() {
  // Sign out of Firebase.
  this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.

nasaConnection.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
    // Get profile pic and user's name from the Firebase user object.
    var profilePicUrl = user.photoURL; // Only change these two lines!
    var userName = user.displayName; // Only change these two lines!

    // Set the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    this.userName.textContent = userName;

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');
    this.signOutButton.removeAttribute('hidden');

    // Hide sign-in button.
    this.signInContainer.setAttribute('hidden', 'true');
    // this.dailyImgContainer.removeAttribute('hidden');
    this.newsContainer.removeAttribute('hidden');
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');

    // Show sign-in button.
    this.signInContainer.removeAttribute('hidden');
    // this.dailyImgContainer.setAttribute('hidden', 'true');
    this.newsContainer.setAttribute('hidden', 'true');
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
nasaConnection.prototype.checkSignedInWithMessage = function() {
  // Return true if the user is signed in Firebase
  if (this.auth.currentUser) {
    return true;
  }
  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
  return false;
};


// Checks that the Firebase SDK has been correctly setup and configured.
nasaConnection.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
      'Make sure you go through the codelab setup instructions and make ' +
      'sure you are running the codelab using `firebase serve`');
  }
};

// buscar por https://nasa-project-nienna.firebaseapp.com
// url (requerida), opciones (opcional) SBmiPgE8WXMZztwJFFZhKpAb5CyIKhGr8kUTD5zz   https://api.nasa.gov/EPIC/api/natural/images?api_key=DEMO_KEY 

let btnSearchPlanet = document.getElementById('btnSearchPlanet');

function showApiNAsa() {
  $('#bla').empty();
  let searchPlanet = document.getElementById('searchPlanet').value;
  fetch(`https://images-api.nasa.gov/search?q=${searchPlanet}`, {
    method: 'get'
  }).then(function (response) {
    response.json()
      .then(function (response) {
        console.log(response);
        let images = response.collection.items;
        let descript = response.collection.items;
        images.filter(element => {
          let imageHref = element.links[0].href;
          let description = element.data[0].description_508;
          $('#showTheImages').append(`<div class="col-lg-4" id="bla">
          <div class="thumbnail" >
            <a href="#">
            <img src="${imageHref}" alt="planets" class="imgSearch">
            <div class="caption">
            <p>${description}</p>
            </div>
            </a>
          </div>
          </div>`);
        });
      });
  }).catch(function (err) {
    // Error :(
  });//https://api.nasa.gov/planetary/earth/assets?lon=100.75&lat=1.5&begin=2014-02-01&api_key=DEMO_KEY
}//https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=DEMO_KEY
btnSearchPlanet.addEventListener('click', showApiNAsa);

// ------------------------------------------- NEWS API------

function loadNews() {
  let searchWord = document.getElementById('searchWord').value;
  let sortBy = document.getElementById('sortBy').value;
  let language = document.getElementById('language').value;
  let news = document.getElementById('news');
  let askNews = document.getElementById('askNews');

  // fetch('https://newsapi.org/v2/top-headlines?apiKey=19214f11097341d1ad450bb2ad214ce1&country=us&category=science&q=nasa')
  fetch(`https://newsapi.org/v2/everything?apiKey=19214f11097341d1ad450bb2ad214ce1&q=nasa%20science&language=${language}&sortBy${sortBy}`)
    .then(function(response) {
      // Turns the the JSON into a JS object
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      console.log(data.articles[1]);
      for (let i = 0; i < data.articles.length; i++) {
        let info = data.articles[i];
        let infoImg = info.urlToImage;
        console.log(infoImg);
        if (info.urlToImage === null || infoImg.indexOf('https') < 0) {
          let newDiv = `<div class="row newDiv">
                        <div class="col-lg-12">
                          <h3 class="titleNews"><a href="${info.url}" class="urlNews">${info.title}</a></h3>
                          <h5 class="descriptioNres">${info.description}</h5>
                          <h6 class="dateNews">Date: ${info.publishedAt}.</h6>        
                          <h6 class="sourceNews"> Publicado en: ${info.source.name}</h6>
                        </div>
                      </div>`;
          $('#news').append(newDiv);
        } else {
          let newDiv = `<div class="row newDiv">
                        <div class="col-lg-12 text-center">
                        <img src="${info.urlToImage}" class="imgNews rounded mx-auto d-block img-fluid" alt="">
                          <h3 class="titleNews"><a href="${info.url}" class="urlNews">${info.title}</a></h3>
                          <h5 class="descriptioNres">${info.description}</h5>
                          <h6 class="dateNews">Date: ${info.publishedAt}.</h6>        
                          <h6 class="sourceNews"> Publicado en: ${info.source.name}</h6>
                        </div>
                      </div>`;
          $('#news').append(newDiv);
          ;
        }  
      };
    })
    .catch(function(error) {
      console.log('Something not found');
    });
}
loadNews();

function getNews() {
  console.log('whaaaaat');
  $('#news').empty();
  let searchWord = document.getElementById('searchWord').value;
  let sortBy = document.getElementById('sortBy').value;
  let language = document.getElementById('language').value;
  let news = document.getElementById('news');
  let askNews = document.getElementById('askNews');

  // fetch('https://newsapi.org/v2/top-headlines?apiKey=19214f11097341d1ad450bb2ad214ce1&country=us&category=science&q=nasa')
  fetch(`https://newsapi.org/v2/everything?apiKey=19214f11097341d1ad450bb2ad214ce1&q=nasa%20science%20${searchWord}&language=${language}&sortBy${sortBy}`)
    .then(function(response) {
      // Turns the the JSON into a JS object
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      console.log(data.articles[1]);
      for (let i = 0; i < data.articles.length; i++) {
        let info = data.articles[i];
        let infoImg = info.urlToImage;
        console.log(infoImg);
        if (infoImg === null || infoImg.indexOf('https') < 0) {
          let newDiv = `<div class="row newDiv">
                        <div class="col-lg-12">
                          <h3 class="titleNews"><a href="${info.url}" class="urlNews">${info.title}</a></h3>
                          <h5 class="descriptioNres">${info.description}</h5>
                          <h6 class="dateNews">Date: ${info.publishedAt}.</h6>        
                          <h6 class="sourceNews"> Publicado en: ${info.source.name}</h6>
                        </div>
                      </div>`;
          $('#news').append(newDiv);
        } else {
          let newDiv = `<div class="row newDiv">
                        <div class="col-lg-12 text-center">
                        <img src="${info.urlToImage}" class="imgNews rounded mx-auto d-block img-fluid" alt="">
                          <h3 class="titleNews"><a href="${info.url}" class="urlNews">${info.title}</a></h3>
                          <h5 class="descriptioNres">${info.description}</h5>
                          <h6 class="dateNews">Date: ${info.publishedAt}.</h6>        
                          <h6 class="sourceNews"> Publicado en: ${info.source.name}</h6>
                        </div>
                      </div>`;
          $('#news').append(newDiv);
          ;
        }  
      };
    })
    .catch(function(error) {
      console.log('Something not found');
    }); 
};

// -----------------------------------------------FIN NEWS API