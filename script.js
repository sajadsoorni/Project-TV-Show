// Cache for API responses
const cache = {
  shows: null,
  episodes: new Map(),
};

// Global state
let allEpisodes = [];
let currentShowId = null;

// DOM elements
const cardsContainer = document.getElementById("cards-container");
const showContainer = document.getElementById("shows-container");
const searchInput = document.getElementById("episode-search");
const episodeSelector = document.getElementById("episode-selector");
const showSelector = document.getElementById("show-selector");
const mainHeader = document.querySelector(".main-header h1");
const breadcrumbContainer = document.querySelector(".nav-breadcrumb");
const breadcrumbList = document.querySelector(".breadcrumb");

// Helper function to create separator
const createSeparator = () => {
  const separator = document.createElement("li");
  separator.textContent = "/";
  return separator;
};

// Helper function to create breadcrumb items
const createBreadcrumbItem = (text, clickHandler = null) => {
  const li = document.createElement("li");

  if (clickHandler) {
    const span = document.createElement("span");
    span.textContent = text;
    span.style.cursor = "pointer";
    span.classList.add("breadcrumb-link");
    span.addEventListener("click", clickHandler);
    li.appendChild(span);
  } else {
    li.textContent = text;
  }

  return li;
};

// Function to update breadcrumb
const updateBreadcrumb = (show = null, episode = null) => {
  // Clear existing breadcrumb items
  breadcrumbList.innerHTML = "";

  // Hide breadcrumb if no show is selected
  if (!show) {
    breadcrumbContainer.style.display = "none";
    return;
  }

  breadcrumbContainer.style.display = "block";

  // Always make "Shows" clickable as it's never the final item
  const showsItem = createBreadcrumbItem("Shows", () => {
    showSelector.value = ""; // Reset show selector
    showShowsListing();
    updateBreadcrumb(); // Clear breadcrumb
  });
  breadcrumbList.appendChild(showsItem);

  // Add separator
  breadcrumbList.appendChild(createSeparator());

  // Add show name - only make it clickable if there's an episode selected
  const showItem = createBreadcrumbItem(
    show.name,
    episode
      ? () => {
          if (currentShowId !== show.id) {
            loadEpisodesForShow(show.id);
          }
          displayEpisodes(allEpisodes);
          showSelector.value = show.id;
          updateBreadcrumb(show); // Update breadcrumb without episode
        }
      : null
  );
  breadcrumbList.appendChild(showItem);

  // Add episode if selected
  if (episode) {
    breadcrumbList.appendChild(createSeparator());
    const episodeText = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;
    const episodeItem = createBreadcrumbItem(episodeText);
    breadcrumbList.appendChild(episodeItem);
  }
};

// Helper function to format episode codes
const formatEpisodeCode = (season, number) => {
  const seasonCode = String(season).padStart(2, "0");
  const episodeCode = String(number).padStart(2, "0");
  return `S${seasonCode}E${episodeCode}`;
};

// Create episode card
const createEpisodeCard = (episode) => {
  const card = document.createElement("div");
  card.classList.add("card");

  const episodeImgWrapper = document.createElement("div");
  episodeImgWrapper.classList.add("episode-image-wrapper");
  const placeholderImageUrl = `https://placehold.co/250x140?text=${formatEpisodeCode(episode.season, episode.number)}`;
  const img = document.createElement("img");
  img.src = episode.image?.medium || placeholderImageUrl;
  img.alt = episode.name;
  img.loading = "lazy";

  const dateAndTime = document.createElement("div");
  dateAndTime.classList.add("date-and-time");

  const clockIcon = document.createElement("li");
  clockIcon.classList.add("sajad-iconclock");
  clockIcon.style.listStyle = "none";

  const dateIcon = document.createElement("li");
  dateIcon.classList.add("sajad-iconcalendar-1");
  dateIcon.style.listStyle = "none";

  const runtimeIcon = document.createElement("li");
  runtimeIcon.classList.add("sajad-iconstopwatch");
  runtimeIcon.style.listStyle = "none";

  const airDate = document.createElement("div");
  airDate.textContent = episode.airdate;
  airDate.classList.add("formatted-datetime");

  const airTime = document.createElement("div");
  airTime.textContent = episode.airtime;
  airTime.classList.add("formatted-datetime");

  const runTime = document.createElement("div");
  runTime.textContent = `${episode.runtime} minutes`;
  runTime.classList.add("formatted-datetime");

  clockIcon.addEventListener("error", () => {
    clockIcon.style.display = "none";
    console.warn("Timer icon failed to load. Hiding it.");
  });

  dateIcon.addEventListener("error", () => {
    dateIcon.style.display = "none";
    console.warn("Date icon failed to load. Hiding it.");
  });

  const cardContent = document.createElement("div");
  cardContent.classList.add("episode-card-content");

  const episodeNumber = document.createElement("div");
  episodeNumber.classList.add("episode-number");
  episodeNumber.textContent = formatEpisodeCode(episode.season, episode.number);

  const title = document.createElement("h2");
  title.textContent = episode.name;

  const description = document.createElement("p");
  description.classList.add("paragraph");
  description.innerHTML = episode.summary || "No description available.";

  cardContent.append(episodeNumber, title, description);
  card.append(episodeImgWrapper, cardContent);
  episodeImgWrapper.append(img, dateAndTime);
  dateAndTime.append(airDate, airTime, runTime);
  airTime.appendChild(clockIcon);
  airDate.appendChild(dateIcon);
  runTime.appendChild(runtimeIcon);

  return card;
};

