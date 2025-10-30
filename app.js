const resultDisplay = document.getElementById("weatherDisplay");
const btn = document.getElementById("btn");
const weatherIcons = {
  clear: "https://cdn-icons-png.flaticon/512/869/869869.png", // Sunny Icon
  cloudy: "https://cdn-icons-png.flaticon/512/414/414927.png", // Cloudy Icon
  rain: "https://cdn-icons-png.flaticon/512/1163/1163624.png", // Rain Icon
  snow: "https://cdn-icons-png.flaticon/512/624/642102.png", // Snow Icon
  default: "https://cdn-icons-png.flaticon/512/3313/3313998.png", // Default Icon
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
    console.table(geoData);
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
    resultDisplay.innerHTML = `<div class="temperature">The temperature in ${userInput} is: ${dataToDisplay}°C</div>`;
  } catch (error) {
    resultDisplay.textContent = `Sorry an error occured, please try again later.`;
    setTimeout(() => {
      resultDisplay.textContent = "";
    }, 5000);
    return;
  }
}

btn.addEventListener("click", () => getWeather());

console.table(weatherIcons);
