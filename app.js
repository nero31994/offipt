// Get DOM elements
const videoElement = document.getElementById('video');
const channelList = document.getElementById('channel-list');

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

// Render the channel list
channels.forEach((channel) => {
  const channelButton = document.createElement('div');
  channelButton.className = 'channel';
  channelButton.textContent = channel.name;
  channelButton.addEventListener('click', () => loadChannel(channel));
  channelList.appendChild(channelButton);
});

// Load the first channel by default
loadChannel(channels[0]); 
