function stationInfo() {
    console.log("content loaded");

    var params = {
        "api_key": "327336c3b459437b953cfabe8b3583c3",
        /*"LineCode": "{string}",*/
    };

    $.ajax({
        url: "https://api.wmata.com/Rail.svc/json/jStations?" + $.param(params),
        type: "GET",
    })
    .done(function(data) {
        //alert("success");
        var select = '<option disabled selected>Select a Station:</option>';
        var stations = data.Stations;
        $.each(stations, function(i, item) {
            select += '<option value="'+item.Name+'">'+ item.Name +'</option>';
        });
        $("#station").html(select);
    })
    .fail(function() {
        alert("error");
    });
}

window.onload = stationInfo;
