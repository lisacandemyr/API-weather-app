// Get the current time
let currentTime = new Date();

// Format the date
function formatDate(date) {
  // Extract hours and minutes from the current time
  let currentHours = currentTime.getHours();
  if (currentHours < 10) {
    currentHours = `0${currentHours}`;
  }
  let currentMinutes = currentTime.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }

  // Define arrays for days, dates, and months
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

  // Construct the formatted date string
  return `${currentDays[currentDay]} the ${currentDates[currentDate]} of ${currentMonths[currentMonth]} | ${currentHours}:${currentMinutes}`;
}

// Format the day of the week for the weekly forecast
function formatDay(timestamp) {
  let futureDate = new Date(timestamp * 1000);
  let futureDay = futureDate.getDay();
  let futureDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return futureDays[futureDay];
}

// Update the date element with the formatted date
let dateElement = document.querySelector("#date");
dateElement.innerHTML = formatDate(currentTime);

// Display the weekly weather forecast
function displayWeatherForecast(response) {
  let weeklyForecast = response.data.daily;
  let weatherForecastElement = document.querySelector("#weather-forecast");
  let weatherForecastHTML = `<div class="row" id="forecast">`;

  weeklyForecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      weatherForecastHTML =
        weatherForecastHTML +
        `
        <div class="col">
          <small class="day">${formatDay(forecastDay.time)}</small>
          <br />
          <img
            src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
              forecastDay.condition.icon
            }.png"
            class="small-icon"
            id="small-icon"
            alt="small-weather-icon"
          />
          <br />
          <small class="temp-day">${Math.round(
            forecastDay.temperature.day
          )}°<span id="forecast-unit">C</span></small>
        </div>`;
    }
  });
  weatherForecastHTML = weatherForecastHTML + `</div>`;
  weatherForecastElement.innerHTML = weatherForecastHTML;
}
// Get the weekly weather forecast
function getWeatherForecast(coordinates) {
  let apiKey = "344027118o9t0bba5e252d5b7747161f";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherForecast);
}

// Display current weather and weekly forecast
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

  // Get the weekly weather forecast
  getWeatherForecast(response.data.coordinates);
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

  let weeklyTemperatureFahrenheit = document.querySelectorAll(".temp-day");

  weeklyTemperatureFahrenheit.forEach((element) => {
    let celsiusValue = parseInt(element.textContent);
    let fahrenheitValue = (celsiusValue * 9) / 5 + 32;
    element.innerHTML = `${Math.round(fahrenheitValue)}°F`;
  });
}

// Convert temperature to Celsius
function displayCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  let weeklyTemperatureCelsius = document.querySelectorAll(".temp-day");

  weeklyTemperatureCelsius.forEach((element) => {
    let fahrenheitValue = parseInt(element.textContent);
    let celsiusValue = ((fahrenheitValue - 32) * 5) / 9;
    element.innerHTML = `${Math.round(celsiusValue)}°C`;
  });
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
