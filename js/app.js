function todaysForecast(location, current) {
  const d = new Date(current.last_updated);
  const todaysDate = `${d.getDate()} ${months[d.getMonth()]}`;
  window._todayCardHtml = `
    <div class="card1 col p-0">
      <div class="card1-header w-100 text-white d-flex justify-content-between p-2">
        <p>${days[d.getDay()]}</p>
        <p>${todaysDate}</p>
      </div>
      <div class="d-flex flex-column flex align-items-start p-3">
        <p class="text-white">${location.name}</p>
        <p class="text-white fs-1 fw-bolder">${current.temp_c}°C</p>
        <img src="https:${current.condition.icon}" width="90">
        <p class="text-info">${current.condition.text}</p>
        <div class="d-flex justify-content-between">
          <div>
            <img src="images/imgi_3_icon-umberella.png" class="w-100" />
          </div>
          <p class="text-white-50 ms-1 me-3">${current.cloud}%</p>
          <div>
            <img src="images/imgi_4_icon-wind.png" />
          </div>
          <p class="text-white-50 ms-1 me-3">${current.wind_kph} km/h</p>
          <div>
            <img src="images/imgi_5_icon-compass.png" />
          </div>
          <p class="text-white-50 ms-1 me-3">${current.wind_dir}</p>
        </div>
      </div>
    </div>
  `;
}

function nextDaysForecast(daysArr) {
  const forecastElement = document.getElementById("forecast");
  let html = "";
  html += window._todayCardHtml;
  for (let i = 1; i < daysArr.length; i++) {
    const d = daysArr[i];
    const nextDate = days[new Date(d.date).getDay()];
    html += `
      <div class="${i === 1 ? "card2" : "card1"} col p-0">
        <div class="${
          i === 1 ? "card2-header" : "card1-header"
        } w-100 text-white d-flex justify-content-center p-2">
          <p>${nextDate}</p>
        </div>
        <div class="p-4">
          <img src="https:${d.day.condition.icon}" alt="" width="48">
          <p class="text-white fs-4 fw-bolder">${d.day.maxtemp_c}°C</p>
          <p class="text-white">${d.day.mintemp_c}°</p>
          <p class="text-info">${d.day.condition.text}</p>
        </div>
      </div>
    `;
  }
  forecastElement.innerHTML = `
    <div class="cards container text-center position-absolute">
      <div class="row row-cols-1 row-cols-lg-3">
        ${html}
      </div>
    </div>
  `;
}

async function getForecast(q) {
  try {
    const f = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=f112999abe014ada88a154322250311&q=${q}&days=3`
    );
    if (!f.ok) return;
    const data = await f.json();
    todaysForecast(data.location, data.current);
    nextDaysForecast(data.forecast.forecastday);
  } catch (err) {
    console.error(err);
  }
}

function getLocationForecast() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const x = position.coords.latitude;
        const y = position.coords.longitude;
        getForecast(`${x},${y}`);
      },
      async (error) => {
        try {
          const loc = await fetch(
            `https://ipinfo.io/json?token=96745d14c355f7`
          );
          const data = await loc.json();
          getForecast(data.city);
        } catch (err) {
          console.error(err);
          getForecast("Cairo");
        }
      }
    );
  } else {
    getForecast("Cairo");
  }
}

const searchInput = document.getElementById("search");
searchInput.addEventListener("keyup", (e) => {
  getForecast(e.target.value);
});

getLocationForecast();

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
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
