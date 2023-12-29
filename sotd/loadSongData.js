function convertToArabicNumerals(number) {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(number)
        .split('')
        .map(digit => arabicNumerals[parseInt(digit)])
        .join('');
}

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
    const parts = isoDate.split('-'); // Split the ISO date into parts
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    // Array of month names. Starts at 0, hence 'x'
    const monthNames = {
        'ang': ['x', 'Æfterra Gēola', 'Solmōnað', 'Hrēðmōnað', 'Ēastremōnað', 'Þrimilcemōnað', 'Ærra Līþa', 'Æfterra Līþa', 'Weodmōnað', 'Hāligmōnað', 'Winterfylleþ', 'Blōtmōnað', 'Ærra Gēola'], //Ænglisċ/Old English
        'ar': ['خ', 'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمب'], //اَلْعَرَبِيَّةُ/Arabic
        'br': ['x', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'], //Portuguese do Brasil/Portuguese (br)
        'de': ['x', 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],//Deutsch/German
        'en': ['x', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],//English
        'it': ['x', 'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],//Italiano/Italian
        'nl': ['x', 'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December']//Nederlands/Dutch
        // languages to add
    };

    console.log('Language:', language);
    console.log('Month Index:', month);
    const monthIndex = month; // Not sure why, but the solution to some errors was using a console.log(); function before this. Without it, this code doesnt work ¯\_(ツ)_/¯
    const monthName = monthNames[language][monthIndex];

    // Format the date by language
    let formattedDate;

    switch (language) {
        case 'ang':
            formattedDate = `${monthName} ${convertToRomanNumerals(day)} ${convertToRomanNumerals(year)}`; break;
        case 'ar':
            formattedDate = `${convertToArabicNumerals(day)} ${monthName} ${convertToArabicNumerals(year)}`; break;
        case 'br':
            formattedDate = `${day} de ${monthName} de ${year}`; break;
        case 'de':
            formattedDate = `${day}. ${monthName}, ${year}`; break;
        case 'en':
            formattedDate = `${monthName} ${day}, ${year}`; break;
        case 'it':
            formattedDate = `${day} ${monthName} ${year}`; break;
        case 'nl':
            formattedDate = `${day} ${monthName} ${year}`; break;
    }

    return formattedDate;
}

async function loadSongData(lang) {
    const response = await fetch('../sotd/sotdEntries.json');
    const data = await response.json();

    const songListContainer = document.getElementById('song-list-container');

    data.forEach((song) => {
		var now = new Date().getTime();
		if (song.date <= now) {
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
