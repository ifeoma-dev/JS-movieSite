
// DOM manipulation
const searches = document.querySelector("#searches"),
form = document.querySelector('.form'),
inputBox = document.querySelector(".input-search"),
searchDisplay = document.querySelector("#searched-movies"),
searchTitle = document.querySelector("#search-header"),
topRMovies = document.querySelector("#topRated"),
defaultMovies = document.querySelector(".default-movies"),
main = document.querySelector("#main"),
endSearch = document.querySelector('.close-search'),
infoOverlay = document.querySelectorAll('.info-overlay'),
imgDisplayEls = document.querySelectorAll(".display-image"),
largeMoviePoster = document.querySelector("#movie-large"),
infoDisplay = document.querySelector('.info-display'),
movieTitleWrapper = document.querySelector('.movie-title-wrapper'),
// movieTitleDisplay = document.querySelector('#movie-title'),
submitBtn = document.querySelector("#submit-btn");

// css

// omdb API essentials
const apiKeyO = "40ee8b6",
preEndpointO = `http://www.omdbapi.com/?i=tt3896198&apikey=${apiKeyO}`,
preThumbnailO = "https://image.tmdb.org/t/p/w500";

// tmdb API essentials
const apiKeyT = "f51a46e306f9cb702cb4dc0df3751aa1";
const preEndpointT = `https://api.themoviedb.org/3/search/movie?api_key=${apiKeyT}`;
const preThumbnailT = "https://image.tmdb.org/t/p/w500";
const topRated = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKeyT}&language=en-US`;
const popular = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKeyT}&language=en-US`;
const upcoming = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKeyT}&language=en-US`;
const preSimilarMovies = `https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key=${apiKeyT}&language=en-US`

$('#p-home').click(()=> {
    location.reload();
})

    // display searched movies
    submitBtn.onclick = (e) => {

        e.preventDefault();

        if (inputBox.value.length === 0) {
            form.classList.toggle('search-ready');
            inputBox.classList.toggle('search-ready-input');
        }
    
        if (inputBox.value.length > 0) {
            defaultMovies.style.display = "none";
            searchDisplay.style.display = "block";
            generateMovies();
            inputBox.value = "";
        }
       
    }


// show default movies
// function params(categoryEndPoint, h3Display)
showMovies(topRated, "Top-Rated"); 
showMovies(popular, "Popular");
showMovies(upcoming, "Upcoming");


async function showMovies(endP, title){

    await fetch(endP)
     .then(res => res.json())
      .then((data)=> {
        const results = data.results;
        console.log(results)
        showMovies2(results, title);
      })
}


function showMovies2(variable, text){

    // create template literal to work with
    // set img element template literal to a function that returns
    const displayTemplate = `
        <section class="movie-section" id=${text}>
          <h3 class="header">${text}</h3>
          <div class="movies-array">
            ${showMovies3(variable)} 
          </div>
        </section>`

        defaultMovies.innerHTML += displayTemplate;

}


function showMovies3(variable){
    let dataId = -1;

    return variable.map((variable) => {
        if (variable.poster_path) {
            const posterPath = variable.poster_path, // set up movie poster pt1
            posterEndpoint = preThumbnailT + posterPath, // set up movie poster pt2
            movieID = variable.id,
            released = variable.release_date,
            releaseDate = new Date(released),
            nowDate = new Date(),
            rating = variable.vote_average,
            movieInfo = variable.overview;
            movieTitle = variable.title;
            // similarMovies(movieID);

            dataId++;
            return `
            <img src=${posterEndpoint} class="display-image" id=${movieID} data-id=${dataId} />
            <div class="info-overlay">
            <div class="info-display">
              <svg class="close-info-display" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg>
               <img class="movie-large" src=${posterEndpoint} id=${movieID} alt="image"/>
              <div class="movie-rates">
                <button class='movie-prompt' id=${movieID}>Get Associated Videos</button>
              </div>
              <div class="movie-descrip">
                  <div class="movie-title-wrapper">
                      <h1 id="movie-title">${movieTitle}</h1> 
                      <div class="extra-info">
                      <p>${ releaseDate > nowDate ? `Releasing: ${released}` : `Released: ${released}`}</p>
                          <p>Rating: ${rating}/10</p>
                      </div>
                  </div>
                  <div class='movie-summary' >
                    <p>${movieInfo}</p>
                  </div>
              </div> 
            </div>
          </div>`
        }
    
    });

}

// async function similarMovies(idKey){
//     let result = '';

//     await fetch(`https://api.themoviedb.org/3/movie/${idKey}/videos?api_key=${apiKeyT}&language=en-US`)
//       .then(res => res.json())
//         .then((data)=> {
//             const recMoviesResults = data.results;
//             const preLength = recMoviesResults.length;
//             const length = preLength > 4 ? '4' : `${preLength}`;
//             console.log(recMoviesResults);
//             for (let i = 0; i < length; i++) {
//                 // const video = document.createElement('video');
//                 // const videoSrcAttr = document.createElement('source');
//                 // const targetVideo = recMoviesResults[i];
//                 // const videoKey = targetVideo.key;
//                 // console.log(videoKey, i);
//                 // const videoSrc = `https://www.youtube.com/embed/${videoKey}`;
//                 // video.setAttribute('controls', '');
//                 // video.setAttribute('data-id', i);
//                 // videoSrcAttr.setAttribute('src', videoSrc);
//                 // video.append(videoSrcAttr);
//                 let video =`<video controls>
//                           <source />
//                         </video>`
//                 result += video;
//             }
//             return result;
// })
// }

