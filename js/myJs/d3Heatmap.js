/**
 * Created by zw on 07/01/2017.
 */


function makeHeatMap(data) {
    console.log(data);
    var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");

    data.forEach(function (d) {
        d.dateTime = parseTime(d.time);
        d.day = d.dateTime.getDate();
        d.hour = d.dateTime.getHours();

        d.x = d.day;
        d.y = d.hour;
    });


    var totalHours = data.length;
    var totalDays = Math.ceil(totalHours / 24);
    var startDay = data[0].day;
    var endDay = data[totalHours - 1].day;

    console.log(totalHours);


    var svgHeight = 500;
    var svgWidth = 500 > totalDays * 10 ? 500 : totalDays * 10;
    var margin = 50;
    


    var xScale = d3.scaleLinear().domain([1, totalDays]).range([margin, svgWidth]);
    var yScale = d3.scaleLinear().domain([0, 23]).range([margin, svgHeight- margin]);


    var xAxisScale = d3.scaleLinear().domain([startDay, endDay]).range([margin, svgWidth]);
    var yAxisScale = d3.scaleLinear().domain([0, 23]).range([margin, svgHeight - margin]);

    var xAxis = d3.axisBottom(xAxisScale).tickSize(svgHeight - margin - margin + 10).tickValues(svgHeight);
    var yAxis = d3.axisRight(yAxisScale).tickSize(svgWidth - margin + 10).tickValues(svgWidth);

    // get the maximum power usage
    var bedroomsAndLoungeUsageExtent = d3.extent(data, function (d) {
        return d['mean_bedroomsAndLounge'];
    });
    // var heatPumpExtent = d3.extent(data, function (d) {
    //     return d['mean_heatPump'];
    // });

    //
    var colorScale = d3.scaleQuantize().domain([0, bedroomsAndLoungeUsageExtent[1]]).range(colorbrewer.Reds[7]);
    //
    //
    //
    // svg.append("g")
    // // .attr("transform", "translate(" + margin + "," + margin +")")
    //     .selectAll("rect")
    //     .data(processedHourlyData)
    //     .enter()
    //     .append("rect")
    //     .attr("x", function (d) {
    //         return xScale(d.x);
    //     })
    //     .attr("y", function (d) {
    //         return yScale(d.y);
    //     })
    //     .attr("width", function () {
    //         return blockWidth;
    //     })
    //     .attr("height", function () {
    //         return blockHeight;
    //     })
    //     .style("fill", function (d) {
    //         return colorScale(d.laundrayAndGarage);
    //     });
    //
    // add axis
    var svg = d3.select("#demo").select("svg")
    svg.append("g")
        .attr("id", "xAxisG")
        .call(xAxis)
        .attr("transform", "translate(" + 0 + "," + (margin) +")");
    svg.append("g")
        .attr("id", "yAxisG")
        .attr("transform", "translate(" + margin + "," + (0) +")")
        .call(yAxis);


}