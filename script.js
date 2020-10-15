$(document).ready(function() {
    var cityInput = $("#cityText")
    var searchBtn = $("#searchBtn")
    var citySearch = $("#citySearch")
    var cityList = $("#cityList")
    var currentStats = $("#currentStats")
    var forecast = $("#forecast")

    var cities =[]
    
    renderCity();

    // Render a new list item for each city
    function renderCity() {
        cityList.text("");

        for (var i=0; i < cities.length; i++) {
            var city = cities[i];

            var cityBtn = $("<button>");
            cityBtn.addClass("list-group-item list-group-item-action cityButton")
            cityBtn.text(city)

            cityList.append(cityBtn)
        }
    }

    //Render the Weather Dashboard


    $(document).on("click", ".cityButton", (function() {
        var prevCity = this.innerHTML
        cityText = prevCity
        renderWeather(cityText)
    }));


    function renderWeather(cityText) {


        //Constructing the queryURL with the city name
        var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityText + '&appid=c64bb7a089eff4f5f10b6286807da6d0';

        // Performing the ajax request with queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        })

        .then(function(response) {
            console.log(queryURL)
            console.log('response:', response)

            currentStats.text("")
        
            var lat = response.coord.lat
            var lon = response.coord.lon

            var forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=&appid=c64bb7a089eff4f5f10b6286807da6d0"

            $.ajax({
                url: forecastURL,
                method: "GET"
            })

            .then(function(response) {
                console.log(forecastURL)
                console.log('response:', response)

                currentDiv = $("<div>")

                var iconCode = response.current.weather[0].icon
                var icon = $("<img>")
                var iconLink = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
                icon.attr("src", iconLink)

                var city = $("<h2>").text(cityText + " (" + moment().format('l') + ")").append(icon)
                var temp = $("<h5>").text("Temperature: " + response.current.temp.toFixed(1) + " °F")
                var humidity = $("<h5>").text("Humidity: " + response.current.humidity + "%")
                var wind = $("<h5>").text("Wind Speed: " + response.current.wind_speed + " MPH")

                var uviNum = response.current.uvi
                var uviP = $("<h5>").text(uviNum).attr("id","uviNum")

                if (uviNum <= 2) {
                    uviP.addClass("uviNumG")
                }
                else if (uviNum > 2 && uviNum < 7) {
                    uviP.addClass("uviNumY")
                }
                else if (uviNum >= 7) {
                    uviP.addClass("uviNumR")
                }

                var uvi = $("<h5>").text("UV Index: ").append(uviP).attr("id","uvi")
                
                currentDiv.append(city, temp, humidity, wind, uvi)

                currentStats.addClass("jumbotron jumbotron-fluid")
                currentStats.append(currentDiv)

                forecast.text("")

                for (var i=0; i<5; i++) {

                    var futureStat = $("<li>") 

                    var day = $("<h5>").text(moment().add((i+1), 'days').format('l'));

                    var ficonCode = response.daily[i].weather[0].icon
                    var ficon = $("<img>")
                    var ficonLink = "http://openweathermap.org/img/wn/" + ficonCode + "@2x.png"
                    ficon.attr("src", ficonLink)

                    var fTemp = $("<h6>").text("Temp: " + response.daily[i].temp.day.toFixed(1) + " °F");
                    var fHum = $("<h6>").text("Humidity: " + response.daily[i].humidity + "%");

                    futureStat.append(day, ficon, fTemp, fHum)
                    futureStat.addClass("list-group-item futBox")

                    futureStat.attr("id", "fbox"+i)

                    forecast.append(futureStat)
                }
            });

        });





    }

    // When the city is searched...
    citySearch.submit(function(event) {
        event.preventDefault();

        var cityText = cityInput.val();

        if (cityText === "") {
            return;
        }

        cities.push(cityText);
        console.log('cities:', cities)
        
        renderCity();
        renderWeather(cityText);

        cityInput.val("")

    });

});