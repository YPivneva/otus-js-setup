const apiKey = "779191065caba280063e1cd1f4862b12";
const form = document.querySelector("#form");
const cityForm = document.querySelector("#enter-city");
const histotyList = document.querySelector("#histoty-list");
// mapWeather = document.querySelector("#weather-map"),
const weatherSign = document.querySelector("#text-city");

function createError(city) {
  document.querySelector(".weather-relevance").remove();
  const htmlWeather = `
      <div class="weather-relevance">
          <div class="weather__city">Город <b>${city}</b> не найден. 
          Введите корректное название города.</div>
      </div>`;
  weatherSign.insertAdjacentHTML("afterend", htmlWeather);
}

function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=
              ${city}&appid=${apiKey}&lang=ru`;
  return fetch(url).then((response) => {
    if (!response.ok) {
      createError(city);
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

function removeWeather() {
  const exCard = document.querySelector(".weather-relevance");
  const imgCard = document.querySelector(".weather-sign__img");
  if (exCard) exCard.remove();
  if (imgCard) imgCard.remove();
}

function createWeather(data) {
  removeWeather();
  const htmlWeather = `
      <div class="weather-relevance">
          <div class="weather__city">
            ${Math.round(parseFloat(data.main.temp) - 273)}°C
          </div>
          <div class="weather__temp">${data.name}</div>
      </div>
      <img class="weather-sign__img" 
      src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" 
      alt="Значок погоды" />
  `;
  weatherSign.insertAdjacentHTML("afterend", htmlWeather);
}

function addToHistory(city) {
  if (!histotyList.innerHTML.includes(city)) {
    const htmlHistory = `
          <li>${city}</li>
      `;
    histotyList.insertAdjacentHTML("afterbegin", htmlHistory);
  }
}

function removeExtraHistoryItems() {
  const items = document.querySelectorAll("li");
  if (items.length > 10) {
    for (let i = 10; i < items.length; i++) {
      items[i].remove();
    }
  }
}

const map = document.querySelector("#map-city");
function success(data) {
  map.src = `https://www.openstreetmap.org/export/embed.html?bbox=${data.coord.lon}%2C${data.coord.lat}&amp;layer=mapnik`;
}

histotyList.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    const city = event.target.textContent;
    getWeather(city).then((data) => {
      removeWeather();
      createWeather(data);
      success(data);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  function findLocation() {
    const status = document.querySelector("#status");

    function getWeatherlon(city, latitude, longitude) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=ru`;

      return fetch(url).then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      });
    }

    function drawMap(position) {
      const { longitude, latitude } = position.coords;
      const mapDomElement = document.querySelector("#map-city");
      mapDomElement.src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude}%2C${latitude}&amp;layer=mapnik`;
      getWeatherlon("Moscow", latitude, longitude)
        .then((data) => {
          createWeather(data);
        })
        .catch((errorMap) => {
          console.error("Ошибка получения данных о погоде:", errorMap);
        });
    }

    function error() {
      status.textContent = "не получается определить вашу геолокацию";
    }

    if (!navigator.geolocation) {
      status.textContent = "Приложение не может определить местоположение";
    } else {
      navigator.geolocation.getCurrentPosition(drawMap, error);
    }
  }

  findLocation();
});

form.onsubmit = function (event) {
  event.preventDefault();
  const city = cityForm.value.trim();

  getWeather(city).then((data) => {
    if (data.cod === "404") {
      removeWeather();
      createError(data);
    } else {
      removeWeather();
      createWeather(data);
      addToHistory(data.name);
      removeExtraHistoryItems();
      success(data);
    }
  });
};
