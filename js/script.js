function fetchData(method, url) {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.onload = () => resolve(JSON.parse(xhr.response));
        xhr.onerror = () => reject(xhr.statusText);

        xhr.send();
    })

    return promise;
}

const key = '03fb54ebf904aeecf7fbb0e169f0c7ad';
const urlWether = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&appid=${key}`;
const urlWether5 = `https://api.openweathermap.org/data/2.5/forecast?q=Minsk&appid=${key}`;
const kelvin = 273.15;
const container = document.querySelector('#container');

class Weather {
    constructor(data) {
        [this.dataCurrent, this.dataForecast] = data;
        console.log(data);
        this.city = data[0].name;
        console.log(this.city);
        this.state = data[0].sys.country;
        this.tempCurrent = Math.round(data[0].main.temp - kelvin);
        this.tempFeelsLike = Math.round(data[0].main.feels_like - kelvin);
        this.iconCurrent = data[0].weather[0].icon;
        this.date = data[0].dt;
        this.windDeg = data[0].wind.deg;
        this.windSpeed = data[0].wind.speed;

        this.dataList = data[1].list;

        this.forecastList5 = this._showForecastList();
        this.timeCurrent = this._showTimeCurrent();
        this.wind = this._showWindSide();
        this.render(container);

    }
    _showTimeCurrent() {
        const d = new Date();
        return d.toTimeString().slice(0, 5); 
    }

    _showWindSide() {
        if (this.windDeg > 45 && this.windDeg <= 135) {
            return this.wind = '◄  west';
        } else if (this.windDeg > 135 && this.windDeg <= 225) {
            return this.wind = '▲  south';
        } else if (this.windDeg > 225 && this.windDeg <= 315) {
            return this.wind = '►  east';
        } else {
            return this.wind = '▼ north';
        }
    }

    _showForecastList() {
        const forecastList = this.dataList.filter((item) => {
            return item.dt_txt.toLowerCase().trim().includes("12:00:00");
        });

        forecastList.forEach(item => {
            const day = new Date(item.dt * 1000).toString().slice(3, 11);
            const icon = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
            const temp = Math.round(item.main.temp - kelvin);

            const template = `
                <div class="forecast5">
                    <p class="date">${day} </p>
                    <div class="icon"><img src="${icon}" alt=""></div>
                    <p class="temp">${temp} &#8451;</p>
                </div>
                <hr>
            `
            container.insertAdjacentHTML('beforeend', template);
        })
    }

    render(parent) {
        const template = `
        <div class="forecast1">
        <div class="placeTime">
            <span>${this.city}, ${this.state}</span>
            <p><i class="far fa-clock"></i>  ${this.timeCurrent}</p>
        </div>
        <div class="main">
        <div class="img">
            <img src="http://openweathermap.org/img/wn/${this.iconCurrent}@2x.png" alt="">
        </div>
        <p class="temp">
            ${this.tempCurrent} &#8451;
        </p>
        <p class="feelsLike">
           Feels like ${this.tempFeelsLike} &#8451;
        </p>
        </div>
        <div class="windInfo">
                <p>${this.wind}</p>
                <p><i class="fas fa-wind"></i> ${this.windSpeed} m/s </p>
        </div>
        </div>
        
        `
        container.insertAdjacentHTML('afterbegin', template);

    }

}

const arrData = [];

fetchData('GET', urlWether)
    .then(data => arrData.push(data))
    .then(() => fetchData('GET', urlWether5))
    .then(data => arrData.push(data))
    .then(() => new Weather(arrData))



