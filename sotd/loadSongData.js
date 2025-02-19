function formatDateFromISO(isoDate, language) {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC" //JSON consistency
    };

    return new Date(isoDate).toLocaleString(language, options);
}

async function loadSongData(lang) {
    const response = await fetch('../sotd/sotdEntries.json');
    const data = await response.json();

    const songListContainer = document.getElementById('song-list-container');
	
	songListContainer.innerHTML = ""; //clear out container before printing- allows me to test languages :)

    const localDate = new Date().toISOString().split("T")[0]; //fixes the code !!!

    data.forEach((song) => {
        if (song.date <= localDate) { // Display entries up to the user's local date
            const songEntry = document.createElement('h4');
            const link = document.createElement('a');
            const formattedDate = formatDateFromISO(song.date, lang);
            link.href = song.spotifyLink;
            link.textContent = `${formattedDate}: ${song.artist} - ${song.song_title}`;
            songEntry.appendChild(link);
            songListContainer.appendChild(songEntry);
        } else {
            // Skip songs that are "in the future" for the user
        }
    });
}

