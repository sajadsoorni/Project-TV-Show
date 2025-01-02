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
  img.src = episode.image?.medium || 'placeholder.jpg'; // Fallback image if no image is available
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
  description.innerHTML = episode.summary || 'No description available.';

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
  // Convert the search term to lowercase for case-insensitive matching
  searchTerm = searchTerm.toLowerCase();

  // Filter episodes based on name or summary containing the search term
  return allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchTerm) ||
      episode.summary?.toLowerCase().includes(searchTerm)
  );
}

// Function to display episodes
function displayEpisodes(episodes) {
  // Clear the container before displaying new episodes
  cardsContainer.innerHTML = '';

  // Create and append a card for each episode
  episodes.forEach((episode) => createEpisodeCard(episode));

  // Update the count of displayed episodes
  const searchCount = document.querySelector('.search-wrapper');
  const countDisplay =
    document.getElementById('episode-count') || document.createElement('div');
  countDisplay.id = 'episode-count';
  countDisplay.textContent = `${episodes.length} / ${allEpisodes.length} episodes`;
  searchCount.appendChild(countDisplay);
}

// Function to populate the select element with episode options
function populateEpisodeSelector(episodes) {
  // Add a default option to the dropdown
  episodeSelector.innerHTML = '<option value="">Select Episode</option>';

  // Populate the dropdown with episodes
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
  // Get the selected episode ID from the dropdown
  const selectedEpisodeId = event.target.value;

  // Display the selected episode or all episodes if none is selected
  if (selectedEpisodeId) {
    const selectedEpisode = allEpisodes.find(
      (episode) => episode.id === parseInt(selectedEpisodeId, 10)
    );
    displayEpisodes([selectedEpisode]);
  } else {
    displayEpisodes(allEpisodes);
  }
}

// Function to handle search input
function handleSearch(event) {
  // Get the search term from the input field
  const searchTerm = event.target.value;

  // Filter episodes based on the search term and display them
  const filteredEpisodes = searchTerm
    ? filterEpisodes(searchTerm)
    : allEpisodes;
  displayEpisodes(filteredEpisodes);
}

// Function to load all episodes using fetch
async function loadEpisodes() {
  // Display a loading message while fetching data
  const loadingMessage = document.createElement('p');
  loadingMessage.id = 'loading-message';
  loadingMessage.textContent = 'Loading episodes, please wait...';
  cardsContainer.appendChild(loadingMessage);

  try {
    // Fetch data from the API
    const response = await fetch('https://api.tvmaze.com/shows/82/episodes');

    // Check for a successful response
    if (!response.ok) {
      throw new Error(`Failed to fetch episodes: ${response.statusText}`);
    }

    // Parse the JSON data
    allEpisodes = await response.json();

    // Display episodes and populate the dropdown
    displayEpisodes(allEpisodes);
    populateEpisodeSelector(allEpisodes);

    // Add event listeners for search and selection
    searchInput.addEventListener('input', handleSearch);
    episodeSelector.addEventListener('change', handleEpisodeSelection);
  } catch (error) {
    // Display an error message to the user
    cardsContainer.innerHTML = `<p id="error-message">An error occurred while loading episodes. Please try again later.</p>`;
  } finally {
    // Remove the loading message once data is fetched or an error occurs
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
      loadingMessage.remove();
    }
  }
}

// Load the episodes when the page is loaded
window.onload = loadEpisodes;
