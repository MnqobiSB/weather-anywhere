// SET UP SERVICE WORKER
if (navigator.serviceWorker) {
   window.addEventListener('load', () => {
      navigator.serviceWorker
      .register('service-worker.js')
      .then(reg => console.log('Service worker succesfully registered!'))
      .catch(err => console.error(err))
   })
}

// GET HTML ELEMENTS
const notification 	= document.querySelector('.notification');
const searchValue 	= document.querySelector('.search-value');
const searchButton 	= document.querySelector('.search-button');
const locationButton	= document.querySelector('.location-button');
const cityName 		= document.querySelector('.city-name');
const weatherIcon		= document.querySelector('.weather-icon');
const tempValue 		= document.querySelector('.temp-value p');
const tempDesc 		= document.querySelector('.temp-desc p');

// APP DATA
const weather = {};

weather.temperature = {
   unit : "celsius"
}

// GET DATA FROM API
const KELVIN = 273;
const key = //api-key;

// GET WEATHER DATA ON SEARCH
searchButton.addEventListener('click', function () {
	let api = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue.value}&appid=${key}`;

	fetch(api)
	.then((response) => {
		let data = response.json();
		return data;
	})
	.then((data) => {
		weather.city = data.name;
		weather.country = data.sys.country;
		weather.iconId = data.weather[0].icon;
		weather.temperature.value = Math.floor(data.main.temp - KELVIN);
		weather.description = data.weather[0].description;

		notification.innerHTML = '';
	})
	.then(() => {
		displayWeather();
		console.log(weather);
		localStorage.setItem('data', JSON.stringify(weather));
	})
	.catch(err => {
		notification.style.display = 'block';
		notification.innerHTML = '<p>City not found, please try again!</p>';
	});
});


// GET WEATHER DATA BASED ON CURRENT LOCATION
locationButton.addEventListener('click', function () {
	// GET USER GEOLOCATION
	if ('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition(setPosition, showError);
	} else {
		notification.style.display = 'block';
		notification.innerHTML = '<p>Cannot get your current location.</p>';
	}

	// SET USER POSITION
	function setPosition(position) {
		let latitude = position.coords.latitude;
		let longitude = position.coords.longitude;

		getWeather(latitude, longitude);
	}

	// SHOW ERROR WHEN LOCATION HAS AN ISSUE
	function showError(error) {
		notification.style.display = 'block';
		notification.innerHTML = `<p>${error.message}</p>`;
	}


	function getWeather(longitude, latitude) {
		let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

		fetch(api)
		.then((response) => {
			let data = response.json();
			console.log(data);
			return data;
		})
		.then((data) => {
			weather.city = data.name;
			weather.country = data.sys.country;
			weather.iconId = data.weather[0].icon;
			weather.temperature.value = Math.floor(data.main.temp - KELVIN);
			weather.description = data.weather[0].description;
		})
		.then(() => {
			displayWeather();
			localStorage.setItem('data', JSON.stringify(weather));
		});
	}
});

// DISPLAY WEATHER INFO ON UI
function displayWeather() {
	cityName.innerHTML 		= `${weather.city}, ${weather.country}`;
	weatherIcon.innerHTML 	= `<img src="icons/${weather.iconId}.png"/>`;
	tempValue.innerHTML 		= `${weather.temperature.value}&deg;<span class="celcius">C</span>`;
	tempDesc.innerHTML 		= weather.description;
}

// GET ITEMS STORED IN LOCAL STORAGE
function getItem() {
      if(JSON.parse(localStorage.getItem('data'))){
      displayWeather(JSON.parse(localStorage.getItem('data')))
   }
}

// CALCULATE CELCIUS TO FAHRENHEIT
function celciusToFahrenheit(temperature) {
	return (temperature * 9/5) + 32;
}

// CONVERT TEMPERATURE UNIT WHEN USER CLICK ON TEMPERATURE ELEMENT
tempValue.addEventListener('click', function(){
	if(weather.temperature.value === undefined) return;

	if (weather.temperature.unit === 'celcius') {
		let fahrenheit = celciusToFahrenheit(weather.temperature.value);
		fahrenheit = Math.floor(fahrenheit);

		tempValue.innerHTML = `${fahrenheit}&deg;<span>F</span>`;
		weather.temperature.unit = 'fahrenheit';
	} else {
		tempValue.innerHTML = `${weather.temperature.value}&deg;<span>C</span>`;
		weather.temperature.unit = 'celcius';
	}
});


