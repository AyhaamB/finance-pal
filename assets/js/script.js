function showCurrentTime() {
  let currentDate = dayjs();
  let timeDisplay = document.getElementById("time-display");
  let formattedTime = currentDate.format("hh:mm A");
  let today = dayjs().format("YYYY-MM-DD");
  let startTime = dayjs(today + " 09:30 AM", "YYYY-MM-DD hh:mm A");
  let endTime = dayjs(today + " 04:00 PM", "YYYY-MM-DD hh:mm A");
  let status = "";

  if (currentDate.isAfter(startTime) && currentDate.isBefore(endTime)) {
    timeDisplay.style.color = "#454B1B";
    status = "Open";
    timeDisplay.title = 'Market Open'
  } else {
    timeDisplay.style.color = "#D2042D";
    status = "Closed";
    timeDisplay.title = 'Market Closed'
  }
  timeDisplay.textContent = formattedTime + " (" + status + ")";
}

setInterval(showCurrentTime, 1000);

document.addEventListener('DOMContentLoaded', function() {
  const toggleStocksButton = document.querySelector('.toggle-stocks');
  const stockExit = document.querySelector('.stock-exit')
  const sidebar = document.querySelector('.sidebar');

  toggleStocksButton.addEventListener('click', function() {
    sidebar.classList.toggle('open');
  });
  stockExit.addEventListener('click', function() {
    sidebar.classList.toggle('open');
  });
});



// Stock search input that takes the stock symbol and pulls its data
let stockSearchBtn = document.querySelector("#search-stock");
let stockDisplay = document.querySelector(".stock-list");
let stocksQueue = [];
let stockSearchForm = document.getElementById("stock-search-form");
let stockInput = document.querySelector(".stock-input");

// Listen for form submission
stockSearchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get the stock input value
  let inputValue = stockInput.value.trim();
  let stockDate = dayjs().format("YYYY-MM-DD");

  if (inputValue !== "") {
    let selectedDate = dayjs(stockDate);
    let dayOfWeek = selectedDate.day();

    // Check if the current day is Sunday or Saturday, if yes then move back to the most recent Friday
    if (dayOfWeek === 0 || dayOfWeek === 1) {
      if (dayOfWeek === 1) {
        selectedDate = selectedDate.subtract(3, "day");
      }
      if ((dayOfWeek = 0)) {
        selectedDate = selectedDate.subtract(2, "day");
      } else {
        selectedDate = selectedDate.subtract(1, "day");
      }
    }

    let apiKey = "API_KEYe9TCNAFS7EF7LF3QP84NZBPN145ZXTAL";
    let apiUrl = `https://api.finage.co.uk/history/stock/open-close?stock=${inputValue}&date=${selectedDate.format("YYYY-MM-DD")}&apikey=${apiKey}`;

    fetch(apiUrl)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        // Calling the function to display the stock data and store it in the local storage
        displayStockData(data);
        localStorage.setItem("stockData", JSON.stringify(data));
      })
      .catch(function (error) {
        console.error("Fetch error:", error);
      })
      .finally(function () {
        // Clear the input field
        stockInput.value = "";
      });
  } else {
    alert("Please enter a valid search term.");
  }
});



// Retrieve and display stored stock data from local storage, if it is a value it will display the stock
let storedStockData = JSON.parse(localStorage.getItem("stockData"));
if (storedStockData) {
  displayStockData(storedStockData);
}

function displayStockData(data) {
  stockDisplay.innerHTML = "";

  let stockResult = document.createElement("div");
  stockResult.className = "stock-result";
  let nameEl = document.createElement("p");
  nameEl.className = "stock-name";
  let stockInfo = document.createElement('div');
  stockInfo.className = "stock-info";
  let openEl = document.createElement("li");
  let closeEl = document.createElement("li");
  let highEl = document.createElement("li");
  let lowEl = document.createElement("li");

  stockResult.appendChild(nameEl);
  stockResult.appendChild(stockInfo);
  stockInfo.appendChild(openEl);
  stockInfo.appendChild(closeEl);
  stockInfo.appendChild(highEl);
  stockInfo.appendChild(lowEl);

  nameEl.textContent = data.symbol;
  openEl.textContent = `Open ${data.open}`;
  closeEl.textContent = `Close ${data.close}`;
  highEl.textContent = `↑ ${data.high}`;
  lowEl.textContent = `↓ ${data.low}`;

  // adds most recent stock to beginning of list and removes the oldest one
  stocksQueue.unshift(stockResult);
  if (stocksQueue.length > 3) {
    stocksQueue.pop();
  }

  // Display the stocks in the queue
  stocksQueue.forEach(function (stock) {
    stockDisplay.appendChild(stock);
  });
}

// add an event listener to the keyword search input, on submit it will send the input into local storage where it will be used by the search bar on index1.html
let searchForm = document.querySelector(".search-container");
let searchInput = document.querySelector("#search-input");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let extendedSearch = searchInput.value;
  localStorage.setItem("searchQuery", extendedSearch);
  searchInput.value = "";
  window.location.href = "index1.html";
});

