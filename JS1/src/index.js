import {
  BASE_URL,
  KEY,
  endpointSearch,
  endpointTopRated,
  endpointMostPopular,
} from "./api.js";
const submitTitle = $("#submitTitle");
const movieTitleInput = $("#titleInput");
const personInput = $("#personInput");
const submitPerson = $("#submitPerson");
const topMoviesDiv = $(".topMovies");
const mostMoviesDiv = $(".mostMovies");
const showMostBtn = $("#showMost");
const showTopBtn = $("#showTop");
const moviesWrapper = $(".topMoviesWrapper");
const mostWrapper = $(".mostMoviesWrapper");
const clearBtn = $("#clearBtn");


async function getSearch(title) {
  try {
    const url = `${BASE_URL}${endpointSearch}${KEY}&query=${encodeURIComponent(
      title
    )}&language=en=US`;
    const response = await fetch(url);
    const data = await response.json();

    data.results.forEach((movie) => {
      const overview = movie.overview;
      const titlecontent = movie.original_title;
      const imgsrc = movie.poster_path;

      const dataBox = $("<div>").addClass("dataBox").appendTo("body");

      const titleEl = $("<h1>").addClass("title").text(titlecontent);
      const overviewEl = $("<p>")
        .addClass("overview")
        .text(`Overview: ${overview}`);
      const imgEl = $("<img>")
        .addClass("poster")
        .attr(
          "src",
          imgsrc
            ? `https://www.themoviedb.org/t/p/w200/${imgsrc}`
            : "https://via.placeholder.com/200"
        );
      const closeData = $("<button>")
        .text("Close")
        .css("backgroundColor", "red")
        .on("click", () => {
          dataBox.toggleClass("noDisplay");
        });

      dataBox.append(closeData, titleEl, overviewEl, imgEl);
    });

    if (data.results.length === 0) {
      showError("Could not find title, try different spelling!");
    }
  } catch (e) {
    console.log("ERROR", e);
    fallback(`${title}`);
  }
}
//heter fallback då den används som fallback funktion i titelfunktionen. Om inga titlar hittas, söks istället automatiskt personer med samma input//
async function fallback(personName) {
  try {
    const url = `${BASE_URL}/search/person?api_key=${KEY}&query=${encodeURIComponent(
      personName
    )}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results.length > 0) {
      $(".dataBox").remove();
    }
    const databox = $("<div>").addClass("dataBox").appendTo("body");

    const closeData = $("<button>")
      .text("close")
      .css("backgroundColor", "red")
      .on("click", () => {
        databox.toggleClass("noDisplay");
      });

    databox.append(closeData);

    const imgsrc = data.results[0].profile_path;
    const personsName = $("<h1>").text(data.results[0].name);
    const profilePic = $("<img>").attr(
      "src",
      `https://www.themoviedb.org/t/p/w200/${imgsrc}`
    );
    const knownForContainer = $("<div>").addClass("knownForContainer");

    data.results[0].known_for.forEach((item) => {
      const knownForItem = $("<div>").addClass("knownForItem");

      const titleElement = $("<span>").text(
        `Famous feature: ${item.original_title}`
      );
      const mediaTypeElement = $("<span>").text(
        `Media type: ${item.media_type}`
      );

      knownForItem.append(titleElement, mediaTypeElement);
      knownForContainer.append(knownForItem);
    });

    databox.append(profilePic, personsName, knownForContainer);
  } catch (e) {
    console.log("ERROR", e);
    showError("Could not find person, try different spelling!");
  }
}

submitPerson.on("click", (event) => {
  event.preventDefault();
  const name = personInput.val();
  fallback(`${name}`);
});

clearBtn.on("click", () => {
  $(".dataBox").remove();
});

submitTitle.on("click", (event) => {
  event.preventDefault();
  const title = movieTitleInput.val();
  getSearch(`${title}`);
});

async function getTopRated() {
  try {
    const url = `${BASE_URL}${endpointTopRated}?api_key=${KEY}&language=en=US&page=1`;
    const response = await fetch(url);
    const data = await response.json();
    const top10 = data.results.slice(0, 10);

    top10.forEach((movie) => {
      const topDiv = $("<div>").css({ marginRight: "5px", marginLeft: "5px" });
      const topTitle = $("<h1>").text(movie.original_title);
      const topImg = $("<img>").attr(
        "src",
        `https://www.themoviedb.org/t/p/w300/${movie.poster_path}`
      );
      const topReleaseDate = $("<p>").text(movie.release_date);

      topDiv.append(topImg, topTitle, topReleaseDate);
      topMoviesDiv.append(topDiv);
    });
  } catch (e) {
    showError("Could not get requested Data");
    console.log("ERROR", e);
  }
}

getTopRated();

showTopBtn.on("click", () => {
  moviesWrapper.toggleClass("showTopMovies");
});

async function getMostPop() {
  try {
    const url = `${BASE_URL}${endpointMostPopular}?api_key=${KEY}&language=en=US&page=1`;
    const response = await fetch(url);
    const data = await response.json();
    const mostPop = data.results.slice(0, 10);

    mostPop.forEach((movie) => {
      const popDiv = $("<div>")
        .addClass("popDiv")
        .css({ marginRight: "5px", marginLeft: "5px" });
      const popTitle = $("<h1>").text(movie.original_title);
      const popImg = $("<img>").attr(
        "src",
        `https://www.themoviedb.org/t/p/w300/${movie.poster_path}`
      );
      const popReleaseDate = $("<p>").text(movie.release_date);

      popDiv.append(popImg, popTitle, popReleaseDate);
      mostMoviesDiv.append(popDiv);
    });
  } catch (e) {
    showError("Could not get requested Data");
    console.log("ERROR", e);
  }
}

getMostPop();

showMostBtn.on("click", () => {
  mostWrapper.toggleClass("showTopMovies");
});

function showError(message) {
  const overlay = $("<div>").addClass("error-overlay");
  const messageBox = $("<div>").addClass("error-message-box").text(message);
  const closeButton = $("<button>")
    .addClass("error-close-button")
    .text("Close")
    .on("click", () => {
      $(".dataBox").remove();
      overlay.remove();
    });

  messageBox.append(closeButton);
  overlay.append(messageBox);
  $("body").append(overlay);
}
