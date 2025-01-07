// Select DOM elements
const cardsContainer = document.getElementById('cards-container');
const searchInput = document.getElementById('episode-search');
const episodeSelector = document.getElementById('episode-selector');
const showSelector = document.getElementById('show-selector');

// Global state
let allEpisodes = [];
let allShows = [];

// Helper function to format season and episode numbers
const formatEpisodeCode = (season, number) => {
  const seasonCode = String(season).padStart(2, '0');
  const episodeCode = String(number).padStart(2, '0');
  return `S${seasonCode}E${episodeCode}`;
};

// Function to create a card for an episode
const createEpisodeCard = (episode) => {
  const card = document.createElement('div');
  card.classList.add('card');

  const img = document.createElement('img');
  img.src = episode.image?.medium || 'placeholder.jpg'; // Fallback image
  img.alt = episode.name;

  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content');

  const episodeNumber = document.createElement('div');
  episodeNumber.classList.add('episode-number');
  episodeNumber.textContent = formatEpisodeCode(episode.season, episode.number);

  const title = document.createElement('h2');
  title.textContent = episode.name;

  const description = document.createElement('p');
  description.innerHTML = episode.summary || 'No description available.';

  cardContent.append(episodeNumber, title, description);
  card.append(img, cardContent);

  return card;
};

// Function to filter episodes based on search term
const filterEpisodes = (searchTerm) => {
  const normalizedSearchTerm = searchTerm.toLowerCase();
  return allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(normalizedSearchTerm) ||
      episode.summary?.toLowerCase().includes(normalizedSearchTerm)
  );
};

// Function to display episodes
const displayEpisodes = (episodes) => {
  cardsContainer.innerHTML = ''; // Clear the container

  episodes.forEach((episode) => {
    const card = createEpisodeCard(episode);
    cardsContainer.appendChild(card);
  });

  // Update episode count display
  const searchCount = document.querySelector('.search-wrapper');
  const countDisplay =
    document.getElementById('episode-count') || document.createElement('div');
  countDisplay.id = 'episode-count';
  countDisplay.textContent = `${episodes.length} / ${allEpisodes.length} episodes`;
  searchCount.appendChild(countDisplay);
};

// Function to populate the episode selector dropdown
const populateEpisodeSelector = (episodes) => {
  episodeSelector.innerHTML = '<option value="">Select Episode</option>';

  episodes.forEach((episode) => {
    const option = document.createElement('option');
    option.value = episode.id;
    option.textContent = `${formatEpisodeCode(
      episode.season,
      episode.number
    )} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });
};

// Function to handle episode selection from the dropdown
const handleEpisodeSelection = (event) => {
  const selectedEpisodeId = event.target.value;

  if (selectedEpisodeId) {
    const selectedEpisode = allEpisodes.find(
      (episode) => episode.id === parseInt(selectedEpisodeId, 10)
    );
    displayEpisodes(selectedEpisode ? [selectedEpisode] : []);
  } else {
    displayEpisodes(allEpisodes);
  }
};

// Function to handle search input
const handleSearch = (event) => {
  const searchTerm = event.target.value;
  const filteredEpisodes = searchTerm
    ? filterEpisodes(searchTerm)
    : allEpisodes;
  displayEpisodes(filteredEpisodes);
};

// Function to load episodes for a specific show
const loadEpisodes = async (showId) => {
  const loadingMessage = document.createElement('p');
  loadingMessage.id = 'loading-message';
  loadingMessage.textContent = 'Loading episodes, please wait...';
  cardsContainer.appendChild(loadingMessage);

  try {
    const response = await fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`
    );
    if (!response.ok)
      throw new Error(`Failed to fetch episodes: ${response.statusText}`);

    allEpisodes = await response.json();
    displayEpisodes(allEpisodes);
    populateEpisodeSelector(allEpisodes);

    // Add event listeners
    searchInput.addEventListener('input', handleSearch);
    episodeSelector.addEventListener('change', handleEpisodeSelection);
  } catch (error) {
    cardsContainer.innerHTML = `<p id="error-message">An error occurred while loading episodes. Please try again later.</p>`;
  } finally {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) loadingMessage.remove();
  }
};

// Function to load all shows
const loadShows = async () => {
  if (allShows.length > 0) {
    populateShowSelector(allShows);
    return;
  }

  const loadingMessage = document.createElement('p');
  loadingMessage.id = 'loading-message';
  loadingMessage.textContent = 'Loading shows, please wait...';
  cardsContainer.appendChild(loadingMessage);

  try {
    const response = await fetch('https://api.tvmaze.com/shows');
    if (!response.ok)
      throw new Error(`Failed to fetch shows: ${response.statusText}`);

    allShows = await response.json();
    populateShowSelector(allShows);
  } catch (error) {
    cardsContainer.innerHTML = `<p id="error-message">An error occurred while loading shows. Please try again later.</p>`;
  } finally {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) loadingMessage.remove();
  }
};

// Function to populate the show selector dropdown
const populateShowSelector = (shows) => {
  shows.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
  showSelector.innerHTML = "<option value=''>Select Show</option>";

  shows.forEach((show) => {
    const option = document.createElement('option');
    option.value = show.id;
    option.textContent = show.name;
    showSelector.appendChild(option);
  });
};

// Function to handle show selection
const handleShowSelection = (event) => {
  const selectedShowId = event.target.value;

  if (selectedShowId) {
    loadEpisodes(selectedShowId);
  } else {
    cardsContainer.innerHTML = '';
    episodeSelector.innerHTML = "<option value=''>Select Episode</option>";
  }
};

// Initialize the app
window.onload = () => {
  loadShows();
  showSelector.addEventListener('change', handleShowSelection);
};
