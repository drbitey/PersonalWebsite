function convertToRomanNumerals(num) {
  if (num <= 0 || num > 3999) {
    return "Too high";
  }
  const romanNumerals = [
    { value: 1000, numeral: "M" },
    { value: 900, numeral: "CM" },
    { value: 500, numeral: "D" },
    { value: 400, numeral: "CD" },
    { value: 100, numeral: "C" },
    { value: 90, numeral: "XC" },
    { value: 50, numeral: "L" },
    { value: 40, numeral: "XL" },
    { value: 10, numeral: "X" },
    { value: 9, numeral: "IX" },
    { value: 5, numeral: "V" },
    { value: 4, numeral: "IV" },
    { value: 1, numeral: "I" }
  ];
  let result = "";
  for (let i = 0; i < romanNumerals.length; i++) {
    while (num >= romanNumerals[i].value) {
      result += romanNumerals[i].numeral;
      num -= romanNumerals[i].value;
    }
  }
  return result;
}

// Example usage:
console.log(convertToRoman(63)); // Output: LXIII

function formatDateFromISO(isoDate, language) {
	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC" //fixes an issue with timezone. ALL entries are now exactly the date they are in the JSON
	};
    return new Date(isoDate).toLocaleString(language, options);
}


async function loadSongData(lang) {
    const response = await fetch('../sotd/sotdEntries.json');
    const data = await response.json();

    const songListContainer = document.getElementById('song-list-container');

    const localDate = new Date().toLocaleDateString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone } );
    const ISO = new Date(localDate).toISOString().split("T")[0];
	
    data.forEach((song) => {
		if (song.date <= ISO) { //only push entries from local today or before
			const songEntry = document.createElement('h4');
			const link = document.createElement('a');
			const formattedDate = formatDateFromISO(song.date, lang);
			link.href = song.spotifyLink;
			link.textContent = `${formattedDate}: ${song.artist} - ${song.song_title}`;
			songEntry.appendChild(link);
			songListContainer.appendChild(songEntry);
		}
		else{}; //if the date is in the future for client, skip
    });
}
