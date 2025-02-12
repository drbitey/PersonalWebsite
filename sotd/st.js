function formatDateInSesotho(isoDate) {
    const monthsInSesotho = [
        "0", "Pherekgong", "Hlakola", "Hlakubele", "Mmesa", "Motsheanong", "Phupjane", "Phupu", "Phato", "Loetse", "Mphalane", "Pudungwana", "Tshitwe"
    ];
    
    const date = new Date(isoDate);
    const day = date.getUTCDate();
    const month = monthsInSesotho[date.getUTCMonth() + 1]; // array is 0-indexed
    const year = date.getUTCFullYear();

    return `${day} ${month} ${year}`;
}

async function loadSongDataST() {
    const response = await fetch('../sotd/sotdEntries.json');
    const data = await response.json();

    const songListContainer = document.getElementById('song-list-container');

    // Clear out the song list container
    songListContainer.innerHTML = "";

    const localDate = new Date().toISOString().split("T")[0];

    data.forEach((song) => {
        if (song.date <= localDate) { // Display entries up to the user's local date
            const songEntry = document.createElement('h4');
				const link = document.createElement('a');

            const formattedDate = formatDateInSesotho(song.date); // Format date specifically for Sesotho

            link.href = song.spotifyLink;
            link.textContent = `${formattedDate}: ${song.artist} - ${song.song_title}`;
            songEntry.appendChild(link);
            songListContainer.appendChild(songEntry);
        } else {
            // Skip songs that are "in the future" for the user
        }
    });
}
