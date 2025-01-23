document.addEventListener("DOMContentLoaded", () => {
    const videoElement = document.getElementById("video");
    const channelList = document.getElementById("channel-list");
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("sidebarToggle");
    const player = new shaka.Player(videoElement);

    let currentChannelIndex = 0;
    let channelsLoaded = false;

    // Function to load a selected channel and enter fullscreen mode
    async function loadChannel(channel) {
        try {
            if (channel.drm) {
                player.configure({
                    drm: {
                        clearKeys: {
                            [channel.drm.kid]: channel.drm.key
                        }
                    }
                });
            } else {
                player.configure({ drm: {} });
            }

            await player.load(channel.url);
            console.log(`Now playing: ${channel.name}`);

            // Autoplay the video
            videoElement.play();

            // Enter fullscreen mode after channel selection
            if (videoElement.requestFullscreen) {
                videoElement.requestFullscreen();
            } else if (videoElement.webkitRequestFullscreen) {
                videoElement.webkitRequestFullscreen(); // For Safari
            } else if (videoElement.msRequestFullscreen) {
                videoElement.msRequestFullscreen(); // For Internet Explorer/Edge
            }
        } catch (error) {
            console.error(`Error loading channel: ${channel.name}`, error);
        }
    }

    // Function to generate channel buttons dynamically
    function createChannelButtons() {
        channels.forEach((channel, index) => {
            const button = document.createElement("button");
            button.textContent = channel.name;
            button.setAttribute("tabindex", "0");
            button.addEventListener("click", () => {
                loadChannel(channel);
                highlightChannel(index);
            });
            channelList.appendChild(button);
        });
        channelsLoaded = true;
        highlightChannel(0); // Highlight the first channel initially
    }

    // Function to highlight the selected channel button
    function highlightChannel(index) {
        const buttons = channelList.querySelectorAll("button");
        buttons.forEach((btn, i) => {
            btn.style.background = i === index ? "#00d4ff" : "linear-gradient(90deg, #007bff, #0056b3)";
            btn.style.color = i === index ? "#121212" : "#ffffff";
            btn.style.transform = i === index ? "translateX(10px)" : "translateX(0)";
            if (i === index) btn.focus();
        });
        currentChannelIndex = index;
    }

    // Handle keyboard navigation
    document.addEventListener("keydown", (event) => {
        const buttons = channelList.querySelectorAll("button");

        switch (event.key) {
            case "ArrowUp":
                if (currentChannelIndex > 0) highlightChannel(currentChannelIndex - 1);
                break;

            case "ArrowDown":
                if (currentChannelIndex < buttons.length - 1) highlightChannel(currentChannelIndex + 1);
                break;

            case "Enter":
                buttons[currentChannelIndex].click();
                break;

            case "ArrowLeft":
                sidebar.classList.remove("hidden");
                break;

            case "ArrowRight":
                sidebar.classList.add("hidden");
                break;

            case " ":
                videoElement.paused ? videoElement.play() : videoElement.pause();
                break;

            case "Escape":
                sidebar.classList.add("hidden");
                break;
        }
    });

    // Sidebar toggle functionality
    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("hidden");
        if (!sidebar.classList.contains("hidden")) {
            channelList.querySelector("button").focus();
        }
    });

    // Initialize player and channels
    function initializePlayer() {
        if (!channelsLoaded) {
            createChannelButtons();
            loadChannel(channels[0]); // Auto-load the first channel
        }
    }

    initializePlayer();
});