const filterShowsByGenre = (genre) => {
  return cache.shows.filter((show) => show.genres.includes(genre));
};

// Function to create star rating
const createStarRating = (rating) => {
  const fullRatingContainer = document.createElement("div");
  fullRatingContainer.classList.add("full-rating-container");

  // If no rating, return an empty container with "No Rating" text
  if (!rating) {
    const noRatingText = document.createElement("span");
    noRatingText.textContent = "No Rating";
    noRatingText.classList.add("no-rating");
    fullRatingContainer.appendChild(noRatingText);
    return fullRatingContainer;
  }

  // Ensure rating is between 0 and 10
  const normalizedRating = Math.min(Math.max(rating || 0, 0), 10);

  // Calculate full, half, and empty stars
  const fullStars = Math.floor(normalizedRating / 2);
  const halfStar = normalizedRating % 2 >= 1 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  // Create star elements
  for (let i = 0; i < fullStars; i++) {
    const star = document.createElement("li");
    star.className = "sajad-iconstar";
    fullRatingContainer.appendChild(star);
  }

  if (halfStar) {
    const star = document.createElement("li");
    star.className = "sajad-iconstar-half-alt";
    fullRatingContainer.appendChild(star);
  }

  for (let i = 0; i < emptyStars; i++) {
    const star = document.createElement("li");
    star.className = "sajad-iconstar-empty";
    fullRatingContainer.appendChild(star);
  }

  return fullRatingContainer;
};

// Create show card
const createShowCard = (show) => {
  const card = document.createElement("div");
  card.classList.add("tv-show-card");

  const showImgWrapper = document.createElement("div");
  showImgWrapper.classList.add("show-img-wrapper");
  const fullRatingContainer = document.createElement("div");
  fullRatingContainer.classList.add("full-rating-container");
  const starRating = createStarRating(show.rating.average);

  const img = document.createElement("img");
  img.src = show.image?.medium || "placeholder.jpg";
  img.alt = show.name;
  img.classList.add("tv-show-image");
  img.loading = "lazy";
  showImgWrapper.append(img, starRating);

  const content = document.createElement("div");
  content.classList.add("tv-show-content");

  const title = document.createElement("h2");
  title.textContent = show.name;
  title.classList.add("tv-show-title");
  title.addEventListener("click", () => {
    mainHeader.textContent = show.name;
    updateBreadcrumb(show);
    loadEpisodesForShow(show.id);
  });

  img.addEventListener("click", () => {
    mainHeader.textContent = show.name;
    updateBreadcrumb(show);
    loadEpisodesForShow(show.id);
  });

  const filterShowsWithoutGenres = () => {
    const showsWithoutGenres = cache.shows.filter((show) => !show.genres || show.genres.length === 0);

    displayShows(showsWithoutGenres);
    mainHeader.textContent = "Shows Without Genres";
  };

  const genres = document.createElement("div");
  genres.classList.add("tv-show-genres");
  const tagIcon = document.createElement("li");
  tagIcon.classList.add("sajad-icontag");

  if (!show.genres || show.genres.length === 0) {
    const noGenresSpan = document.createElement("span");
    noGenresSpan.textContent = "No Genres";
    noGenresSpan.classList.add("genre-tag", "no-genres");
    noGenresSpan.style.cursor = "pointer";

    noGenresSpan.addEventListener("click", filterShowsWithoutGenres);

    genres.append(tagIcon, noGenresSpan);
  } else {
    const genreSpans = show.genres.map((genre) => {
      const genreSpan = document.createElement("span");
      genreSpan.textContent = genre;
      genreSpan.classList.add("genre-tag");
      genreSpan.style.cursor = "pointer";

      genreSpan.addEventListener("click", () => {
        const filteredShows = filterShowsByGenre(genre);
        displayShows(filteredShows);
        mainHeader.textContent = `${genre} Shows`;
      });

      return genreSpan;
    });

    // Join genre spans with separator
    genres.append(
      tagIcon,
      ...genreSpans.flatMap((span, index) => (index > 0 ? [document.createTextNode(" | "), span] : [span]))
    );
  }

  const statusContainer = document.createElement("div");
  statusContainer.classList.add("status-container");
  const status = document.createElement("span");
  status.classList.add("tv-show-status");
  status.textContent = `Status: ${show.status}`;
  const statusIcon = document.createElement("li");
  statusIcon.className = "sajad-iconexclamation";
  statusContainer.append(statusIcon, status);

  const ratingContainer = document.createElement("div");
  ratingContainer.classList.add("rating-container");
  const rating = document.createElement("span");
  rating.classList.add("tv-show-rating");
  rating.textContent = `Rating: ${show.rating.average || "N/A"}`;
  const ratingIcon = document.createElement("li");
  ratingIcon.className = "sajad-iconstar-empty";
  ratingContainer.append(ratingIcon, rating);

  const runtimeContainer = document.createElement("div");
  runtimeContainer.classList.add("runtime-container");
  const runtime = document.createElement("span");
  runtime.classList.add("tv-show-runtime");
  runtime.textContent = `Runtime: ${show.runtime} minutes`;
  const runtimeIcon = document.createElement("li");
  runtimeIcon.className = "sajad-iconclock-1";
  runtimeContainer.append(runtimeIcon, runtime);

  const summary = document.createElement("div");
  summary.classList.add("tv-show-summary");
  summary.innerHTML = show.summary || "No summary available.";

  content.append(title, genres, statusContainer, ratingContainer, runtimeContainer, summary);
  card.append(showImgWrapper, content);
  return card;
};

