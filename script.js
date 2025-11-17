const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const moviesContainer = document.getElementById("moviesContainer");
const slider = document.getElementById("moviesContainer");
const leftBtn = document.querySelector(".left-btn");
const rightBtn = document.querySelector(".right-btn");
const trendingSection = document.getElementById("movieSection");
const searchResultsSection = document.getElementById("searchResultsSection");
const detailsSection = document.getElementById("movieDetails");

let lastPage = "trending"; // track last page user came from

const API_KEY = "f8545b6ebca0158ac1e879eaf04817c7";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

document.addEventListener("DOMContentLoaded", () => {
    fetchTrendingMovies();
    displayDate();
});

// Fetch Trending
async function fetchTrendingMovies() {
    moviesContainer.innerHTML = "<p>Loading...</p>";
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const data = await res.json();
    displayMovies(data.results);
}

// Search
searchBtn.addEventListener("click", () => searchHandler());
searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") searchHandler();
});

async function searchHandler() {
    let query = searchInput.value.trim();
    if (!query) return;

    lastPage = "search";
    await searchMovies(query);

    document.querySelector(".hero").classList.add("hidden");
    trendingSection.classList.add("hidden");
    searchResultsSection.classList.remove("hidden");
}

async function searchMovies(query) {
    document.getElementById("searchResults").innerHTML = "<p>Searching...</p>";

    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    const data = await res.json();

    displaySearchResults(data.results);
}

// DISPLAY MOVIES
function displayMovies(movies) {
    moviesContainer.innerHTML = "";

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");

        card.addEventListener("click", () => showDetails(movie));

        const poster = movie.poster_path 
            ? IMG_URL + movie.poster_path 
            : "https://via.placeholder.com/300x450?text=No+Image";

        card.innerHTML = `
            <img src="${poster}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        `;

        moviesContainer.appendChild(card);
    });
}

// SHOW DETAILS PAGE
async function showDetails(movie) {
    lastPage = lastPage; // keep stored

    const movieId = movie.id;

    const detailsRes = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    const details = await detailsRes.json();

    const castRes = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`);
    const castData = await castRes.json();
    const castList = castData.cast.slice(0, 6).map(c => c.name).join(", ") || "No Cast Info";

    document.getElementById("detailsPoster").src =
        details.poster_path ? IMG_URL + details.poster_path : "https://via.placeholder.com/300x450?text=No+Image";

    document.getElementById("detailsTitle").textContent = details.title;
    document.getElementById("detailsRating").textContent = `⭐ ${details.vote_average.toFixed(1)}`;
    document.getElementById("detailsOverview").textContent = details.overview;
    document.getElementById("detailsRelease").textContent = `📅 Release: ${details.release_date}`;

    document.getElementById("detailsGenre").textContent =
        `🎭 ${details.genres.map(g => g.name).join(", ")}`;

    document.getElementById("detailsRuntime").textContent =
        `⏳ ${details.runtime ? details.runtime + " mins" : "N/A"}`;

    document.getElementById("detailsCert").textContent =
        `🔞 ${details.adult ? "18+" : "U/A"}`;

    document.getElementById("detailsCast").textContent = castList;

    document.getElementById("detailsLink").href =
        `https://www.themoviedb.org/movie/${movieId}`;

    document.querySelector(".hero").classList.add("hidden");
    trendingSection.classList.add("hidden");
    searchResultsSection.classList.add("hidden");

    detailsSection.classList.remove("hidden");
}

// BACK BUTTON — FIXED FOR BOTH PAGES
document.getElementById("backBtn").addEventListener("click", () => {

    detailsSection.classList.add("hidden");

    if (lastPage === "search") {
        searchResultsSection.classList.remove("hidden");
    } else {
        trendingSection.classList.remove("hidden");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
});

// DATE
function displayDate() {
    const now = new Date();
    const format = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };
    document.getElementById("dateBox").innerText =
        now.toLocaleDateString("en-US", format);
}

// SEARCH RESULTS GRID
function displaySearchResults(movies) {
    const grid = document.getElementById("searchResults");
    grid.innerHTML = "";

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("grid-card");

        card.addEventListener("click", () => showDetails(movie));

        const poster = movie.poster_path 
            ? IMG_URL + movie.poster_path 
            : "https://via.placeholder.com/300x450?text=No+Image";

        card.innerHTML = `
            <img src="${poster}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        `;

        grid.appendChild(card);
    });
}
rightBtn.addEventListener("click", () => {
    slider.scrollBy({ left: 250, behavior: "smooth" });
});

leftBtn.addEventListener("click", () => {
    slider.scrollBy({ left: -250, behavior: "smooth" });
});
