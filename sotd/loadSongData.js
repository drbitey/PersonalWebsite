function convertToArabicNumerals(number) {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(number)
        .split('')
        .map(digit => arabicNumerals[parseInt(digit)])
        .join('');
}

function formatDateFromISO(isoDate, language) {
    const parts = isoDate.split('-'); // Split the ISO date into parts
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    // Array of month names. Starts at 0, hence 'x'
    const monthNames = {
        'ar': ['خ', 'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمب'],
        'br': ['x', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        'de': ['x', 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        'en': ['x', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        // languages to add: arabic, french, dutch?
    };

    console.log('Language:', language);
    console.log('Month Index:', month);
    const monthIndex = month; // Not sure why, but the solution to some errors was using a console.log(); function before this. Without it, this code doesnt work ¯\_(ツ)_/¯
    const monthName = monthNames[language][monthIndex];

    // Format the date by language
    let formattedDate;

    switch (language) {
        case 'ar':
            formattedDate = `${convertToArabicNumerals(day)} ${monthName} ${convertToArabicNumerals(year)}`;
            break;
        case 'br':
            formattedDate = `${day} de ${monthName} de ${year}`;
            break;
        case 'de':
            formattedDate = `${day}. ${monthName}, ${year}`;
            break;
        case 'en':
            formattedDate = `${monthName} ${day}, ${year}`;
            break;
    }

    return formattedDate;
}

async function loadSongData(lang) {
    const response = await fetch('../sotd/sotdEntries.json');
    const data = await response.json();

    const songListContainer = document.getElementById('song-list-container');

    data.forEach((song) => {
        const songEntry = document.createElement('h4');
        const link = document.createElement('a');
        const formattedDate = formatDateFromISO(song.date, lang);
        link.href = song.spotifyLink;
        link.textContent = `${formattedDate}: ${song.artist} - ${song.song_title}`;
        songEntry.appendChild(link);
        songListContainer.appendChild(songEntry);
    });
}
