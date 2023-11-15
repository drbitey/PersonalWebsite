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