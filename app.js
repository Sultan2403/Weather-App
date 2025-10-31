const resultDisplay = document.getElementById("weatherDisplay");
const btn = document.getElementById("btn");
const weatherIcons = {
  clear: "https://cdn-icons-png.flaticon.com/128/4814/4814268.png", // Sunny Icon
  cloudy: "https://cdn-icons-png.flaticon.com/128/3313/3313983.png", // Cloudy Icon
  rain: "https://cdn-icons-png.flaticon.com/128/2864/2864448.png", // Rain Icon
  snow: "https://cdn-icons-png.flaticon.com/128/2315/2315309.png", // Snow Icon
  default: "https://cdn-icons-png.flaticon.com/128/1163/1163661.png", // Default Icon
};

async function getWeather() {
  const userInput = document.getElementById("city-inp").value;
  if (!userInput || !isNaN(userInput)) {
    resultDisplay.textContent = `Please input a valid city name!`;
    setTimeout(() => {
      resultDisplay.textContent = "";
    }, 3000);
    return;
  }
  try {
    resultDisplay.textContent = `Please wait while we fetch the weather data for your location`;
    btn.disabled = true;
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${userInput}`
    );
    resultDisplay.textContent = "Done fetching!";
    if (!geoResponse.ok) {
      throw new Error(
        `Failed to fetch location data, please make sure you input a valid city name`
      );
    }
    const geoData = await geoResponse.json();
    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;
    const currWeather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    if (!currWeather.ok) {
      throw new Error(`An error occured, please try again later`);
    }
    const weatherData = await currWeather.json();
    const dataToDisplay = weatherData.current_weather.temperature;
    let icons = weatherIcons.default;
    const weatherCode = weatherData.current_weather.weathercode;
    if (weatherCode === 0) {
      icons = weatherIcons.clear;
    } else if ([1, 2, 3].includes(weatherCode)) {
      icons = weatherIcons.cloudy;
    } else if ([51, 52, 61, 62].includes(weatherCode)) {
      icons = weatherIcons.rain;
    } else if ([71, 73, 75].includes(weatherCode)) {
      icons = weatherIcons.snow;
    }
    resultDisplay.innerHTML = `<div class="temperature">The temperature in ${userInput} is: ${dataToDisplay}°C</div>`;
    resultDisplay.innerHTML += `<img src="${icons}" alt="Weather Icon">`;
    btn.disabled = false;
  } catch (error) {
    resultDisplay.textContent = `Sorry an error occured, please try again later.`;
    btn.disabled = false;
    console.error(error);
    setTimeout(() => {
      resultDisplay.textContent = "";
    }, 5000);
    return;
  }
}

const userInput = document.getElementById("city-inp");
btn.addEventListener("click", () => getWeather());
userInput.addEventListener("keydown", (pressed) => {
  if (pressed.key === "Enter") {
    getWeather();
  }
});
const form = document.getElementById("form");

form.addEventListener("submit", (action) => {
  action.preventDefault();
});
