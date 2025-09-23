
// Video URLs mapping
const videoUrls = {
'lighting-guide': 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Replace with actual video URLs
};

// Weather API configuration
const WEATHER_CONFIG = {
// Replace with your actual OpenWeatherMap API key
apiKey: 'YOUR_OPENWEATHERMAP_API_KEY',
// Replace with actual sauna location coordinates
lat: 59.9139, // Oslo coordinates
lon: 10.7522,
lang: 'no',
units: 'metric'
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
initializeVideoModal();
loadWeatherData();
});

// Video modal functionality
function initializeVideoModal() {
const modal = document.getElementById('video-modal');
const videoTriggers = document.querySelectorAll('.video-trigger');
const closeBtn = document.querySelector('.modal-close');
const iframe = document.getElementById('instruction-video');

// Add click handlers to video triggers
videoTriggers.forEach(trigger => {
trigger.addEventListener('click', function() {
const videoKey = this.getAttribute('data-video');
const videoUrl = videoUrls[videoKey];

if (videoUrl) {
iframe.src = videoUrl;
modal.style.display = 'block';
document.body.style.overflow = 'hidden';
} else {
console.warn('Video URL not found for key:', videoKey);
showVideoError();
}
});
});

// Close modal functionality
function closeModal() {
modal.style.display = 'none';
iframe.src = '';
document.body.style.overflow = 'auto';
}

closeBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
modal.addEventListener('click', function(e) {
if (e.target === modal) {
closeModal();
}
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
if (e.key === 'Escape' && modal.style.display === 'block') {
closeModal();
}
});
}

// Weather API integration
async function loadWeatherData() {
const weatherWidget = document.getElementById('weather-widget');

try {
// Check if API key is configured
if (WEATHER_CONFIG.apiKey === 'YOUR_OPENWEATHERMAP_API_KEY') {
showWeatherFallback();
return;
}

const response = await fetch(
`https://api.openweathermap.org/data/2.5/weather?lat=${WEATHER_CONFIG.lat}&lon=${WEATHER_CONFIG.lon}&appid=${WEATHER_CONFIG.apiKey}&units=${WEATHER_CONFIG.units}&lang=${WEATHER_CONFIG.lang}`
);

if (!response.ok) {
throw new Error(`HTTP error! status: ${response.status}`);
}

const data = await response.json();
displayWeatherData(data);

} catch (error) {
console.error('Weather API error:', error);
showWeatherError();
}
}

function displayWeatherData(data) {
const weatherWidget = document.getElementById('weather-widget');

const weatherHTML = `
<div class="weather-info">
<div class="weather-main">
<div class="weather-temp">${Math.round(data.main.temp)}°C</div>
<div class="weather-desc">${data.weather[0].description}</div>
</div>
<div class="weather-details">
<div class="weather-detail">
<div class="weather-detail-label">Føles som</div>
<div class="weather-detail-value">${Math.round(data.main.feels_like)}°C</div>
</div>
<div class="weather-detail">
<div class="weather-detail-label">Luftfuktighet</div>
<div class="weather-detail-value">${data.main.humidity}%</div>
</div>
<div class="weather-detail">
<div class="weather-detail-label">Vind</div>
<div class="weather-detail-value">${Math.round(data.wind?.speed || 0)} m/s</div>
</div>
<div class="weather-detail">
<div class="weather-detail-label">Sikt</div>
<div class="weather-detail-value">${data.visibility ? Math.round(data.visibility / 1000) + ' km' : 'N/A'}</div>
</div>
</div>
</div>
`;

weatherWidget.innerHTML = weatherHTML;
}

function showWeatherError() {
const weatherWidget = document.getElementById('weather-widget');
weatherWidget.innerHTML = `
<div class="weather-error">
<p>⚠️ Kunne ikke laste værdata</p>
<p>Sjekk internettforbindelsen eller prøv igjen senere</p>
</div>
`;
}

function showWeatherFallback() {
const weatherWidget = document.getElementById('weather-widget');
weatherWidget.innerHTML = `
<div class="weather-info">
<div class="weather-main">
<div class="weather-temp">-2°C</div>
<div class="weather-desc">delvis skyet</div>
</div>
<div class="weather-details">
<div class="weather-detail">
<div class="weather-detail-label">Føles som</div>
<div class="weather-detail-value">-5°C</div>
</div>
<div class="weather-detail">
<div class="weather-detail-label">Luftfuktighet</div>
<div class="weather-detail-value">75%</div>
</div>
<div class="weather-detail">
<div class="weather-detail-label">Vind</div>
<div class="weather-detail-value">3 m/s</div>
</div>
<div class="weather-detail">
<div class="weather-detail-label">Sikt</div>
<div class="weather-detail-value">10 km</div>
</div>
</div>
<p style="text-align: center; opacity: 0.7; font-size: 0.9rem; margin-top: 10px;">
Demo data - Konfigurer API-nøkkel for live værdata
</p>
</div>
`;
}

function showVideoError() {
alert('Video er ikke tilgjengelig for øyeblikket. Prøv igjen senere.');
}

// Utility function to handle API key configuration
function setWeatherApiKey(apiKey) {
WEATHER_CONFIG.apiKey = apiKey;
loadWeatherData();
}

// Export for potential external use
window.SaunaInstructions = {
setWeatherApiKey,
loadWeatherData
};