// Show listing view
const showShowsListing = () => {
  mainHeader.textContent = "TV Shows";
  currentShowId = null;

  // Reset UI elements
  searchInput.placeholder = "Search shows...";
  episodeSelector.classList.add("hidden");
  showSelector.classList.remove("hidden");
  searchInput.value = "";

  // Clear breadcrumb
  updateBreadcrumb();

  // Display shows and set up search
  displayShows(cache.shows);
  searchInput.removeEventListener("input", handleSearch);
  searchInput.addEventListener("input", handleShowSearch);
};

// Episode listing view
const showEpisodesListing = () => {
  searchInput.placeholder = "Search episodes...";
  episodeSelector.classList.remove("hidden");
  searchInput.value = "";

  searchInput.removeEventListener("input", handleShowSearch);
  searchInput.addEventListener("input", handleSearch);
};

// Filter episodes based on search term
const filterEpisodes = (searchTerm) => {
  const normalizedSearchTerm = searchTerm.toLowerCase();
  return allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(normalizedSearchTerm) ||
      episode.summary?.toLowerCase().includes(normalizedSearchTerm)
  );
};

// Filter shows based on search term
const filterShows = (shows, searchTerm) => {
  const normalized = searchTerm.toLowerCase();
  return shows.filter(
    (show) =>
      show.name.toLowerCase().includes(normalized) ||
      show.genres.some((genre) => genre.toLowerCase().includes(normalized)) ||
      show.summary?.toLowerCase().includes(normalized)
  );
};

// Display shows
const displayShows = (shows) => {
  showContainer.innerHTML = "";
  cardsContainer.innerHTML = "";

  cardsContainer.style.display = "none";
  showContainer.style.display = "flex";

  const existingCount = document.getElementById("episode-count");
  const existingButton = document.getElementById("back-button");
  if (existingCount) existingCount.remove();
  if (existingButton) existingButton.remove();

  shows.forEach((show) => {
    showContainer.appendChild(createShowCard(show));
  });
};

// Display episodes
const displayEpisodes = (episodes) => {
  showContainer.innerHTML = "";
  cardsContainer.innerHTML = "";
  cardsContainer.style.display = "flex";
  showContainer.style.display = "none";

  episodes.forEach((episode) => {
    cardsContainer.appendChild(createEpisodeCard(episode));
  });

  // const searchWrapper = document.querySelector(".search-wrapper");

  const existingCount = document.getElementById("episode-count");
  const existingButton = document.getElementById("back-button");
  if (existingCount) existingCount.remove();
  if (existingButton) existingButton.remove();

  const countDisplay = document.createElement("div");
  countDisplay.id = "episode-count";
  countDisplay.textContent = `${episodes.length} / ${allEpisodes.length} e`;

  breadcrumbList.appendChild(countDisplay);
};

