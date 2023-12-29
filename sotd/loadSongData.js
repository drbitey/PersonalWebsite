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
 // OBSOLETE! Only kept for possible expansion. 
    //const parts = isoDate.split('-'); // Split the ISO date into parts
    //const year = parts[0];
    //const month = parseInt(parts[1], 10);
    //const day = parseInt(parts[2], 10);
    //const monthNames = {'ang': ['x', 'Æfterra Gēola', 'Solmōnað', 'Hrēðmōnað', 'Ēastremōnað', 'Þrimilcemōnað', 'Ærra Līþa', 'Æfterra Līþa', 'Weodmōnað', 'Hāligmōnað', 'Winterfylleþ', 'Blōtmōnað', 'Ærra Gēola']};
    //const monthIndex = month; // Not sure why, but the solution to some errors was using a console.log(); function before this. Without it, this code doesnt work ¯\_(ツ)_/¯
    //const monthName = monthNames[language][monthIndex];
    //switch (language) {case 'ang':formattedDate = `${monthName} ${convertToRomanNumerals(day)} ${convertToRomanNumerals(year)}`; break;}

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

    data.forEach((song) => {
		const localDate = new Date().toLocaleDateString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone } );
		const ISO = new Date(localDate).toISOString().split("T")[0];
		if (song.date <= ISO) {
			const songEntry = document.createElement('h4');
			const link = document.createElement('a');
			const formattedDate = formatDateFromISO(song.date, lang);
			link.href = song.spotifyLink;
			link.textContent = `${formattedDate}: ${song.artist} - ${song.song_title}`;
			songEntry.appendChild(link);
			songListContainer.appendChild(songEntry);
		}
		else{};
    });
}
