/** @format */
const APIKEY = "5adb4f501449bfeef61bccd0471f2005";
const userTabs = document.querySelector("[data-userWeather]");
const searchTabs = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weatherdetails");
const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
// console.log(userInfoContainer);
let currTab = userTabs;
currTab.classList.add("curr-tab");
// searchTabs.classList.add("curr-tab");
getFromSessionStorage();
function switchTab(clickedTab) {
  if (clickedTab != currTab) {
    currTab.classList.remove("curr-tab");
    currTab = clickedTab;
    currTab.classList.add("curr-tab");
  }
  if (!searchForm.classList.contains("active")) {
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    searchForm.classList.add("active");
  } else {
    searchForm.classList.remove("active");
    userInfoContainer.classList.remove("active");
    getFromSessionStorage();
  }
}

function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    grantAccessContainer.classList.add("active");
  } else {
    console.log("before parsing", localCoordinates);
    // Use the JavaScript function JSON.parse() to convert text into a JavaScript object:
    // const text = '[ "Ford", "BMW", "Audi", "Fiat" ]';
    // console.log(text)["Ford", "BMW", "Audi", "Fiat"];
    // const myArr = JSON.parse(text);Ford,BMW,Audi,Fiat
    // When using the JSON.parse() on a JSON derived from an array, the method will return a JavaScript array, instead of a JavaScript object.
    //     A common use of JSON is to exchange data to/from a web server.

    // When receiving data from a web server, the data is always a string.

    // Parse the data with JSON.parse(), and the data becomes a JavaScript object.
    const coordinates = JSON.parse(localCoordinates);
    console.log("after parsing", coordinates);
    fetchUserWeatherInfo(coordinates);
  }
}
async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  //make grant conatiner invisible
  grantAccessContainer.classList.remove("active");
  //make loader visible
  loadingScreen.classList.add("active");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (e) {
    loadingScreen.classList.remove("active");
    // console.log(e);
  }
}
function renderWeatherInfo(d) {
  console.log("hlll", d);
  cityName = document.querySelector(".city");
  console.log(cityName);
  countryIcon = document.querySelector("[data-countryIcon]");
  desc = document.querySelector("[data-weatherDesc]");
  weatherIcon = document.querySelector("[data-weatherIcon]");
  temperature = document.querySelector(".temperature");
  windSpeed = document.querySelector("[data-windspeed]");
  humidity = document.querySelector("[data-humidity]");
  clouds = document.querySelector("[data-clouds]");

  //fetch from weather info obj
  cityName.innerText = d?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${d?.sys?.country.toLowerCase()}.png`;
  desc.innerText = d?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${d?.weather?.[0]?.icon}.png`;
  temperature.innerText = `${d?.main?.temp}°C`;
  windSpeed.innerText = `${d?.wind?.speed}m/s`;
  humidity.innerText = `${d?.main?.humidity}%`;
  clouds.innerText = `${d?.clouds?.all}%`;
}

userTabs.addEventListener("click", () => {
  switchTab(userTabs);
});
searchTabs.addEventListener("click", () => {
  switchTab(searchTabs);
});

function getLocation() {
  console.log("first");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    console.log("second");
  } else {
    console.log("geolocation not supported");
  }
}
function showPosition(position) {
  console.log("third");
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  //jab local storage me bhejna ho to stringfy use kro because :it converts a JavaScript value to a JSON string ar local storage isi form me usko store krta h
  //console.log(JSON.stringify({ x: 5, y: 6 }));
  // Expected output: "{"x":5,"y":6}"
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  console.log("fifth");
  fetchUserWeatherInfo(userCoordinates);
}

const searchInput = document.querySelector("[data-searchInput]");
// const searchBtn=document.querySelector("[]")
searchForm.addEventListener("click", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;
  if (cityName === "") {
    return;
  } else {
    fetchSearchWeatherInfo(cityName);
  }
});

async function fetchSearchWeatherInfo(c) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${c}&appid=${APIKEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (e) {
    console.log(e);
  }
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

// const a = `https://api.openweathermap.org/data/2.5/weather?q={}&appid=${APIKEY}`;
// async function fetchingWeather() {
//   const city = "delhi";
//   const response = await fetch(
//     `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=metric`
//   );
//   const data = await response.json();
//   console.log(data);
//   let newPara = document.createElement("p");
//   newPara.textContent = `${data.main.temp}` + "\u00B0" + "C";
//   document.body.appendChild(newPara);
// }
// fetchingWeather();

// document.addEventListener("click", (e) => {
//   let Y = e.clientY;
//   let X = e.clientX;
//   console.log("ye lo", X, Y);
//   const m = document.querySelector(".hell");
//   console.log(m);
//   m.style.positon = "absolute";
//   m.style.left = X + "px";
//   m.style.top = Y + "px";
// });
