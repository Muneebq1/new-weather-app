
let cityName = "karachi"

axios.get('https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=a87b897713922e0dae12cddf4a37b07f&units=metric')
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
          return  eachDay.reduce((previousEachHour, currentEachHour) => {

                let sum = Number(previousEachHour.main.temp) + Number(currentEachHour.main.temp)
                let sumMinTemp = Number(previousEachHour.main.temp_min) + Number(currentEachHour.main.temp_min)
                let sumMaxTemp = Number(previousEachHour.main.temp_max) + Number(currentEachHour.main.temp_max)

                return {
                    main: {
                        temp: sum,
                        temp_min: sumMinTemp,
                        temp_max: sumMaxTemp
                    },
                    length: eachDay.length
                }}, 
            {
                main: {
                    temp: 0,
                    temp_min: 0,
                    temp_max: 0
                }
            })
        })

 console.log("final: ", dayWise)

    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })