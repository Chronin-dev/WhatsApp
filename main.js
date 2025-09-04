// JavaScript for WhatsApp Link Generator

document.addEventListener('DOMContentLoaded', () => {
    const countryDropdown = document.getElementById('countryDropdown');
    const countryDisplay = document.getElementById('countryDisplay');
    const selectedCountryName = document.getElementById('selectedCountryName');
    const selectedFlag = document.getElementById('selected-flag');
    const countryCodePrefix = document.getElementById('countryCodePrefix');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const generateButton = document.getElementById('generateButton');
    const linkPreviewContainer = document.getElementById('linkPreviewContainer');
    const waLink = document.getElementById('waLink');
    const copyButton = document.getElementById('copyButton');
    const messageElement = document.getElementById('message');

    // Fetch country data from a public API
    const fetchCountries = async () => {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd');
            const data = await response.json();
            const countries = data.map(country => ({
                name: country.name.common,
                code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
                flag: `https://flagcdn.com/w20/${country.cca2.toLowerCase()}.png`
            })).sort((a, b) => a.name.localeCompare(b.name));
            return countries;
        } catch (error) {
            console.error('Error fetching country data:', error);
            return [];
        }
    };

    // Populate the dropdown with country options
    const populateDropdown = async () => {
        const countries = await fetchCountries();

        // Set a default country (e.g., Bangladesh)
        const defaultCountry = countries.find(c => c.name === 'Bangladesh');
        if (defaultCountry) {
            selectedCountryName.textContent = defaultCountry.name;
            countryCodePrefix.textContent = defaultCountry.code;
            selectedFlag.src = defaultCountry.flag;
            selectedFlag.alt = `${defaultCountry.name} flag`;
        }

        countries.forEach(country => {
            const div = document.createElement('div');
            div.className = 'dropdown-item p-3 flex items-center cursor-pointer transition-colors duration-200 hover:bg-gray-700';
            div.innerHTML = `
                <img src="${country.flag}" alt="${country.name} flag" class="w-5 h-auto mr-2 rounded-sm">
                <span>${country.name} (${country.code})</span>
            `;
            div.dataset.code = country.code;
            div.dataset.name = country.name;
            div.addEventListener('click', () => {
                selectedCountryName.textContent = country.name;
                countryCodePrefix.textContent = country.code;
                selectedFlag.src = country.flag;
                selectedFlag.alt = `${country.name} flag`;
                countryDropdown.classList.add('hidden');
                updateMessage('Ready to generate link...');
            });
            countryDropdown.appendChild(div);
        });
    };

    // Toggle dropdown visibility
    countryDisplay.addEventListener('click', () => {
        countryDropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!countryDisplay.contains(event.target) && !countryDropdown.contains(event.target)) {
            countryDropdown.classList.add('hidden');
        }
    });

    // Update message function
    const updateMessage = (text, color = 'text-gray-400') => {
        messageElement.textContent = text;
        messageElement.className = `text-center text-sm mt-4 ${color}`;
    };

    // Generate and display the link
    const generateLink = () => {
        const countryCode = countryCodePrefix.textContent.trim().replace('+', '');
        const phoneNumber = phoneNumberInput.value.trim();

        if (phoneNumber.length === 0) {
            updateMessage('Please enter a phone number.', 'text-red-400');
            linkPreviewContainer.classList.add('hidden');
            return;
        }

        const fullPhoneNumber = countryCode + phoneNumber;
        const whatsappUrl = `https://wa.me/${fullPhoneNumber}`;
        waLink.href = whatsappUrl;
        waLink.textContent = whatsappUrl; // Show the full URL
        linkPreviewContainer.classList.remove('hidden');
        updateMessage('Link generated successfully!', 'text-green-400');
    };

    // Event listeners
    generateButton.addEventListener('click', generateLink);
    phoneNumberInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            generateLink();
        }
    });

    copyButton.addEventListener('click', () => {
        const tempInput = document.createElement('input');
        tempInput.value = waLink.href;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        updateMessage('Link copied to clipboard!', 'text-green-400');
    });

    // Initial population of the dropdown
    populateDropdown();
});