// Initialize Shaka Player with ClearKey DRM
function initializePlayer() {
  if (shaka.Player.isBrowserSupported()) {
    const videoElement = document.getElementById('shaka-video');
    const player = new shaka.Player(videoElement);

    window.player = player;
    loadChannel(channels[0]);  // Load the first channel by default

    player.addEventListener('error', onErrorEvent);
  } else {
    console.error('Browser not supported!');
  }
}

// Load channels into the sidebar
function loadChannels() {
  const channelList = document.getElementById('channel-list');
  channels.forEach((channel, index) => {
    const li = document.createElement('li');
    li.textContent = channel.name;
    li.onclick = () => {
      document.querySelectorAll('#channel-list li').forEach(item => item.classList.remove('active'));
      li.classList.add('active');
      loadChannel(channel);
    };
    channelList.appendChild(li);
  });
}

// Load selected channel with ClearKey DRM
function loadChannel(channel) {
  const player = window.player;
  player.configure({
    drm: {
      clearKeys: {
        [channel.keyId]: channel.key
      }
    }
  });

  player.load(channel.stream).then(() => {
    console.log(`Playing ${channel.name}`);
  }).catch(onErrorEvent);
}

// Handle errors
function onErrorEvent(event) {
  console.error('Error code', event.detail.code, 'object', event.detail);
}

// Search functionality
document.getElementById('search').addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();
  const channelList = document.getElementById('channel-list');
  channelList.innerHTML = '';
  
  channels.filter(channel => channel.name.toLowerCase().includes(searchTerm))
          .forEach(filteredChannel => {
            const li = document.createElement('li');
            li.textContent = filteredChannel.name;
            li.onclick = () => loadChannel(filteredChannel);
            channelList.appendChild(li);
          });
});

// Initialize on page load
window.onload = () => {
  initializePlayer();
  loadChannels();
};
