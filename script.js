// Select the container where the cards will be inserted
const cardsContainer = document.getElementById('cards-container');
const searchInput = document.getElementById('episode-search');
const episodeSelector = document.getElementById('episode-selector');
let allEpisodes = [];

// Function to create a card for each episode
function createEpisodeCard(episode) {
  // Format season and episode number with zero-padding
  const seasonCode = String(episode.season).padStart(2, '0');
  const episodeCode = String(episode.number).padStart(2, '0');

  // Create the card container
  const card = document.createElement('div');
  card.classList.add('card');

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

// Function to filter episodes based on search term
function filterEpisodes(searchTerm) {
  searchTerm = searchTerm.toLowerCase();

  return allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchTerm) ||
      episode.summary.toLowerCase().includes(searchTerm)
  );
}

// Function to display episodes
function displayEpisodes(episodes) {
  cardsContainer.innerHTML = '';
  episodes.forEach((episode) => createEpisodeCard(episode));

  // Update search count
  const searchCount = document.querySelector('.search-wrapper');
  const countDisplay =
    document.getElementById('episode-count') || document.createElement('div');
  countDisplay.id = 'episode-count';
  countDisplay.textContent = `${episodes.length} / ${allEpisodes.length} episodes`;
  searchCount.appendChild(countDisplay);
}

// Function to populate the select element with episode options
function populateEpisodeSelector(episodes) {
  episodeSelector.innerHTML = '<option value="">Select Episode</option>'; // Default option

  episodes.forEach((episode) => {
    const seasonCode = String(episode.season).padStart(2, '0');
    const episodeCode = String(episode.number).padStart(2, '0');
    const option = document.createElement('option');
    option.value = episode.id; // Use episode ID as the value
    option.textContent = `S${seasonCode}E${episodeCode} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });
}

// Function to handle episode selection
function handleEpisodeSelection(event) {
  const selectedEpisodeId = event.target.value;
  if (selectedEpisodeId) {
    const selectedEpisode = allEpisodes.find(
      (episode) => episode.id === parseInt(selectedEpisodeId, 10)
    );
    displayEpisodes([selectedEpisode]); // Display only the selected episode
  } else {
    displayEpisodes(allEpisodes); // Display all episodes if no selection
  }
}

// Function to handle search input
function handleSearch(event) {
  const searchTerm = event.target.value;
  const filteredEpisodes = searchTerm
    ? filterEpisodes(searchTerm)
    : allEpisodes;
  displayEpisodes(filteredEpisodes);
}

// Function to load all episodes and display them
function loadEpisodes() {
  // Get all episodes from the episodes.js
  allEpisodes = getAllEpisodes();
  displayEpisodes(allEpisodes);

  // Populate the select element
  populateEpisodeSelector(allEpisodes);

  // Add search and select event listeners
  searchInput.addEventListener('input', handleSearch);
  episodeSelector.addEventListener('change', handleEpisodeSelection);
}

// Load the episodes when the page is loaded
window.onload = loadEpisodes;
