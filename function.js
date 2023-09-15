// Get the current time
let currentTime = new Date();

// Format the date
function formatDate(date) {
  let currentHours = currentTime.getHours();
  if (currentHours < 10) {
    currentHours = `0${currentHours}`;
  }
  let currentMinutes = currentTime.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }

  let currentDay = currentTime.getDay();
  let currentDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let currentDate = currentTime.getDate();
  let currentDates = [
    "",
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
    "11th",
    "12th",
    "13th",
    "14th",
    "15th",
    "16th",
    "17th",
    "18th",
    "19th",
    "20th",
    "21st",
    "22nd",
    "23rd",
    "24th",
    "25th",
    "26th",
    "27th",
    "28th",
    "29th",
    "30th",
    "31st",
  ];

  let currentMonth = currentTime.getMonth();
  let currentMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${currentDays[currentDay]} the ${currentDates[currentDate]} of ${currentMonths[currentMonth]} | ${currentHours}:${currentMinutes}`;
}

function displayWeatherForecast() {
  let weatherForecastElement = document.querySelector("#weather-forecast");
  let weatherForecastHTML = `<div class="row" id="forecast">`;
  let forecastDays = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];
  forecastDays.forEach(function (day) {
    weatherForecastHTML =
      weatherForecastHTML +
      `
        <div class="col">
          <small class="day">${day}</small>
          <br />
          <img
            src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/few-clouds-day.png"
            class="small-icon"
            id="small-icon" alt="small-weather-icon"
          />
          <br />
          <small class="temp-day">-5°C</small>
        </div>`;
  });
  weatherForecastHTML = weatherForecastHTML + `</div`;
  weatherForecastElement.innerHTML = weatherForecastHTML;
}

displayWeatherForecast();

// Update the date element with the formatted date
let dateElement = document.querySelector("#date");
dateElement.innerHTML = formatDate(currentTime);

// Display weather information
function displayWeather(response) {
  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.temperature.current
  );
  document.querySelector("#description").innerHTML =
    response.data.condition.description;
  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.temperature.humidity
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  let iconElement = document.querySelector("#big-icon");
  iconElement.setAttribute(
    "src",
    `https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );

  // Store the temperature in Celsius for unit conversion
  celsiusTemperature = response.data.temperature.current;
}

// Search for a city's weather by name
function searchCity(city) {
  let apiKey = "344027118o9t0bba5e252d5b7747161f";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

// Handle form submission
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  searchCity(city);
}

// Event listener for search form
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

// Search for weather based on current location
function searchLocation(position) {
  let apiKey = "344027118o9t0bba5e252d5b7747161f";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lat=${position.coords.latitude}&lon=${position.coords.longitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

// Display weather for the current location
function displayCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

// Event listener for current location
let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", displayCurrentLocation);

// Convert temperature to Fahrenheit
function displayFahrenheit(event) {
  event.preventDefault();
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

// Convert temperature to Celsius
function displayCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

// Event listener for Fahrenheit link
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheit);

// Event listener for Celsius link
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsius);

// Default city / weather on loaded page
searchCity("London");