// fetch to get api data for other news scrollable div
function fetchGnewsSearch() {
  let apiKey = "08b12619f21c8c52e27c1e2c7a19171b";
  let apiUrl =
    "https://gnews.io/api/v4/top-headlines?category=business&lang=en&apikey=" +
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
      displayOther(data);
    })
    .catch(function (error) {
      console.error("Fetch error:", error);
    });
}

function mainDisplay() {
  let apiKey = "08b12619f21c8c52e27c1e2c7a19171b";
  let apiUrl =
    "https://gnews.io/api/v4/top-headlines?category=business&lang=en&apikey=" +
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
      mainDisplayResults(data);
    })
    .catch(function (error) {
      console.error("Fetch error:", error);
    });

  function mainDisplayResults(data) {
    let headEl = document.getElementById("display-title");
    let mainContainer = document.querySelector(".news-item");
    let descriptionEl = document.getElementById("main-description");
    let articleLink = document.querySelector(".article-link");

    var articlesData = [
      {
        title: data.articles[0].title,
        description: data.articles[0].description,
        image: data.articles[0].image,
      },
      {
        title: data.articles[1].title,
        description: data.articles[1].description,
        image: data.articles[1].image,
      },
      {
        title: data.articles[2].title,
        description: data.articles[2].description,
        image: data.articles[2].image,
      },
      {
        title: data.articles[3].title,
        description: data.articles[3].description,
        image: data.articles[3].image,
      },
      {
        title: data.articles[4].title,
        description: data.articles[4].description,
        image: data.articles[4].image,
      },
    ];

    let index = 0; // Start with the first article
    let currentArticle = articlesData[index];

    headEl.textContent = currentArticle.title;
    descriptionEl.textContent = currentArticle.description;
    mainContainer.style.backgroundImage = `url(${currentArticle.image})`;
    articleLink.href = currentArticle.url;

    function navigate(direction) {
      if (direction === "next") {
        index = (index + 1) % articlesData.length;
      } else if (direction === "prev") {
        index = (index - 1 + articlesData.length) % articlesData.length;
      }
      currentArticle = articlesData[index];
      headEl.textContent = currentArticle.title;
      descriptionEl.textContent = currentArticle.description;
      mainContainer.style.backgroundImage = `url(${currentArticle.image})`;
      articleLink.href = currentArticle.url;
    }

    function startAutoscroll() {
      navigate("next");
      setInterval(() => navigate("next"), 20000);
    }

    // Add event listeners to manual navigation buttons
    document
      .getElementById("prevBtn")
      .addEventListener("click", () => navigate("prev"));
    document
      .getElementById("nextBtn")
      .addEventListener("click", () => navigate("next"));

    // starts the interval to autoscroll
    startAutoscroll();
  }
}

mainDisplay();
fetchGnewsSearch();

function displayOther(data) {
  let other1Img = document.getElementById("other1");
  let other2Img = document.getElementById("other2");
  let other3Img = document.getElementById("other3");
  let other4Img = document.getElementById("other4");
  let other5Img = document.getElementById("other5");
  let title5El = document.querySelector("#title5");
  let title6El = document.querySelector("#title6");
  let title7El = document.querySelector("#title7");
  let title8El = document.querySelector("#title8");
  let title9El = document.querySelector("#title9");

  title5El.innerHTML = `<a href="${data.articles[5].url}" target="_blank">
  <p class="other-title">${data.articles[5].title}</p>
  <p class="other-text">${data.articles[5].description}</p></a>`;
  title6El.innerHTML = `<a href="${data.articles[5].url}" target="_blank">
  <p class="other-title">${data.articles[6].title}</p>
  <p class="other-text">${data.articles[6].description}</p></a>`;
  title7El.innerHTML = `<a href="${data.articles[5].url}" target="_blank">
  <p class="other-title">${data.articles[7].title}</p>
  <p class="other-text">${data.articles[7].description}</p></a>`;
  title8El.innerHTML = `<a href="${data.articles[5].url}" target="_blank">
  <p class="other-title">${data.articles[8].title}</p>
  <p class="other-text">${data.articles[8].description}</p></a>`;
  title9El.innerHTML = `<a href="${data.articles[5].url}" target="_blank">
  <p class="other-title">${data.articles[9].title}</p>
  <p class="other-text">${data.articles[9].description}</p></a>`;

  other1Img.style.backgroundImage = `url(${data.articles[5].image})`;
  other2Img.style.backgroundImage = `url(${data.articles[6].image})`;
  other3Img.style.backgroundImage = `url(${data.articles[7].image})`;
  other4Img.style.backgroundImage = `url(${data.articles[8].image})`;
  other5Img.style.backgroundImage = `url(${data.articles[9].image})`;
}
