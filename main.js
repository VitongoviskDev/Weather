const searchButton = document.getElementById('search-button');
const locationInput = document.getElementById('location-input');
const form = document.querySelector('.searchbar form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    locationInput.blur();
})

const dataContainer = document.querySelector(".data-container");
const errorContainer = document.querySelector(".error-container");


locationInput.addEventListener("focus", () => {
    errorContainer.classList.remove('shown');
    dataContainer.classList.remove('shown');
    ClearData();
})
searchButton.addEventListener("click", () => {
    GetWeather();
})


async function GetWeather() {
    const key = 'b3cb7a8073b752ab489692f04606ded3';
    const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${locationInput.value}&appid=${key}`;
    const dailyForecast = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${locationInput.value}&cnt=7&appid=${key}`
    const urls = [currentWeather, dailyForecast];
    
    Promise.all(urls.map(url => {
      return fetch(url).then(response => response.json());
    }))
    .then(data => {
        DisplayData(data);
    })
    .catch(error => {
        dataContainer.classList.remove('shown');
        errorContainer.classList.add('shown');
    });
    
}
function ClearData(){
    const weeklyContainer = document.querySelector('.weekly-container');
    const nodes = weeklyContainer.childNodes.length;

    for(let i = 0; i < nodes; i++){
        weeklyContainer.removeChild(weeklyContainer.childNodes[0]);
    }
    
    const feelsLike = document.getElementById('feels-like');
    const humidity = document.getElementById('humidity');
    const clouds = document.getElementById('clouds');
    const wind = document.getElementById('wind');
    const pressure = document.getElementById('pressure');
    const rain = document.getElementById('rain');

    feelsLike.innerHTML = '';
    humidity.innerHTML = '';
    clouds.innerHTML = '';
    wind.innerHTML = '';
    pressure.innerHTML = '';
    rain.innerHTML = '';
}
function DisplayData([currentData, dailyData]){
    locationInput.value = '';
    dataContainer.classList.add('shown');
    
    const kelvin = 273.1;

    
    //CURRENT DATA
    
    const temperatureIcon = document.getElementById('temperature-icon');
    const currentTemperature = document.getElementById('current-temperature');
    const city = document.getElementById('location');
    const icon = currentData.weather[0].icon
    
    console.log(icon)
    document.body.style.backgroundImage = `url("./assets/${icon}.jpg")`;
    temperatureIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`
    currentTemperature.textContent = (currentData.main.temp - kelvin).toFixed();
    city.textContent = `${currentData.name}`;
    //WEEKLY DATA
    const weeklyContainer = document.querySelector('.weekly-container');
    const list = dailyData.list;
    const weekdays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
    list.map(day => {
        const date = new Date(day.dt * 1000);
        const weekDay = weekdays[date.getDay()]

        const max = (day.temp.max - 273.1).toFixed();
        const min = (day.temp.min - 273.1).toFixed();
        const cday = (day.temp.day - 273.1).toFixed();

        console.log('temp: ', cday);

        const weekCard = document.createElement('div');
        weekCard.classList.add('week__card');
        weekCard.innerHTML = `
            <p class="week-day">${weekDay}.</p>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt"${day.weather[0].main}" />
            <div class="week-min-max">
                <p class="min">${min}<span>°C</span></p>
                <p>${max}<span>°C</span></p>
            </div>
        `;
        weeklyContainer.appendChild(weekCard);
    })

    // OTHER DATA
    const feelsLike = document.getElementById('feels-like');
    const humidity = document.getElementById('humidity');
    const clouds = document.getElementById('clouds');
    const wind = document.getElementById('wind');
    const pressure = document.getElementById('pressure');
    const rain = document.getElementById('rain');

    console.log(humidity);

    feelsLike.innerHTML = `${(currentData.main.feels_like - kelvin).toFixed()}<span>°C</span>`;
    humidity.innerHTML = `${currentData.main.humidity}<span>%</span>`;
    clouds.innerHTML = `${currentData.clouds.all}<span>%</span>`;
    wind.innerHTML = `${currentData.wind.speed}<span>m/s</span></br>${currentData.wind.deg} <span>graus</span>`
    pressure.innerHTML = `${currentData.main.pressure}<span>hPa</span>`
    rain.innerHTML = `${currentData.rain ? currentData.rain['1h'] : 0} <span>mm</span>`;
}