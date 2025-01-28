// Get DOM elements
const videoElement = document.getElementById('video');
const channelBox = document.getElementById('channel-box');
const searchBar = document.getElementById('search-bar');

// Function to load a channel
async function loadChannel(channel) {
  const player = new shaka.Player(videoElement);

  // Configure DRM if required
  if (channel.drm && channel.drm === "clearkey") {
    const [keyId, key] = channel.key.split(':');
    player.configure({
      drm: {
        clearKeys: {
          [keyId]: key,
        },
      },
    });
  }

  try {
    await player.load(channel.src);
    console.log(`${channel.name} loaded successfully`);
  } catch (e) {
    console.error(`Error loading ${channel.name}:`, e);
  }
}

// Function to render channels
function renderChannels(filter = '') {
  // Clear the current channel list
  channelBox.innerHTML = '';

  // Filter and render channels
  channels
    .filter(channel => channel.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(channel => {
      const channelButton = document.createElement('div');
      channelButton.className = 'channel';
      channelButton.textContent = channel.name;
      channelButton.addEventListener('click', () => loadChannel(channel));
      channelBox.appendChild(channelButton);
    });
}

// Event listener for the search bar
searchBar.addEventListener('input', (e) => {
  const filter = e.target.value;
  renderChannels(filter);
});

// Initial rendering of channels
renderChannels();