// generate searched movies pt1
async function generateMovies(){
    searches.innerHTML = "";
    const searchedMovie = inputBox.value;
    searchTitle.textContent = `Results for: "${searchedMovie}"`;
    await fetch(preEndpointT + "&query=" + searchedMovie)
      .then(res => res.json())
        .then((data)=> {
            const results = data.results;
            searches.innerHTML = (moviesSearched(results));
        }).catch();
}

// generate searched movies pt2
function moviesSearched(variable){

    return variable.map((variable) => {
        if (variable.poster_path) {
            const posterPath = variable.poster_path,
            posterEndpoint = preThumbnailT + posterPath,
            movieID = variable.id,
            released = variable.release_date,
            releaseDate = new Date(released),
            nowDate = new Date(),
            rating = variable.vote_average,
            movieInfo = variable.overview;
            movieTitle = variable.title;

            return `
                <img src=${posterEndpoint} class="display-image" id=${movieID} />
                <div class="info-overlay">
                  <div class="info-display">
                    <svg class="close-info-display" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg>
                      <img class="movie-large" src=${posterEndpoint} id=${movieID} alt="image"/>
                    <div class="movie-rates">
                      <button class='movie-prompt' id='${movieID}'>Get Associated Videos</button>
                    </div>
                    <div class="movie-descrip">
                        <div class="movie-title-wrapper">
                            <h1 id="movie-title">${movieTitle}</h1> 
                            <div class="extra-info">
                                <p>${ releaseDate > nowDate ? `Releasing: ${released}` : `Released: ${released}`}</p>
                                <p>Rating: ${rating}</p>
                            </div>
                        </div>
                        <div class='movie-summary' >
                          <p>${movieInfo}</p>
                        </div>
                    </div> 
                  </div>
                </div>`
        }
    })
}


// add multiple events to an element
function addMultipleEvents(eventObject, targetElem){

    if (targetElem.length > 1) {
        Object.keys(eventObject).map((key)=> {
            targetElem.forEach((targetElem) => {
                targetElem.addEventListener(key, eventObject[key]);
            });
        })
    }

    Object.keys(eventObject).map((key)=> {
        targetElem.addEventListener(key, eventObject[key]);
    })
}

// document event listener
document.addEventListener("mouseover", mouseoverEffect);

function mouseoverEffect(e){
    if (e.target.classList.contains('display-image')) {
        e.target.classList.add("hover-image");
        e.target.style.marginLeft = "15px";
        e.target.style.marginRight = "12px";

        addMultipleEvents(imgEvents, e.target);
    }

    if (e.target.classList.contains('close-info-display')) {
        e.target.onclick = function(){
            const infoTwo = this.parentElement.parentElement;
            infoTwo.style.display = "none";
            document.body.style.overflow = "visible";
        }
    }

    if (e.target.classList.contains('movie-prompt')) {
        e.target.onclick = function(event) {
            e.target.disabled = true;
            targetMovieID = event.target.id;
            console.log(targetMovieID);
            movieVideos(event, targetMovieID);
        }
    }
}

// all movie thubmnail image events
const imgEvents = {
   click: imageOnclick,
   mouseleave: mouseleaveEffect
}

function imageOnclick(e){
    const div = e.target.nextElementSibling;
    div.style.display = "flex";
    document.body.style.overflow = "hidden";
 }

   function mouseleaveEffect(e){

    e.target.classList.remove("hover-image");
    e.target.style.marginLeft = "0";
    e.target.style.marginRight = "10px";
}

// gets videos associated with a movie
async function movieVideos(e, idKey){
    await fetch(`https://api.themoviedb.org/3/movie/${idKey}/videos?api_key=${apiKeyT}&language=en-US`)
      .then(res => res.json())
        .then((data)=> {
            const recMovies = data.results;
            const length = recMovies.length > 4 ? '4' : `${recMovies.length}`
            console.log(recMovies, length);
            for (let i = 0; i < length; i++) {
                const key = recMovies.key;
                const videoSrc = `https://www.youtube.com/embed/${key}`;
                const video = document.createElement('video');
                const vidSourceEl = document.createElement('source');
                video.setAttribute('data-id', i);
                video.setAttribute('controls', '');
                vidSourceEl.setAttribute('src', videoSrc);
                const videoParent = e.target.parentElement;
                video.append(vidSourceEl);
                videoParent.append(video);

            }

        })
}

// function to get an element's siblings
function getElementSiblings(el) {

    let siblings = [];

    if (!el.parentNode) {
        return siblings;
    }

    let sibling = el.parentNode.firstElementChild;

    while (sibling) {

        if (sibling.nodeType === 1 && sibling !== el) {
            siblings.push(sibling)
        }

        sibling = sibling.nextElementSibling;
        return siblings;
    }
}