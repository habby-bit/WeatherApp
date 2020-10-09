$(document).ready(function() {
    var cityInput = $("#cityText")
    var searchBtn = $("#searchBtn")
    var citySearch = $("#citySearch")
    var cityList = $("#cityList")

    var cities =[]
    console.log('cities:', cities)
    
    renderCity();

    // Render a new list item for each city
    function renderCity() {
        cityList.text("");

        for (var i=0; i < cities.length; i++) {
            var city = cities[i];
            console.log('city:', city)

            var cityBtn = $("<button>");
            cityBtn.addClass("list-group-item list-group-item-action")
            cityBtn.text(city)

            cityList.append(cityBtn)
        }
    }

    //Render the Weather Dashboard
    function renderWeather() {

        cityText = cityInput.val();
        console.log('cityText:', cityText)

        //Constructing the queryURL with the city name
        var queryURL = "api.openweathermap.org/data/2.5/weather?q=" + cityText +  "&appid=c64bb7a089eff4f5f10b6286807da6d0";

        // Performing the ajax request with queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        })

        .then(function(response) {
            console.log(queryURL)
            console.log(response)
        });
    }

    // When the city is searched...
    citySearch.submit(function() {
        var cityText = cityInput.val();
        console.log('cityText:', cityText)

        if (cityText === "") {
            return;
        }

        cities.push(cityText);
        // cityInput.val("")

        renderCity();
        renderWeather();
    });

});