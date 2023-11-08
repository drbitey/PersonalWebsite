function formatDateFromISO(isoDate) {
    const parts = isoDate.split('-'); // Split the ISO date into parts
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    // Array of month names. Starts at 0, hence 'x'
    const monthNames = [
        'x', 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Format the date as "Month Day, Year"
    const formattedDate = `${monthNames[month]} ${day}, ${year}`;
    return formattedDate;
}

async function loadSongData() {
    const response = await fetch('./sotd/sotdEntries.json');
    const data = await response.json();

    const songListContainer = document.getElementById('song-list-container');

    data.forEach((song) => {
        const songEntry = document.createElement('h4');
        const link = document.createElement('a');
        const formattedDate = formatDateFromISO(song.date);
        link.href = song.spotifyLink;
        link.textContent = `${formattedDate}: ${song.artist} - ${song.song_title}`;
        songEntry.appendChild(link);
        songListContainer.appendChild(songEntry);
    });
}
