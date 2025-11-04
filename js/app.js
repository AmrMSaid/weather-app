function todaysForecast(location, current) {
  const e = new Date(current.last_updated);
  const todaysDate = `${e.getDate()} ${months[e.getMonth()]}`;
  window._todayCardHtml = `
    <div class="card1 col p-0">
      <div class="card1-header w-100 text-white d-flex justify-content-between p-2">
        <p>${days[e.getDay()]}</p>
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
          <p class="text-white-50 ms-1 me-3">20%</p>
          <div>
            <img src="images/imgi_4_icon-wind.png" />
          </div>
          <p class="text-white-50 ms-1 me-3">18km/h</p>
          <div>
            <img src="images/imgi_5_icon-compass.png" />
          </div>
          <p class="text-white-50 ms-1 me-3">East</p>
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
search("cairo");

async function search(q) {
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

const searchInput = document.getElementById("search");
searchInput.addEventListener("keyup", (e) => {
  search(e.target.value);
});
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
