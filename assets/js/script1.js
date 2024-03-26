let searchButton = document.querySelector(".search-button");
let searchBar = document.querySelector("search-bar");
let searchQuery = localStorage.getItem("searchQuery");
let extendedSearchForm = document.querySelector(".extended-search-form");
let resultHeader = document.querySelector(".result-header");

// Get the searchQuery from local storage on page load
document.addEventListener("DOMContentLoaded", function () {
  let searchQuery = localStorage.getItem("searchQuery");

  // Update the result header if searchQuery exists
  if (searchQuery) {
    resultHeader.textContent = `Showing results for "${searchQuery}"`;
  }
});

function updateResultQuery() {
  let searchQuery = localStorage.getItem("searchQuery");

  // Update the result header if searchQuery exists
  if (searchQuery) {
    resultHeader.textContent = `Showing results for "${searchQuery}"`;
  }
}

// if something is searched run the fetch and add the keyword to the url
if (searchQuery !== "") {
  const apiKey = "08b12619f21c8c52e27c1e2c7a19171b";
  const apiUrl =
    "https://gnews.io/api/v4/search?q=" +
    searchQuery +
    "&category=business&lang=en&apikey=" +
    apiKey;

  fetch(apiUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      displayOtherNews(data);
    })
    .catch(function (error) {
      console.error("Fetch error:", error);
    });
} else {
  alert("Please enter a valid search term.");
  displayModal();
}

// function that will populate each search result under the search bar
function displayOtherNews(data) {
  let results = document.querySelector(".search-results");
  results.innerHTML = "";
  for (let i = 0; i < data.articles.length; i++) {
    let resultEl = document.createElement("a");
    resultEl.className = "single-result";

    let imageContainer = document.createElement("div");
    imageContainer.className = "result-image-container";

    let descriptionContainer = document.createElement("div");
    descriptionContainer.className = "result-description";

    let titleEl = document.createElement("h4");
    titleEl.className = "titleEl";
    let descEl = document.createElement("p");
    descEl.className = "descEl";

    descriptionContainer.appendChild(titleEl);
    descriptionContainer.appendChild(descEl);

    resultEl.appendChild(descriptionContainer);
    resultEl.appendChild(imageContainer);
    results.appendChild(resultEl);

    titleEl.textContent = data.articles[i].title;
    descEl.textContent = data.articles[i].description;
    resultEl.href = data.articles[i].url;
    resultEl.target = "_blank";

    imageContainer.style.backgroundImage = `url(${data.articles[i].image})`;
  }
}

// event listener that will capture the user input in the search field
extendedSearchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let searchInput = document.querySelector(".search-bar").value.trim();

  if (searchInput !== "") {
    // Save the search input to local storage
    localStorage.setItem("searchQuery", searchInput);

    const apiKey = "08b12619f21c8c52e27c1e2c7a19171b";
    const apiUrl =
      "https://gnews.io/api/v4/search?q=" +
      searchInput +
      "&category=business&lang=en&apikey=" +
      apiKey;

    fetch(apiUrl)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        displayOtherNews(data);
        updateResultQuery()
      })
      .catch(function (error) {
        console.error("Fetch error:", error);
      });
  } else {
    displayModal();
  }
});

function displayModal() {
  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  searchButton.onclick = function () {
    modal.style.display = "block";
  };

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}
