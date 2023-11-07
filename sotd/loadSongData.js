// Function to format ISO date to "Month Day, Year" format
function formatISODate(isoDate) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(isoDate).replace(/-/g, '\/').replace(/T.+/, '').toLocaleDateString(undefined, options);
}

// Function to load and display song data
async function loadSongData() {
    const response = await fetch('./sotd/sotdEntries.json');
    const data = await response.json();

    const songListContainer = document.getElementById('song-list-container');

    data.forEach((song) => {
        const songEntry = document.createElement('h4');
        const link = document.createElement('a');
		const formattedDate = formatISODate(song.date);
        link.href = song.spotifyLink;
        link.textContent = `${formattedDate}: ${song.artist} - ${song.song_title}`;
        songEntry.appendChild(link);
        songListContainer.appendChild(songEntry);
    });
}

// Call the function to load and display the song data
loadSongData();