// Populate episode selector
const populateEpisodeSelector = (episodes) => {
  episodeSelector.innerHTML = '<option value="">Select Episode</option>';

  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });
};

// Populate show selector
const populateShowSelector = (shows) => {
  showSelector.innerHTML = "<option value=''>Select Show</option>";

  const allGenres = [...new Set(shows.flatMap((show) => show.genres))].sort();
  const showsByGenre = new Map();

  allGenres.forEach((genre) => {
    showsByGenre.set(genre, []);
  });

  const sortedShows = [...shows].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  sortedShows.forEach((show) => {
    show.genres.forEach((genre) => {
      showsByGenre.get(genre).push(show);
    });
  });

  allGenres.forEach((genre) => {
    const showsInGenre = showsByGenre.get(genre);
    if (showsInGenre.length > 0) {
      const optgroup = document.createElement("optgroup");
      optgroup.label = genre;

      showsInGenre.forEach((show) => {
        const option = document.createElement("option");
        option.value = show.id;
        option.textContent = show.name;
        optgroup.appendChild(option);
      });

      showSelector.appendChild(optgroup);
    }
  });
};

// Handle episode selection
const handleEpisodeSelection = (event) => {
  const selectedEpisodeId = event.target.value;
  const selectedShow = cache.shows.find((show) => show.id === parseInt(currentShowId));

  if (selectedEpisodeId) {
    const selectedEpisode = allEpisodes.find((episode) => episode.id === parseInt(selectedEpisodeId, 10));
    displayEpisodes(selectedEpisode ? [selectedEpisode] : []);
    updateBreadcrumb(selectedShow, selectedEpisode);
  } else {
    displayEpisodes(allEpisodes);
    updateBreadcrumb(selectedShow);
  }
};

// Handle show selection
const handleShowSelection = (event) => {
  const selectedShowId = event.target.value;
  if (selectedShowId) {
    const selectedShow = cache.shows.find((show) => show.id === parseInt(selectedShowId));
    mainHeader.textContent = selectedShow.name;
    updateBreadcrumb(selectedShow);
    loadEpisodesForShow(selectedShowId);
  } else {
    showShowsListing();
  }
};

// Handle episode search
const handleSearch = (event) => {
  const searchTerm = event.target.value;
  const filteredEpisodes = searchTerm ? filterEpisodes(searchTerm) : allEpisodes;
  displayEpisodes(filteredEpisodes);
};

// Handle show search
const handleShowSearch = (event) => {
  const searchTerm = event.target.value;
  const filteredShows = searchTerm ? filterShows(cache.shows, searchTerm) : cache.shows;
  displayShows(filteredShows);
};

// Load episodes for selected show
const loadEpisodesForShow = async (showId) => {
  if (showId === currentShowId) return;
  currentShowId = showId;

  cardsContainer.innerHTML = "";
  showContainer.style.display = "none";
  cardsContainer.style.display = "grid";

  const loadingMessage = document.createElement("p");
  loadingMessage.id = "loading-message";
  loadingMessage.textContent = "Loading episodes...";
  cardsContainer.appendChild(loadingMessage);

  try {
    if (cache.episodes.has(showId)) {
      allEpisodes = cache.episodes.get(showId);
      const selectedShow = cache.shows.find((show) => show.id === parseInt(showId));
      displayEpisodes(allEpisodes);
      populateEpisodeSelector(allEpisodes);
      showEpisodesListing();
      updateBreadcrumb(selectedShow);
      return;
    }

    const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
    if (!response.ok) throw new Error(`Failed to fetch episodes: ${response.statusText}`);

    const episodes = await response.json();
    cache.episodes.set(showId, episodes);
    allEpisodes = episodes;

    displayEpisodes(episodes);
    populateEpisodeSelector(episodes);
    showEpisodesListing();
  } catch (error) {
    cardsContainer.innerHTML = `<p class="error">Error loading episodes. Please try again.</p>`;
  }
};

// Initialize the app
const init = async () => {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    if (!response.ok) throw new Error(`Failed to fetch shows: ${response.statusText}`);

    cache.shows = await response.json();
    populateShowSelector(cache.shows);
    showShowsListing(); // This will display shows initially

    // Event listeners
    showSelector.addEventListener("change", handleShowSelection);
    episodeSelector.addEventListener("change", handleEpisodeSelection);
    searchInput.addEventListener("input", handleShowSearch);
  } catch (error) {
    showContainer.innerHTML = `<p class="error">Error loading shows. Please try again.</p>`;
  }
};

// Start the app
window.onload = init;
