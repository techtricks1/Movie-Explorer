const apiKey = '483d3cc8'; //API
const movieResults = document.getElementById('movieResults');
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const genreFilter = document.getElementById('genreFilter');
const languageFilter = document.getElementById('languageFilter');
const pagination = document.getElementById('pagination');
const watchlistItems = document.getElementById('watchlistItems');
let watchlist = [];
let currentPage = 1;
let totalPages = 1;

// Event Listener for Search Button
searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    const selectedLanguage = languageFilter.value;
    searchMovies(query, currentPage, selectedLanguage);
});

// Search Movies with optional language filter
function searchMovies(query, page = 1, language = '') {
    let apiUrl = `https://www.omdbapi.com/?s=${query}&page=${page}&apikey=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                fetchMovieDetails(data.Search, language);
                totalPages = Math.ceil(data.totalResults / 10);
                setupPagination(page);
            } else {
                movieResults.innerHTML = '<p>No movies found.</p>';
                pagination.innerHTML = '';
            }
        });
}

// Fetch individual movie details and apply language filtering
function fetchMovieDetails(movies, selectedLanguage) {
    movieResults.innerHTML = ''; 

    movies.forEach(movie => {
        fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`)
            .then(response => response.json())
            .then(details => {
                if (selectedLanguage && !details.Language.toLowerCase().includes(selectedLanguage.toLowerCase())) {
                    return; 
                }

                const movieCard = `
                    <div class="movie-card">
                        <img src="${details.Poster}" alt="${details.Title}" class="movie-poster">
                        <h3>${details.Title}</h3>
                        <p>Year: ${details.Year}</p>
                        <p><strong>Language:</strong> ${details.Language}</p>
                        <button onclick="showMovieDetail('${details.imdbID}')">View Details</button>
                        <button onclick="addToWatchlist('${details.Title}')">Add to Watchlist</button>
                    </div>
                `;
                movieResults.innerHTML += movieCard;
            });
    });
}

// Show Movie Detail with full information and scrolling enabled
function showMovieDetail(imdbID) {
    const modal = document.getElementById('movieModal');
    const movieDetail = document.getElementById('movieDetail');

    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(movie => {
            movieDetail.innerHTML = `
                <span class="close-button" onclick="closeModal()">×</span>
                <h2>${movie.Title}</h2>
                <img src="${movie.Poster}" alt="${movie.Title}">
                <p><strong>Plot:</strong> ${movie.Plot}</p>
                <p><strong>Director:</strong> ${movie.Director}</p>
                <p><strong>Cast:</strong> ${movie.Actors}</p>
                <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
                <p><strong>Genre:</strong> ${movie.Genre}</p>
                <p><strong>Released:</strong> ${movie.Released}</p>
                <p><strong>Runtime:</strong> ${movie.Runtime}</p>
                <p><strong>Language:</strong> ${movie.Language}</p>
                <p><strong>Awards:</strong> ${movie.Awards}</p>
                <p><strong>Box Office:</strong> ${movie.BoxOffice}</p>
                <p><strong>Website:</strong> <a href="${movie.Website}" target="_blank">${movie.Website}</a></p>
                <a href="https://www.youtube.com/results?search_query=${movie.Title} trailer" target="_blank">Watch Trailer</a>
            `;

            // Enable scrolling and display the modal
            modal.style.display = 'block';
            modal.style.overflowY = 'scroll'; 
            modal.scrollTop = 0; 
        });
}

// Close Modal with close button (×)
function closeModal() {
    const modal = document.getElementById('movieModal');
    modal.style.display = 'none';  
}

// Watchlist Animation
const toggleWatchlistButton = document.getElementById('toggleWatchlist');
const watchlistSidebar = document.getElementById('watchlist');
const closeWatchlistButton = document.querySelector('.close-watchlist');

toggleWatchlistButton.addEventListener('click', () => {
    watchlistSidebar.classList.toggle('open');
});

closeWatchlistButton.addEventListener('click', () => {
    watchlistSidebar.classList.remove('open');
});

// Watchlist Functionality
function addToWatchlist(movieTitle) {
    if (!watchlist.includes(movieTitle)) {
        watchlist.push(movieTitle);
        renderWatchlist();
    }
}

function renderWatchlist() {
    watchlistItems.innerHTML = '';
    watchlist.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `${movie} <button onclick="removeFromWatchlist('${movie}')">Remove</button>`;
        watchlistItems.appendChild(li);
    });
}

function removeFromWatchlist(movieTitle) {
    watchlist = watchlist.filter(movie => movie !== movieTitle);
    renderWatchlist();
}

// Pagination with "Previous" and "Next" buttons only
function setupPagination(page) {
    pagination.innerHTML = '';  

    const prevButton = document.createElement('button');
    prevButton.innerText = 'Previous';
    prevButton.disabled = page === 1;
    prevButton.addEventListener('click', () => {
        if (page > 1) {
            currentPage--;
            searchMovies(searchInput.value, currentPage, languageFilter.value);
        }
    });

    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.disabled = page === totalPages;
    nextButton.addEventListener('click', () => {
        if (page < totalPages) {
            currentPage++;
            searchMovies(searchInput.value, currentPage, languageFilter.value);
        }
    });

    pagination.appendChild(prevButton);
    pagination.appendChild(nextButton);
}
