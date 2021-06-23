$(document).ready(function() {
    const cityInput = $("#cityText")
    const citySearch = $("#citySearch")
    const cityList = $("#cityList")
    const currentStats = $("#currentStats")
    const forecast = $("#forecast")
    const forecastText = $("#forecastText")

    const LOCAL_STORAGE_LIST_KEY = 'city.list'
    const LOCAL_STORAGE_SELECTED_CITY_ID_KEY = 'city.selectedListId'


    let cities = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
    let cityText = localStorage.getItem(LOCAL_STORAGE_SELECTED_CITY_ID_KEY)

    renderCity();
    renderWeather(cityText);

    // Render a new list item for each city
    function renderCity() {
        cityList.text("");

        for (let i=0; i<cities.length; i++) {
            
            const city = cities[i];

            const cityBtn = $("<button>");
            
            cityBtn.addClass("list-group-item list-group-item-action cityButton")
            cityBtn.text(city)

            cityList.append(cityBtn)
        }
    }

    //Render the Weather Dashboard
    $(document).on("click", ".cityButton", (function() {
        const prevCity = this.innerHTML
        cityText = prevCity
        localStorage.setItem(LOCAL_STORAGE_SELECTED_CITY_ID_KEY, cityText)
        renderWeather(cityText)
    }));

    function renderWeather(cityText) {

        //Constructing the queryURL with the city name
        const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityText}&appid=c64bb7a089eff4f5f10b6286807da6d0`;

        // Performing the ajax request with queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        })

        .then(function(response) {

            // Clearing the dashboard to allow it to contain the new city information
            currentStats.text("")
        
            const lat = response.coord.lat
            const lon = response.coord.lon

            // Constructing the forecastURL with the lat and lon coordinates 
            const forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=&appid=c64bb7a089eff4f5f10b6286807da6d0`
            console.log('forecastURL:', forecastURL)

            // Performing the ajax request with forecastURL
            $.ajax({
                url: forecastURL,
                method: "GET"
            })

            .then(function(response) {

                // Creating and assigning value/text to each information variable
                currentDiv = $("<div>")

                const iconCode = response.current.weather[0].icon
                const icon = $("<img>")
                const iconLink = `http://openweathermap.org/img/wn/${iconCode}@2x.png`
                icon.attr("src", iconLink)

                const city = $("<h2>").text(cityText + " (" + moment().format('l') + ")").append(icon)
                const temp = $("<h5>").text("Temperature: " + response.current.temp.toFixed(1) + " °F")
                const humidity = $("<h5>").text("Humidity: " + response.current.humidity + "%")
                const wind = $("<h5>").text("Wind Speed: " + response.current.wind_speed + " MPH")

                const uviNum = response.current.uvi
                const uviP = $("<h5>").text(uviNum).attr("id","uviNum")

                // Determining the health level of the UV Index and assigning the appropriate class
                if (uviNum <= 2) {
                    uviP.addClass("uviNumG")
                }
                else if (uviNum > 2 && uviNum < 7) {
                    uviP.addClass("uviNumY")
                }
                else if (uviNum >= 7) {
                    uviP.addClass("uviNumR")
                }

                const uvi = $("<h5>").text("UV Index: ").append(uviP).attr("id","uvi")
                
                // Appending all of the information to the current weather div
                currentDiv.append(city, temp, humidity, wind, uvi)

                currentStats.addClass("jumbotron jumbotron-fluid")

                // Appending all of the information to the page
                currentStats.append(currentDiv)

                // Clearing the forecast to allow it to contain the new city information
                forecast.text("")

                // Appending the title to the 5 day forecast
                forecastText.text("5 Day Forecast: ")

                // Looping through to append the information for each day in the forecast
                for (let i=0; i<5; i++) {

                    // Creating and assigning value/text to each information variable
                    const futureStat = $("<li>") 

                    const day = $("<h5>").text(moment().add((i+1), 'days').format('l'));

                    const ficonCode = response.daily[i].weather[0].icon
                    const ficon = $("<img>")
                    const ficonLink = `http://openweathermap.org/img/wn/${ficonCode}@2x.png`
                    ficon.attr("src", ficonLink)

                    const fTemp = $("<h6>").text("Temp: " + response.daily[i].temp.day.toFixed(1) + " °F");
                    const fHum = $("<h6>").text("Humidity: " + response.daily[i].humidity + "%");

                    // Appending all of the information to the specific day
                    futureStat.append(day, ficon, fTemp, fHum)
                    futureStat.addClass("list-group-item futBox")

                    // Assiging each day a unique id for later styling
                    futureStat.attr("id", "fbox"+i)

                    // Appending all of the information to the page
                    forecast.append(futureStat)
                }
            });
        });
    }

    // When the city is searched...
    citySearch.submit(function(event) {
        event.preventDefault();

        const cityText = cityInput.val();
        console.log('cityText:', cityText)

        if (cityText === "") {
            return;
        }

        cities.push(cityText);
        localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(cities))
        
        renderCity();
        renderWeather(cityText);

        cityInput.val("")
    });
});