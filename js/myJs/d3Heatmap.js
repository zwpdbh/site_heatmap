/**
 * Created by zw on 07/01/2017.
 */


function makeHeatMap(data) {
    console.log(data);
    var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");
    var timeFormatToDisplay = d3.timeFormat('%Y/%m/%d %H');

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


    var margin = 80;
    var block_width = 20;
    var block_height = 20;

    var contentY = [margin, 24 * block_height + margin];
    var contentX = [margin, totalDays * block_width + margin];
    var svgWidth = contentX[1] + margin;
    var svgHeight = contentY[1] + margin;
    var timeExtent = d3.extent(data, function (d) {
        return parseTime(d.time);
    });
    console.log(timeExtent);


    var xScale = d3.scaleLinear().domain([1, totalDays]).range(contentX);
    var yScale = d3.scaleLinear().domain([0, 23]).range(contentY);


    var timeScale = d3.scaleTime().domain(timeExtent).range(contentX);
    var xAxis = d3.axisTop(timeScale);


    var yAxisScale = d3.scaleLinear().domain([0, 23]).range([contentY[0], contentY[1]]);
    var yAxisValues = [];
    for (var i = 0; i < 24; i++) {
        yAxisValues.push(i);
    }
    var yAxis = d3.axisLeft(yAxisScale).tickValues(yAxisValues);



    // get the maximum power usage
    var bedroomsAndLoungeUsageExtent = d3.extent(data, function (d) {
        return d['mean_bedroomsAndLounge'];
    });
    // var heatPumpExtent = d3.extent(data, function (d) {
    //     return d['mean_heatPump'];
    // });

    //
    var colorScale = d3.scaleQuantize().domain([0, bedroomsAndLoungeUsageExtent[1]]).range(colorbrewer.Reds[7]);
    var svg = d3.select("#demo").select("svg");

    svg.style("width", svgWidth).style("height", svgHeight);


    var rect = svg.append("g")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return xScale(d.x);
        })
        .attr("y", function (d) {
            return yScale(d.y);
        })
        .attr("height", function () {
            return block_height;
        })
        .attr("width", function () {
            return block_width;
        })
        .style("fill", function (d) {
            return colorScale(d['mean_bedroomsAndLounge']);
        });

    // add axis
    svg.append("g")
        .attr("id", "xAxisG")
        .call(xAxis)
        .attr("transform", "translate(" + 0 + "," + (margin) +")");
    svg.append("g")
        .attr("id", "yAxisG")
        .attr("transform", "translate(" + margin + "," + (0) +")")
        .call(yAxis);

    svg.filter(function (d) {
        return d in data;
    });

    // add info on block
    rect.append("title")
        .text(function(d) {
            return  timeFormatToDisplay(d.dateTime) + " : "  + parseFloat(d["mean_bedroomsAndLounge"]).toFixed(2);
        });





}