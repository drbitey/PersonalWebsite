const languages = [
	{ iso: 'af', name: 'Afrikaans' },
	{ iso: 'de', name: 'Deutsch' },
	{ iso: 'en', name: 'English' },
	{ iso: 'it', name: 'Italiano' },
	{ iso: 'st', name: 'Sesotho' },
	{ iso: 'tn-BW', name: 'Setswana' }
] // Currently a little redundant. localizations.json does exist and I do use it but it seems a little inefficient. This stores languages for use in the dropdown.

function getCurrentLanguage() {
	const path = window.location.pathname;
	const parts = path.split('/');
	const languageCode = parts[parts.length - 1];
	if (languageCode === 'sotd') {
		languageCode = 'en';
	}
	return languageCode || 'en';
}

function prepDropdown() {
	const select = document.getElementById('language-select');
	currentLanguage = getCurrentLanguage();
	for (let i = 0; i < languages.length; i++) {
		const option = document.createElement('option');
		option.value = languages[i].iso;
		option.textContent = languages[i].name;
		if (languages[i].iso === currentLanguage) {
			option.selected = true;
		}
		select.appendChild(option);
	}
}

function toggleLanguageDropdown() {
	const dropdown = document.getElementById('language-dropdown');
	dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

function changeLanguage() {
	const select = document.getElementById('language-select');
	const selectedLanguage = select.value;

	// Redirect to the language-specific page
	window.location.href = `https://mvoltz.com/sotd/${selectedLanguage}`;
}
