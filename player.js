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
