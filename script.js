// Returns the value of a cookie by name or empty string if not found
function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let c of cookieArray) {
    c = c.trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length);
    }
  }
  return "";
}


function showCookieInfo() {
  const cookieValue = getCookie("userInfo");
  if (cookieValue) {
    // Cookie found – display it
    const info = JSON.parse(cookieValue);
    return `<h2>Your stored information</h2>
            <p><strong>Name:</strong> ${info.name}</p>
            <p><strong>Favourite colour:</strong> ${info.favoriteColor}</p>`;
  }
  // Return empty string if no cookie
  return "";
}


async function getWeather() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation is not supported by this browser.");
    } else {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Replace YOUR_API_KEY with your OpenWeatherMap key
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=1e3aa51702f19666e7638eed164d84b6&units=metric`;
          const res = await fetch(url);
          const data = await res.json();
          resolve(data);
        } catch (error) {
          reject("Failed to fetch weather data.");
        }
      }, () => {
        reject("Permission denied or unavailable.");
      });
    }
  });
}

function renderWeather(data) {
  // Build HTML using some of the fields returned by the API
  // The example in GeeksforGeeks shows how to extract values:contentReference[oaicite:3]{index=3}.
  return `<h2>Weather in ${data.name}, ${data.sys.country}</h2>
          <p><strong>Temperature:</strong> ${data.main.temp.toFixed(1)}°C</p>
          <p><strong>Feels like:</strong> ${data.main.feels_like.toFixed(1)}°C</p>
          <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
          <p><strong>Weather:</strong> ${data.weather[0].description}</p>`;
}


// Immediately invoked async function for initialization
(async () => {
  const container = document.getElementById("infoContainer");
  const cookieHtml = showCookieInfo();
  if (cookieHtml) {
    container.innerHTML = cookieHtml;
  } else {
    try {
      container.innerHTML = "<p>Loading your location and weather…</p>";
      const weatherData = await getWeather();
      container.innerHTML = renderWeather(weatherData);
    } catch (err) {
      container.innerHTML = `<p>${err}</p>`;
    }
  }
})();
