function formatDateFromISO(isoDate) {
    const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        timeZone: "UTC" // Fixes an issue with timezone. ALL entries are now exactly the date they are in the JSON
    };
    return new Date(isoDate).toLocaleDateString(undefined, options);
}

async function loadNbDataIndex() {
    try {
        const response = await fetch('../notebook/notebookEntries.json');
        const data = await response.json();

        const entryListContainer = document.getElementById('nb-entry-container');

        data.forEach((entry) => {
            const nbEntry = document.createElement('h4');
            const link = document.createElement('a');
            const formattedDate = formatDateFromISO(entry.date);
            
            link.href = `./notebook/entry#${entry.date}`;
            link.textContent = `${formattedDate} ${entry.time}`;
            
            nbEntry.appendChild(link);
            entryListContainer.appendChild(nbEntry);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadNbDataEntry() {
    try {
        const response = await fetch('../notebook/notebookEntries.json');
        const data = await response.json();

        // Get the date from the URL hash
        const hash = window.location.hash.substring(1); // Remove the leading '#'

        const titleElement = document.getElementById('title');
        const contentElement = document.getElementById('nb-Content');

        // Find the entry with the matching date
        const entry = data.find(entry => entry.date === hash);

        if (entry) {
            titleElement.textContent = `${formatDateFromISO(entry.date)}`;
            contentElement.textContent = entry.content;
        } else {
            titleElement.textContent = 'Date not found';
            contentElement.textContent = 'BLANK';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
