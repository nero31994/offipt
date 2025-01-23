const videoElement = document.getElementById('videoPlayer');
const channelList = document.getElementById('channelList');

// Initialize Shaka Player
function initPlayer() {
    const player = new shaka.Player(videoElement);
    player.addEventListener('error', onPlayerError); // Error listener for Shaka Player
    return player;
}

// Handle errors from Shaka Player
function onPlayerError(event) {
    console.error('Shaka Player Error:', event);
    alert('Error loading video. Check the console for details.');
}

// Load the selected channel
function loadChannel(channel) {
    const player = initPlayer();
    if (channel.url.endsWith('.m3u8')) {
        // For HLS streams, Shaka Player requires polyfill
        shaka.polyfill.installAll(); // Ensure HLS polyfill is enabled
        player.load(channel.url)
            .then(() => {
                console.log(`Now playing: ${channel.name}`);
            })
            .catch(onPlayerError);
    } else if (channel.url.endsWith('.mpd')) {
        // For DASH streams
        player.load(channel.url)
            .then(() => {
                console.log(`Now playing: ${channel.name}`);
            })
            .catch(onPlayerError);
    } else {
        console.error("Unsupported stream type:", channel.url);
        alert('Unsupported stream type!');
    }

    // Handle DRM if available
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

// Initialize the channel list
renderChannels(channels);
