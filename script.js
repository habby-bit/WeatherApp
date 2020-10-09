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
            cityBtn.addClass("list-group-item list-group-item-action")
            cityBtn.text(city)

            cityList.append(cityBtn)
        }
    }

    //Render the Weather Dashboard
    function renderWeather() {

        cityText = cityInput.val();

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

            var forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=&appid=c64bb7a089eff4f5f10b6286807da6d0"

            $.ajax({
                url: forecastURL,
                method: "GET"
            })

            .then(function(response) {
                console.log(forecastURL)
                console.log('response:', response)

                currentDiv = $("<div>")

                // var p = $("<p>").text("Rating: " + results[i].rating);

                var temp = $("<p>").text("Temperature: " + response.current.temp)
                var humidity = $("<p>").text("Humidity: " + response.current.humidity)
                var wind = $("<p>").text("Wind Speed: " + response.current.wind)
                var uvi = $("<p>").text("UV Index: " + response.current.uvi)

                currentDiv.append(cityText + " (" + moment().format('l') + ")")
                currentDiv.append(temp, humidity, wind, uvi)

                currentStats.append(currentDiv)
                
                
                // var date = response.daily[0].date

                // add1 = moment().add(1, 'days').format('l');;
                // add2 = moment().add(2, 'days').format('l');;
                // add3 = moment().add(3, 'days').format('l');;
                // add4 = moment().add(4, 'days').format('l');;
                // add5 = moment().add(5, 'days').format('l');;


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
        
        renderCity();
        renderWeather();

        cityInput.val("")

    });

});