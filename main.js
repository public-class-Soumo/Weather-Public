document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "704f8a7d4d9ca69d50f4f4bf6f7d4b17";
  const currentWeatherApiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=";
  const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";

  const cityInput = document.getElementById("cityInput");
  const searchButton = document.getElementById("searchButton");

  const greetingElement = document.querySelector(".greeting");

  window.addEventListener("load", () => {
    fetchWeatherData("Kolkata");
    fetchForecastData("Kolkata");
  });

  function updateGreeting() {
    const now = new Date();
    let hours = now.getHours();
    let greeting = "";

    if (hours >= 6 && hours < 12) {
      greeting = "Good Morning";
    } else if (hours >= 12 && hours < 16) {
      greeting = "Good Afternoon";
    } else if (hours >= 16 && hours < 21) {
      greeting = "Good Evening";
    } else {
      greeting = "Good Night";
    }

    greetingElement.textContent = greeting;
  }

  updateGreeting();
  setInterval(updateGreeting, 60000);

  const locationElement = document.querySelector(".location");
  const dateElement = document.querySelector(".date");
  dateElement.textContent = new Date().toLocaleDateString("en-GB");

  const tempLargeElement = document.querySelector(".tempLarge");
  const conditionElement = document.querySelector(".condition");
  const windSpeedElement = document.querySelector(
    ".weatherStats .stat:nth-child(1) span:nth-child(2)"
  );
  const humidityElement = document.querySelector(
    ".weatherStats .stat:nth-child(2) span:nth-child(2)"
  );
  const currentTempElement = document.querySelector(".currentTemp");
  const currentDetailsElement = document.querySelector(".currentDetails");
  const feelsLikeElement = document.querySelector(".feelsLike");
  const currentTimeElement = document.querySelector(".currentTime");

  currentTimeElement.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const hourlyForecastContainer = document.querySelector(".hourlyGrid");
  const weeklyForecastContainer = document.querySelector(".weeklyForecast");

  searchButton.addEventListener("click", () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
      fetchWeatherData(cityName);
      fetchForecastData(cityName);
    }
  });

  async function fetchWeatherData(city) {
    try {
      const response = await fetch(
        `${currentWeatherApiUrl}${city}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      updateWeatherUI(data);
    } catch (error) {
      alert(error.message);
    }
  }

  async function fetchForecastData(city) {
    try {
      const response = await fetch(
        `${forecastApiUrl}${city}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      updateForecastUI(data);
    } catch (error) {
      alert(error.message);
    }
  }

  function updateWeatherUI(data) {
    locationElement.textContent = data.name;
    dateElement.textContent = new Date().toLocaleDateString("en-GB");
    tempLargeElement.textContent = `${Math.round(data.main.temp)}°`;
    conditionElement.textContent = data.weather[0].description;
    windSpeedElement.textContent = `${data.wind.speed} mph`;
    humidityElement.textContent = `${data.main.humidity} %`;
    currentTempElement.textContent = `${Math.round(data.main.temp)}°`;
    feelsLikeElement.textContent = `Feels like ${Math.round(
      data.main.feels_like
    )}°`;
    currentTimeElement.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function updateForecastUI(data) {
    hourlyForecastContainer.innerHTML = "";
    weeklyForecastContainer.innerHTML = "";

    // Hourly forecast (next 6 hours)
    for (let i = 0; i < 6; i++) {
      const hourlyData = data.list[i];
      const hourElement = document.createElement("div");
      hourElement.classList.add("hourCard");
      hourElement.innerHTML = `
        <div class="hourTime">${new Date(
          hourlyData.dt * 1000
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
        <div class="hourTemp">${Math.round(hourlyData.main.temp)}°</div>
        <div class="hourCondition">${hourlyData.weather[0].description}</div>
      `;
      hourlyForecastContainer.appendChild(hourElement);
    }

    // Weekly forecast (6 days including today)
    const dailyData = {};
    data.list.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = forecast;
      }
    });

    Object.values(dailyData)
      .slice(0, 6)
      .forEach((day) => {
        const dayElement = document.createElement("div");
        dayElement.classList.add("dayForecast");
        dayElement.innerHTML = `
        <div class="dayName">${new Date(day.dt * 1000).toLocaleDateString(
          "en-US",
          { weekday: "short" }
        )}</div>
        <div class="dayTemp">${Math.round(day.main.temp)}°</div>
        <div class="dayCondition">${day.weather[0].description}</div>
      `;
        weeklyForecastContainer.appendChild(dayElement);
      });
  }
});
