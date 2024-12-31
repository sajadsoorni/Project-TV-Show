// Select the container where the cards will be inserted
const cardsContainer = document.getElementById('cards-container');

const searchBox = document.getElementById("search-box");
const searchCount = document.getElementById("search-counter");
const episodeSelect = document.getElementById("episode-selector");

// Function to create a card for each episode
function createEpisodeCard(episode) {
  // Format season and episode number with zero-padding
  const seasonCode = String(episode.season).padStart(2, '0');
  const episodeCode = String(episode.number).padStart(2, '0');

  // Create the card container
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute("data-episode-id", `${seasonCode}${episodeCode}`); // Add data attribute

  // Create the image element
  const img = document.createElement('img');
  img.src = episode.image.medium;
  img.alt = episode.name;

  // Create the content container
  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content');

  // Create the episode number (S01E02) container
  const episodeNumber = document.createElement('div');
  episodeNumber.classList.add('episode-number');
  episodeNumber.textContent = `S${seasonCode}E${episodeCode}`;

  // Create the title (h2) element for episode name
  const title = document.createElement('h2');
  title.textContent = episode.name;

  // Create the description (p) element
  const description = document.createElement('p');
  description.innerHTML = episode.summary;

  // Append episode number and title to the card content
  cardContent.appendChild(episodeNumber);
  cardContent.appendChild(title);
  cardContent.appendChild(description);

  // Append the image and card content to the card
  card.appendChild(img);
  card.appendChild(cardContent);

  // Append the card to the container
  cardsContainer.appendChild(card);
}

// ***Function to filter episodes based on search term***
function filterEpisodes(searchTerm) {
  const episodes = getAllEpisodes();
  const lowerCaseSearchTerm = searchTerm.toLowerCase();  // ***to make case in-sensitive***

  const filteredEpisodes = episodes.filter((episode) => {
    const nameMatch = episode.name.toLowerCase().includes(lowerCaseSearchTerm);
    const summaryMatch = episode.summary ? episode.summary.toLowerCase().includes(lowerCaseSearchTerm) : false;
    return nameMatch || summaryMatch;
  });

// ***Clear previous cards***
  cardsContainer.innerHTML = "";
// ***Create new card(s) according to filtered episodes***
  filteredEpisodes.forEach(createEpisodeCard);

  // ***If the search term is empty, hide the search count or reset it***
  // if (searchTerm === "") {
  //   searchCount.style.display = "none";
  // } else {
  //   searchCount.style.display = "block";
  // }
  searchCount.textContent = `Displaying ${filteredEpisodes.length} / ${episodes.length} episodes.`;
}

// ***Event listener for input in the search box***
searchBox.addEventListener("input", (event) => {
  filterEpisodes(event.target.value);
});

// Function to load all episodes and display them
function loadEpisodes() {
  // Get all episodes from the episodes.js
  const episodes = getAllEpisodes();

  // Iterate over the episodes and create a card for each
  episodes.forEach((episode) => {
    createEpisodeCard(episode);
  });

  searchCount.textContent = `Displaying ${episodes.length} / ${episodes.length} episodes.`

  populateEpisodeDropdown(episodes);
}

// Function to create episode dropdown
function populateEpisodeDropdown(episodes) {
  episodeSelect.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.textContent = "All Episodes";
  defaultOption.value = "";
  episodeSelect.appendChild(defaultOption);

  episodes.forEach((episode) => {
    const seasonCode = String(episode.season).padStart(2, "0");
    const episodeCode = String(episode.number).padStart(2, "0");
    const option = document.createElement("option");
    option.value = `${seasonCode}${episodeCode}`;
    option.textContent = `S${seasonCode}E${episodeCode} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });
}

// Event listener for episode selection
episodeSelect.addEventListener("change", (event) => {
  const selectedValue = event.target.value;

  const allCards = cardsContainer.querySelectorAll(".card");
  allCards.forEach(card => card.style.display = "none");
  
  if (selectedValue === "") {
    allCards.forEach(card => card.style.display = "block");
  } else {
    const selectedCard = cardsContainer.querySelector(`.card[data-episode-id="${selectedValue}"]`);
    if (selectedCard) {
      selectedCard.style.display = "block";
    }
  }
});

// Load the episodes when the page is loaded
window.onload = loadEpisodes;
