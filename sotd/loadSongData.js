function formatDateFromISO(isoDate, language) {
    const parts = isoDate.split('-'); // Split the ISO date into parts
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    // Array of month names. Starts at 0, hence 'x'
    const monthNames = {
        'en': ['x', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        'de': ['x', 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        // Add more languages as needed
    };

    const monthName = monthNames[language][month];

    // Format the date by language
    let formattedDate;a

    switch (language) {
        case 'en':
            formattedDate = `${monthName} ${day}, ${year}`;
            break;
        case 'de':
            formattedDate = `${day}. ${monthName}, ${year}`;
            break;
    }

    return formattedDate;
}

async function loadSongData(language) {
    const response = await fetch('./sotd/sotdEntries.json');
    const data = await response.json();

    const songListContainer = document.getElementById('song-list-container');

    data.forEach((song) => {
        const songEntry = document.createElement('h4');
        const link = document.createElement('a');
        const formattedDate = formatDateFromISO(song.date, language);
        link.href = song.spotifyLink;
        link.textContent = `${formattedDate}: ${song.artist} - ${song.song_title}`;
        songEntry.appendChild(link);
        songListContainer.appendChild(songEntry);
    });
}

loadSongData();
