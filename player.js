const videoElement = document.getElementById('videoPlayer');
const channelList = document.getElementById('channelList');

function loadChannel(channel) {
  const player = new shaka.Player(videoElement);
  
  if (channel.url.endsWith(".m3u8")) {
    player.load(channel.url); // For HLS
  } else if (channel.url.endsWith(".mpd")) {
    player.load(channel.url); // For DASH
  }

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

function filterChannels() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filteredChannels = channels.filter(channel => channel.name.toLowerCase().includes(query));
  renderChannels(filteredChannels);
}

function renderChannels(filteredChannels) {
  channelList.innerHTML = '';
  filteredChannels.forEach(channel => {
    const li = document.createElement('li');
    li.textContent = channel.name;
    li.onclick = () => loadChannel(channel);
    channelList.appendChild(li);
  });
}

// Initial render
renderChannels(channels);
