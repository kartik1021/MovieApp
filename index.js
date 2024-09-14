
const parentElement = document.querySelector(".main");
const searchInput = document.querySelector(".input");
const movieRatings = document.querySelector("#rating-select");
const movieGenres = document.querySelector("#genre-select");

let searchValue ="";
let ratings = 0;
let filteredArrayOfMovies = [];
let genre = "";

const URL = "./data/movie.json";
const getMovies = async (url) => {
    try{
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }catch(err){

    }
}

let movies = await getMovies(URL);

const createElement = (element) => document.createElement(element);

function getFilteredData(){
    filteredArrayOfMovies = searchValue?.length > 0 ? movies.filter(movie => searchValue === movie.name.toLowerCase() || searchValue === movie.director_name.toLowerCase() || 
    movie.writter_name.toLowerCase().split(",").includes(searchValue) ||
    movie.cast_name.toLowerCase().split(",").includes(searchValue)) : movies; 
    if(ratings >0){
        filteredArrayOfMovies = searchValue?.length > 0 ? filteredArrayOfMovies : movies;
        filteredArrayOfMovies = filteredArrayOfMovies.filter(movie => movie.imdb_rating >= ratings);
    }
    if(genre?.length>0){
        filteredArrayOfMovies = searchValue?.length > 0 || ratings > 7 ? filteredArrayOfMovies : movies;
        filteredArrayOfMovies = filteredArrayOfMovies.filter((movie) =>
            movie.genre.includes(genre)
        ) 
    }
    return filteredArrayOfMovies;
}


// creating function to create movie card

const createMovieCard = (movies) =>{

    for(let movie of movies){
        // creating parent container
        const cardContainer = createElement("div");
        cardContainer.classList.add("card","shadow");

        // create image container
        const imageContainer = createElement("div");
        imageContainer.classList.add("card-image-container");

        //card image
        const imageElement = createElement("img");
        imageElement.classList.add("card-image");
        imageElement.setAttribute("src",movie.img_link);
        imageElement.setAttribute("alt",movie.name);
        imageContainer.appendChild(imageElement);
        cardContainer.appendChild(imageContainer);

        //card details
        const cardDetails = createElement("div");
        cardDetails.classList.add("movie-details");

        //card title
        const titleEle = createElement("p");
        titleEle.classList.add("title");
        titleEle.innerText = movie.name;
        cardDetails.appendChild(titleEle);

        //card genre
        const genreEle = createElement("p");
        genreEle.classList.add("genre"); 
        genreEle.innerText = `Genre: ${movie.genre}`;
        cardDetails.appendChild(genreEle);

        //card rating container
        const cardRating = createElement("div");
        cardRating.classList.add("ratings");

        //card star rating
        const cardStarRating = createElement("div");
        cardStarRating.classList.add("star-rating");

        const starIcon = createElement("span");
        starIcon.classList.add("material-icons-outlined");
        starIcon.innerText= "star";

        const ratingValue = createElement("span");
        ratingValue.innerText= movie.imdb_rating;
        cardStarRating.appendChild(starIcon);
        cardStarRating.appendChild(ratingValue);

        const duration = createElement("p");
        duration.innerText = `${movie.duration} mins`;

        cardRating.appendChild(cardStarRating);
        cardRating.appendChild(duration);
        cardDetails.appendChild(cardRating);
        cardContainer.appendChild(cardDetails);
        parentElement.appendChild(cardContainer);
    }

};

function handleSearch(event){
    searchValue = event.target.value.toLowerCase();
    let filterBySearch = getFilteredData();
    parentElement.innerHTML = "";
    createMovieCard(filterBySearch);
}

function debounce(callaBack,delay){
    let timerId;

    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {callaBack(...args)},delay);
    }
}

function handleRatingSelector(event){
    ratings = event.target.value;
    let filterByRating = getFilteredData();
    parentElement.innerHTML = "";
    createMovieCard(ratings ? filterByRating : movies);
}

function handleGenreSelect(event){
    genre = event.target.value;
    let filterByGenre = getFilteredData();

    parentElement.innerHTML="";
    createMovieCard(genre ? filterByGenre : movies);
}

const debounceInput = debounce(handleSearch,500);

searchInput.addEventListener("keyup", debounceInput);
movieRatings.addEventListener("change", handleRatingSelector);
movieGenres.addEventListener("change", handleGenreSelect);

const genres = movies.reduce((acc, cur) => {
    let tempGenresArr = cur.genre.split(","); // Split genres into an array
    for (let genre of tempGenresArr) {
        if (!acc.includes(genre)) { // Only add unique genres to the accumulator
            acc.push(genre); // Push the genre to the accumulator
        }
    }
    return acc; // Return the accumulator after each iteration
}, []);

for(let genre of genres){
    const option = createElement("option");
    option.classList.add("option");
    option.setAttribute("value",genre);
    option.innerText = genre;
    movieGenres.appendChild(option);
}

createMovieCard(movies);