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

// Function to perform the search
async function performSearch(query) {
    query = query.toLowerCase(); // Convert the query to lowercase for case-insensitive search
	const response = await fetch('./sotd/sotdEntries.json');
	const data = await response.json();

    // If the search query is empty, return all entries
    if (!query) {
        return data;
    }

    const searchResults = [];

    // Loop through your JSON data and check if any attribute contains the query
    data.forEach((entry) => {
        const attributesToSearch = [entry.artist, entry.song_title, entry.date];
        for (const attribute of attributesToSearch) {
            if (attribute.toLowerCase().includes(query)) {
                searchResults.push(entry);
                break; // Stop searching this entry after a match is found
            }
        }
    });

    return searchResults;
}

// Function to update the search results on the page
function updateSearchResults(results) {
    const searchResultsContainer = document.getElementById('song-list-container');
    searchResultsContainer.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        searchResultsContainer.textContent = 'No results found.';
    } else {
        results.forEach((entry) => {
			const songEntry = document.createElement('h4');
			const link = document.createElement('a');
			const formattedDate = formatDateFromISO(entry.date);
			link.href = entry.spotifyLink;
			link.textContent = `${formattedDate}: ${entry.artist} - ${entry.song_title}`;
			songEntry.appendChild(link);
			songListContainer.appendChild(songEntry);
        });
    }
}

// Event listener for the search button
document.addEventListener('DOMContentLoaded', function() {
	const searchButton = document.getElementById('searchButton');
	searchButton.addEventListener('click', () => {
		const searchInput = document.getElementById('searchInput');
		const query = searchInput.value.trim(); // Get the search query and trim leading/trailing spaces
		const results = performSearch(query);
		updateSearchResults(results);
	});
});
