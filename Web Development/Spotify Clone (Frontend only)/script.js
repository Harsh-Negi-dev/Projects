const audio = document.getElementById('audio');
const trackTitle = document.getElementById('track-title');

const songs = {
    song1: {
        title: 'Song 1',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    song2: {
        title: 'Song 2',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    }
};

function playTrack(trackId) {
    const song = songs[trackId];
    audio.src = song.src;
    audio.play();
    trackTitle.innerText = 'Now Playing: ' + song.title;
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

function pauseTrack() {
    audio.pause();
}