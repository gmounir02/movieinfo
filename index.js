let movieNameRef = document.getElementById("movie-name");
let searchBtn = document.getElementById("search-btn");
let result = document.getElementById("result");
let suggestions = document.getElementById("suggestions");
let loading = document.getElementById("loading");

function showLoading() {
  loading.style.display = "block";
  result.innerHTML = "<h3 class=\"msg\"></h3>"
}

function hideLoading() {
  loading.style.display = "none";
}

let getMovieSuggestions = (input) => {
  fetch(`http://www.omdbapi.com/?s=${input}&apikey=${key}`)
    .then((resp) => resp.json())
    .then((data) => {
      if (data.Search) {
        const movieTitles = data.Search.map((movie) => movie.Title);
        suggestions.innerHTML = movieTitles
          .map((title) => `<div class="suggestion">${title}</div>`)
          .join("");

        // Add a click event listener to each suggestion
        const suggestionElements = suggestions.querySelectorAll(".suggestion");
        suggestionElements.forEach((suggestion) => {
          suggestion.addEventListener("click", () => {
            // Set the input value to the suggestion text
            movieNameRef.value = suggestion.textContent;
            // Trigger the search
            getMovie();
            suggestions.innerHTML = ""; // Clear the suggestions
          });
        });
      }
    })
    .catch(() => {
      suggestions.innerHTML = "";
    });
};

let getMovie = () => {
  let movieName = movieNameRef.value;
  let url = `http://www.omdbapi.com/?t=${movieName}&apikey=${key}`;

  if (movieName.length <= 0) {
    result.innerHTML = `<h3 class="msg">Please enter a movie name </h3>`;
  } else {
    showLoading(); // Show loading animation

    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        hideLoading(); // Hide loading animation

        if (data.Response == "True") {
          result.innerHTML = `
                        <div class="info">
                            <img src=${data.Poster} class="poster">
                            <div>
                                <h2>${data.Title}</h2>
                                <div class="rating">
                                    <img src="star-icon.svg">
                                    <h4>${data.imdbRating}</h4>
                                </div>
                                <div class="details">
                                    <div class="detail-item">
                                        <span class="detail-label">Rated:</span>
                                        <span class="detail-value">${data.Rated}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Year:</span>
                                        <span class="detail-value">${data.Year}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Runtime:</span>
                                        <span class="detail-value">${data.Runtime}</span>
                                    </div>
                                </div>

                                <div class="genre">
                                    <div>${data.Genre.split(",").join("</div><div>")}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="plot">
                            <h3>Plot:</h3>
                            <p>${data.Plot}</p>
                        </div>
                        <div class="cast">
                            <h3>Cast:</h3>
                            <p>${data.Actors}</p>
                        </div>

                    `;
        } else {
          result.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
        }
      })
      .catch(() => {
        hideLoading(); // Hide loading animation
        result.innerHTML = `<h3 class="msg">Error Occurred</h3>`;
      });
      suggestions.innerHTML = "";

  }
};

movieNameRef.addEventListener("input", function (ev) {
  const input = ev.target.value;
  if (input.length > 0) {
    getMovieSuggestions(input);
  }
});

searchBtn.addEventListener("click", getMovie);
window.addEventListener("load", getMovie);
