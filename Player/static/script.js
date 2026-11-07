document.addEventListener('DOMContentLoaded', () => {

    // Initialize MediaElement.js
    const mediaElements = $('audio.fc-media');

    const players = [];
    let currentPlayingIndex = null;

    if (mediaElements.length) {

        mediaElements.each(function (index, elem) {

            const player = new MediaElementPlayer(elem, {
                audioHeight: 40,
                features: [
                    'playpause',
                    'current',
                    'duration',
                    'progress',
                    'volume'
                ],
                alwaysShowControls: true,
                iPadUseNativeControls: true,
                iPhoneUseNativeControls: true,
                AndroidUseNativeControls: true
            });

            players.push(player);

            // Automatically play next song when current song ends
            player.media.addEventListener('ended', () => {

                if (currentPlayingIndex === index) {
                    nextSong();
                }

            });

        });
    }

    // Update button and card appearance
    function updateUI(activeIndex) {

        players.forEach((player, index) => {

            const card = document.querySelector(
                `[data-song-index="${index}"]`
            );

            const playBtn = document.getElementById(
                `play-btn-${index}`
            );

            if (card) {
                card.classList.toggle(
                    'ring-2',
                    index === activeIndex
                );

                card.classList.toggle(
                    'ring-amber-400',
                    index === activeIndex
                );
            }

            if (playBtn) {
                playBtn.innerHTML =
                    index === activeIndex ? '⏸ Pause' : '▶ Play';
            }

        });
    }

    // Play a particular song
    function playSong(index) {

        if (index < 0 || index >= players.length) return;

        // Pause all other songs
        players.forEach((player, i) => {

            if (i !== index) {
                player.media.pause();
                player.media.currentTime = 0;
            }

        });

        currentPlayingIndex = index;

        updateUI(index);

        const currentPlayer = players[index];

        currentPlayer.media.play().catch(error => {

            console.error('Unable to play song:', error);

            currentPlayingIndex = null;
            updateUI(null);

        });
    }

    // Play / Pause button
    window.togglePlayPause = function (index) {

        if (!players[index]) return;

        const media = players[index].media;

        if (currentPlayingIndex === index && !media.paused) {

            media.pause();

            currentPlayingIndex = null;

            updateUI(null);

        } else {

            playSong(index);

        }
    };

    // Next song
    window.nextSong = function () {

        if (players.length === 0) return;

        const nextIndex = currentPlayingIndex === null
            ? 0
            : (currentPlayingIndex + 1) % players.length;

        playSong(nextIndex);
    };

    // Previous song
    window.prevSong = function () {

        if (players.length === 0) return;

        const prevIndex = currentPlayingIndex === null
            ? players.length - 1
            : (currentPlayingIndex - 1 + players.length) % players.length;

        playSong(prevIndex);
    };

    console.log(
        `DHUN Music Player initialized: ${players.length} songs loaded.`
    );

});