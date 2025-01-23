const videoElement = document.getElementById('videoPlayer');
const channelList = document.getElementById('channelList');

// Initialize the Shaka Player
function initPlayer() {
  const player = new shaka.Player(videoElement);

  // Add error handling
  player.addEventListener('error', onPlayerError);

  return player;
}

// Error handling for Shaka Player
function onPlayerError(event) {
  console.error('Shaka Player Error:', event);
  alert('Error loading video, please check the console.');
}

// Load the selected channel
function loadChannel(channel) {
  const player = initPlayer();

  if (channel.url.endsWith(".m3u8")) {
    // For HLS streams
    shaka.polyfill.installAll(); // Ensure HLS polyfill is enabled for HLS streams
    player.load(channel.url).then(() => {
      console.log(`Now playing: ${channel.name}`);
    }).catch(onPlayerError);
  } else if (channel.url.endsWith(".mpd")) {
    // For DASH streams
    player.load(channel.url).then(() => {
      console.log(`Now playing: ${channel.name}`);
    }).catch(onPlayerError);
  } else {
    console.error("Unsupported stream type:", channel.url);
    alert('Unsupported stream type!');
  }

  // Check if DRM is required
  if (channel.drm) {
    const drmConfig = {
      servers: {
        'com.widevine.alpha': 'https://your-widevine-license-server',
        'com.microsoft.playready': 'https://your-playready-license-server'
      }
    };
    player.configure({ drm: drmConfig });
  }
}

// Filter channels based on search query
function filterChannels() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filteredChannels = channels.filter(channel => channel.name.toLowerCase().includes(query));
  renderChannels(filteredChannels);
}

// Render the list of channels
function renderChannels(filteredChannels) {
  channelList.innerHTML = '';
  filteredChannels.forEach(channel => {
    const li = document.createElement('li');
    li.textContent = channel.name;
    li.onclick = () => loadChannel(channel);
    channelList.appendChild(li);
  });
}

// Initial render of all channels
renderChannels(channels);
