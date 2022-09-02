(() => {
  let today = new Date();
  console.log("date:", today)

  setInterval(() => {
    document.querySelector("#time").innerText = moment().format("h:mm:ss a")
  }, 1000);

  document.querySelector("#date").innerText = moment().format("Do  MMM  YYYY");

})();

let imgdiv = document.querySelector(`.img_div`);
let resultdiv = document.querySelector(`.result_div`);
let subdiv = document.querySelector(`.sub`);


let myFunction = () => {
  imgdiv.style.display = "block";
  resultdiv.style.display = "flex";
  subdiv.style.display = "flex";
  let city = document.querySelector("#forcastInput").value;
  axios
    .get(
      `https://api.weatherapi.com/v1/current.json?key=314ada84e4794ca7b1b100857221707&q=${city}`
    )
    .then(function (response) {
      // handle success
      const data = response.data;

      console.log(data);

      let icon = data.current.condition.icon;
      icon.replace("/file// ");


      document.getElementById("weather_icon").src = icon;
      document.querySelector("#tempC").innerText = data.current.temp_c + "°C";

      document.querySelector("#tempF").innerText = data.current.temp_f + "°F";

      document.querySelector("#city_name").innerText =
        data.location.name + "  ";
      document.querySelector("#time").innerText =
        data.location.localtime + ", ";
      document.querySelector("#last_update").innerText =
        data.current.last_updated + "   Last Update";
      document.querySelector("#weather_condition").innerText =
        data.current.condition.text;

      document.querySelector("#feels_like_c").innerText =
        "Feels Like: " + data.current.feelslike_c + "°C";
      document.querySelector("#feels_like_f").innerText =
        "Feels Like: " + data.current.feelslike_f + "°F";
      document.querySelector("#wind_speed_kph").innerText =
        "Wind Speed: " + data.current.wind_kph + "KP/H";
      document.querySelector("#wind_speed_mph").innerText =
        "Wind Speed: " + data.current.wind_mph + "MP/H";
      document.querySelector("#humidity").innerText =
        "Humidity: " + data.current.humidity + "%";

      document.querySelector("#visibility").innerText =
        "Visibility : " + data.current.vis_km + "KM";

      // getWeatherData();
      // myFunction ();
    });
};



let cityFunction = () => {

  let cityName = document.querySelector("#forcastInput").value


  axios
    .get
    (`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=a87b897713922e0dae12cddf4a37b07f&units=metric`)

    .then(function (response) {

      // handle success
      console.log(response)

      let dayWise = [];
      let dateOfMonth = null;
      let counter = -1;

      response.data.list.map(eachHour => {
        let tempDateOfMonth = new Date(eachHour.dt_txt).getDate()

        if (dateOfMonth !== tempDateOfMonth) {
          counter++;
          dateOfMonth = tempDateOfMonth
        }

        if (!dayWise[counter]) { dayWise[counter] = [] }
        dayWise[counter].push(eachHour)
      })
      console.log(dayWise);


      dayWise = dayWise.map((eachDay) => {
        return eachDay.reduce((previousEachHour, currentEachHour) => {

          let sum = Number(previousEachHour.main.temp) + Number(currentEachHour.main.temp)
          let sumMinTemp = Number(previousEachHour.main.temp_min) + Number(currentEachHour.main.temp_min)
          let sumMaxTemp = Number(previousEachHour.main.temp_max) + Number(currentEachHour.main.temp_max)

          return {
            main: {
              temp: sum,
              temp_min: sumMinTemp,
              temp_max: sumMaxTemp
            },
            dt_txt: currentEachHour.dt_txt,
            length: eachDay.length,
            weather: [{
              icon: currentEachHour.weather[0].icon,
              description: currentEachHour.weather[0].description,
            }],

          }
        },
          {
            main: {
              temp: 0,
              temp_min: 0,
              temp_max: 0
            }
          })
      })

      console.log("final: ", dayWise)


      //                    innerHTML method 
      //         `
      //         <div class="forcastCard">
      //         <div class="day">${moment(eachDay.dt_txt).format("ddd")}</div>
      //         <img class="img" src="./img/116.webp" alt="">
      //         <div class="min">Min: ${Math.floor(eachDay.main.temp_min / eachDay.length)}</div>
      //         <div class="max">Max: ${Math.floor(eachDay.main.temp_max / eachDay.length)}</div>
      //         </div>
      // //         `



      dayWise.map(eachDay => {

        const forcastDiv = document.querySelector("#forcastDiv");

        let forcastCard = document.createElement("forcastCard")
        forcastCard.setAttribute("class", "forcastCard")
        forcastDiv.appendChild(forcastCard)

        let day = document.createElement("div")
        day.setAttribute("class", "day")
        day.appendChild(document.createTextNode(`${moment(eachDay.dt_txt).format("ddd")}`))
        forcastCard.appendChild(day)

        let img = document.createElement("img")
        img.setAttribute("src", `http://openweathermap.org/img/wn/${eachDay.weather[0].icon}@2x.png`)
        img.setAttribute("class", "img")
        forcastCard.appendChild(img)

        let description = document.createElement("div")
        description.setAttribute("class", "description")
        description.appendChild(document.createTextNode(`${eachDay.weather[0].description}`))
        forcastCard.appendChild(description)

        let min = document.createElement("div")
        min.setAttribute("class", "min")
        min.appendChild(document.createTextNode(`Min: ${Math.floor(eachDay.main.temp_min / eachDay.length)}` + "°C"))
        forcastCard.appendChild(min)

        let max = document.createElement("div")
        max.setAttribute("class", "max")
        max.appendChild(document.createTextNode(`Max: ${Math.ceil(eachDay.main.temp_max / eachDay.length)}` + "°C"))
        forcastCard.appendChild(max)


        if (forcastDiv.childNodes[6]) {
          forcastDiv.removeChild(forcastDiv.childNodes[1])

        }
      })
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
}