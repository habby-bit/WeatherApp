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

                var city = $("<p>").text(cityText + " (" + moment().format('l') + ")").append(icon)
                var temp = $("<p>").text("Temperature: " + response.current.temp)
                var humidity = $("<p>").text("Humidity: " + response.current.humidity)
                var wind = $("<p>").text("Wind Speed: " + response.current.wind_speed)
                var uvi = $("<p>").text("UV Index: " + response.current.uvi)

                currentDiv.append(city, temp, humidity, wind, uvi)

                currentStats.addClass("jumbotron jumbotron-fluid")
                currentStats.append(currentDiv)

                forecast.text("")

                for (var i=0; i<5; i++) {

                    var futureStat = $("<li>") 

                    var day = $("<p>").text(moment().add((i+1), 'days').format('l'));

                    var ficonCode = response.daily[i].weather[0].icon
                    var ficon = $("<img>")
                    var ficonLink = "http://openweathermap.org/img/wn/" + ficonCode + "@2x.png"
                    ficon.attr("src", ficonLink)

                    var fTemp = $("<p>").text("Temp: " + response.daily[i].temp.day);
                    var fHum = $("<p>").text("Humidity: " + response.daily[i].humidity);

                    futureStat.append(day, ficon, fTemp, fHum)
                    futureStat.addClass("list-group-item mr-3 futBox")

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