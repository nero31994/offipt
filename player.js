const videoElement = document.getElementById('videoPlayer');

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
function loadChannel(url) {
    const player = initPlayer();
    player.load(url)
        .then(() => {
            console.log('Video loaded successfully');
        })
        .catch(onPlayerError);
}

// Load the first channel as a test
loadChannel(channels[0].url);

// Filter channels based on search query
function filterChannels() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filteredChannels = channels.filter(channel => channel.name.toLowerCase().includes(query));
    renderChannels(filteredChannels);
}

// Render the list of channels
function renderChannels(filteredChannels) {
    const channelList = document.getElementById('channelList');
    channelList.innerHTML = '';
    filteredChannels.forEach(channel => {
        const li = document.createElement('li');
        li.textContent = channel.name;
        li.onclick = () => loadChannel(channel.url);
        channelList.appendChild(li);
    });
}

// Initialize the channel list
renderChannels(channels);
