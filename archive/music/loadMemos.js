function formatDateFromISO(isoDate) {
    const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        timeZone: "UTC"
    };
    return new Date(isoDate).toLocaleDateString(undefined, options);
}

async function loadMemoDataIndex() {
    try {
        const response = await fetch('./musicList.json');
        const data = await response.json();

        const entryListContainer = document.getElementById('entry-container');

        data.forEach((entry) => {
            const songEntry = document.createElement('div');
            songEntry.classList.add('entry');

            const title = document.createElement('h4');
            const link = document.createElement('a');
            link.textContent = formatDateFromISO(entry.date);
            link.href = "javascript:void(0)";
            link.role = "button";

            link.addEventListener('click', () => togglePlayer(songEntry, entry.archiveFile));

            title.appendChild(link);
            songEntry.appendChild(title);
            entryListContainer.appendChild(songEntry);
        });
    } catch (error) {
        console.error('Error loading memo data:', error);
    }
}

function togglePlayer(entryElement, archiveFile) {
    let playerContainer = entryElement.querySelector('.audio-player-container');

    if (playerContainer) {
        // if it's there, collapse it
        playerContainer.remove();
    } else {
        playerContainer = document.createElement('div');
        playerContainer.classList.add('audio-player-container');

        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = `./music/${archiveFile}`;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.addEventListener('click', () => playerContainer.remove());

        playerContainer.appendChild(audio);
        playerContainer.appendChild(closeButton);

        entryElement.appendChild(playerContainer);
    }
}

document.addEventListener('DOMContentLoaded', loadMemoDataIndex);