const apiKey = 'JSRMN2XTEYUFNJ594NN94PEE3'; // API key
const baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
const weatherDisplay = document.getElementById('weather-display');
const errorDisplay = document.getElementById('error-display'); // Ensure you have this element in HTML

document.getElementById('search-input').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') { // Using 'key' instead of 'keyCode'
    event.preventDefault(); // Prevent the default action of the Enter key
    const city = this.value.trim();
    if (city === '') {
      showError('Empty City Not Allowed.');
    } else {
      searchCity(city);
    }
  } else {
    showError(''); // Clear any previous error message when the user is typing
  }
});


function searchCity(city) {
  return new Promise((resolve, reject) => {
    fetch(`${baseUrl}${encodeURIComponent(city)}/today?unitGroup=us&include=days&key=${apiKey}&contentType=json`)
      .then(response => {
        if (!response.ok) {
          showError('Enter Correct City.');
          clearWeatherDisplay(); // Clear the weather display when the entered city is incorrect
          throw new Error('Entered City not in Scope.');
        }
        return response.json();
      })
      .then(data => {
        if (!data.days || data.days.length === 0) {
          showError('No weather data available');
          clearWeatherDisplay(); // Clear the weather display when there's no data
          throw new Error('No weather data available');
        }
        updateWeatherDisplay(data);
        resolve(data);
      })
      .catch(error => {
        showError(error.message);
        reject(error);
      });
  });
}

function clearWeatherDisplay() {
  weatherDisplay.innerHTML = ''; // Clear the weather display
}

function setBackgroundImage(icon) {
  let imageName = 'weather'; // default image
  if (icon.includes('snow')) {
    imageName = 'snow';
  } else if (icon.includes('rain')) {
    imageName = 'rain';
  } else if (icon.includes('fog')) {
    imageName = 'fog';
  } else if (icon.includes('wind')) {
    imageName = 'wind';
  } else if (icon.includes('cloudy')) {
    imageName = 'cloudy';
  } else if (icon.includes('showers-day')) {
    imageName = 'showers-day';
  } else if (icon.includes('showers-night')) {
    imageName = 'showers-night';
  } else if (icon.includes('clear-day')) {
    imageName = 'clear-day';
  } else if (icon.includes('clear-night')) {
    imageName = 'clear-night';
  } else {
    imageName = 'weather';
  }

  // images folder with these images
  document.querySelector('.weather-container').style.backgroundImage = `url('images/${imageName}.jpg')`;
}

function updateWeatherDisplay(data) {
  const { tempmax, tempmin, temp, description, icon, datetimeEpoch } = data.days[0];
  const resolvedAddress = data.resolvedAddress;

  // Set the background image based on the icon
  setBackgroundImage(icon);

  weatherDisplay.innerHTML = `
  <h1>${resolvedAddress}</h1>
  <p class="date">${formatDate(datetimeEpoch)}</p>
  <p>
    <span class="temp-value">${Math.round((temp - 32) * 5 / 9)}</span>
    <span class="temp-unit">°</span>
    <span class="temp-scale">c</span>
  </p>
  <p class="description">${description}</p>
  <p class="temperatures">High: ${Math.round((tempmax - 32) * 5 / 9)}°c / Low: ${Math.round((tempmin - 32) * 5 / 9)}°c</p>
    `;
  errorDisplay.style.display = 'none'; // Hide error if weather info is updated successfully
}

function showError(message) {
  errorDisplay.textContent = message;
  errorDisplay.style.display = message ? 'block' : 'none';
}

function formatDate(datetimeEpoch) {
  // Create a new Date object using datetimeEpoch converted from seconds to milliseconds
  const date = new Date(datetimeEpoch * 1000);

  const options = {
    weekday: 'long', // Full name of the day of the week
    year: 'numeric', // Numeric year
    month: 'long', // Full name of the month
    day: 'numeric' // Numeric day of the month
  };
  return date.toLocaleDateString('en-US', options); // Format the date into a readable string
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('search-btn').addEventListener('click', function () {
    const city = document.getElementById('search-input').value;
    searchCity(city);
  });
});