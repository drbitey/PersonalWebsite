// Function to load and display song data
async function loadSongData() {
    const response = await fetch('./sotdEntries.json');
    const data = await response.json();

    const songListContainer = document.getElementById('song-list-container');

    data.forEach((song) => {
        const songEntry = document.createElement('h4');
        const link = document.createElement('a');
        link.href = song.spotifyLink;
        link.textContent = `${song.date}: ${song.songName}`;
        songEntry.appendChild(link);
        songListContainer.appendChild(songEntry);
    });
}

// Call the function to load and display the song data
loadSongData();