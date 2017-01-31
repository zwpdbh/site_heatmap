/**
 * Created by zw on 07/01/2017.
 */

// event for select radio button


function makeHeatMap(data) {

    var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");
    var timeFormatToDisplay = d3.timeFormat('%Y/%m/%d %H');
    var svg = d3.select("#demo").select("svg");


    var maximumUsage = null;
    var category = "mean_" + "bedroomsAndLounge";


    // set the rect size
    var block_width = 20;
    var block_height = 20;

    var totalDays = Math.ceil((data.length) / 24);


    // pre-process data, to add some attribute on each data
    data[0].dateTime = parseTime(data[0]['time']);
    data[0].day = data[0].dateTime.getDate();

    var currentDay = data[0].day;
    var indexOfDay = 1;

    for (var i = 0; i < data.length; i++) {
        data[i].dateTime = parseTime(data[i].time);
        data[i].hour = data[i].dateTime.getHours();
        data[i].day = data[i].dateTime.getDate();

        if (currentDay != data[i].day) {
            currentDay = data[i].day;
            indexOfDay++;
        }
        data[i].x = indexOfDay;
        data[i].y = data[i].hour;
    }
    // end of pre-process data

    // set variables for svg, scales
    var timeExtent = d3.extent(data, function (d) {
        return parseTime(d.time);
    });


    var margin = 80;
    // var margin = {top: 200, right: 40, bottom: 200, left: 40};
    var hourlyDataAreaWidth = totalDays * block_width;
    var hourlyDataAreaHeight = 24 * block_height;


    var contentY = [margin, 24 * block_height + margin];
    var contentX = [margin, totalDays * block_width + margin];
    var svgWidth = contentX[1] + margin;
    var svgHeight = contentY[1] + margin;


    var xScale = d3.scaleLinear().domain([1, totalDays]).range(contentX);
    var yScale = d3.scaleLinear().domain([0, 23]).range(contentY);


    var timeScale = d3.scaleTime().domain(timeExtent).range(contentX);
    var xAxis = d3.axisTop(timeScale);


    // var yAxisScale = d3.scaleLinear().domain([0, 23]).range([contentY[0], contentY[1]]);
    var yAxisValues = [];
    for (i = 0; i < 24; i++) {
        yAxisValues.push(i);
    }
    var yAxis = d3.axisLeft(yScale).tickValues(yAxisValues);

    // get the maximum power usage
    function getMaxUsageAccordingTo(category) {
        var usageExtent = d3.extent(data, function (d) {
            return d[category];
        });
        return usageExtent[1];
    }

    // end of setting variables for SVG
    maximumUsage = getMaxUsageAccordingTo(category);


    // Begin: SVG
    svg.style("width", svgWidth).style("height", svgHeight);
    var colorScale = d3.scaleQuantize().domain([0, maximumUsage]).range(colorbrewer.Reds[9]);
    // draw rect
    var rect = svg.append("g")
        .attr("class", "hourlyDataRect")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr('class', 'hourlyData')
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
        });

    svg.append("g")
        .attr("class", "brush")
        .call(d3.brushX()
            .extent([[0, 0], contentX]));

    // add axis
    svg.append("g")
        .attr("class", "xAxisG")
        .call(xAxis)
        .attr("transform", "translate(" + 0 + "," + (margin) + ")");
    svg.append("g")
        .attr("class", "yAxisG")
        .attr("transform", "translate(" + margin + "," + (0) + ")")
        .call(yAxis);

    // rect for legend
    svg.append("g")
        .attr("class", "legendRect")
        .selectAll("rect")
        .data(function () {
            return colorbrewer.Reds[9];
        })
        .enter()
        .append("rect")
        .attr('class', 'legend')
        .attr('width', block_width * 2)
        .attr('height', block_height)
        .attr('x', function (d, i) {
            return margin + i * block_width * 2;  // the power usage number can be long, so make the rect twice width
        })
        .attr('y', function (d, i) {
            return margin / 3;
        })
        .style('fill', function (d, i) {
            return colorbrewer.Reds[9][i];
        });

    // ------------infomation that need to be redraw
    update();
    // ------------infomation that need to be redraw, END

    d3.selectAll('[name = selectUsage]').on('click', function () {
        category = "mean_" + $('input[name="selectUsage"]:checked').val();
        maximumUsage = getMaxUsageAccordingTo(category);
        console.log(category);
        update();
    });

    function update() {
        // fill the color of rect
        rect.style("fill", function (d) {
            return colorScale(d[category]);
        });

        // add info on block
        $('.title').remove();
        rect.append("title")
            .text(function (d) {
                return timeFormatToDisplay(d.dateTime) + " : " + parseFloat(d[category]).toFixed(2);
            }).attr('class', 'title');

        // add the description
        var xScaleForDescription = d3.scaleLinear().domain([0, maximumUsage]).range([margin, margin + 9 * block_width * 2]);
        var xAxisForDescription = d3.axisTop(xScaleForDescription).tickSize(0);

        // add xAxisForDescription
        $('.xScaleForDescriptionG').remove();
        svg.append("g")
            .attr("class", "xScaleForDescriptionG")
            .attr("transform", "translate(" + 0 + "," + (margin / 3) + ")")
            .call(xAxisForDescription);
    }

}


function makeAnotherHeatmap(data) {
    // pre-process data, to add some attribute on each data
    var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");
    var timeFormatToDisplay = d3.timeFormat('%Y/%m/%d %H');

    data[0].dateTime = parseTime(data[0]['time']);
    data[0].day = data[0].dateTime.getDate();

    var currentDay = data[0].day;
    var indexOfDay = 1;

    var maximumUsage = null;
    var category = "mean_" + "bedroomsAndLounge";

    for (var i = 0; i < data.length; i++) {
        data[i].dateTime = parseTime(data[i].time);
        data[i].hour = data[i].dateTime.getHours();
        data[i].day = data[i].dateTime.getDate();

        if (currentDay != data[i].day) {
            currentDay = data[i].day;
            indexOfDay++;
        }
        // each data point is arranged by each column is each day
        // each row is each hour in a day.
        data[i].x = indexOfDay;
        data[i].y = data[i].hour;
    }
    var totalDays = Math.ceil((data.length) / 24);
    // end of pre-process data


    // set variables for svg, scales
    var rectWidth = 10;
    var margin = {top: 80, left: 80, bottom: 80, right: 80};

    var hourlyUsageCanvasWidth = totalDays * rectWidth;
    var hourlyUsageCanvasHeight = 500 - margin.top - margin.bottom;

    var svg = d3.select("#demo").select("svg")
        .attr("width", function () {
            return hourlyUsageCanvasWidth + margin.left + margin.right;
        })
        .attr("height", function () {
            return hourlyUsageCanvasHeight + margin.top + margin.bottom;
        });


    var timeExtent = d3.extent(data, function (d) {
        return parseTime(d.time);
    });

    var xTimeScale = d3.scaleTime().domain(timeExtent).range([0, hourlyUsageCanvasWidth]);
    var xScale = d3.scaleLinear().domain([1, totalDays]).range([0, hourlyUsageCanvasWidth]);
    var yScale = d3.scaleLinear().domain([0, 23]).range([0, hourlyUsageCanvasHeight]);

    // get the maximum power usage
    function getMaxUsageAccordingTo(category) {
        var usageExtent = d3.extent(data, function (d) {
            return d[category];
        });
        return usageExtent[1];
    }

    maximumUsage = getMaxUsageAccordingTo(category);
    var colorScale = d3.scaleQuantize().domain([0, maximumUsage]).range(colorbrewer.Reds[9]);

    // end of setting variables for SVG


    // ========= "hourlyDataRect"
    var hourlyUsageCanvas = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var hourlyUsageRect = hourlyUsageCanvas.append("g")
        .attr("class", "hourlyUsageCanvas")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "hourlyUsageRect")
        .attr("x", function (d) {
            return xScale(d.x);
        })
        .attr("y", function (d) {
            return yScale(d.y);
        })
        .attr("height", function () {
            return hourlyUsageCanvasHeight / 24;
        })
        .attr("width", function () {
            return hourlyUsageCanvasWidth / totalDays;
        });

    // add axis
    hourlyUsageCanvas.append("g")
        .attr("class", "xAxisG")
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .call(d3.axisTop(xTimeScale)
            .ticks(d3.timeWeek)
            .tickPadding(5));

    var yAxisValues = [];
    for (i = 0; i < 24; i++) {
        yAxisValues.push(i);
    }
    hourlyUsageCanvas.append("g")
        .attr("class", "yAxisG")
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .call(d3.axisLeft(yScale)
            .tickValues(yAxisValues));

    // ====== end of "hourlyDataRect"


    // ==== legend part
    var legendCanvas = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")");


    var legendCanvasRectWidth = rectWidth * 4;
    var legendCanvasWidth = legendCanvasRectWidth * 9;
    legendCanvas.append("g")
        .attr("class", "legendRect")
        .selectAll("rect")
        .data(function () {
            return colorbrewer.Reds[9];
        })
        .enter()
        .append("rect")
        .attr('width', legendCanvasRectWidth)
        .attr('height', hourlyUsageCanvasHeight / 24)
        .attr('x', function (d, i) {
            return margin.left + i * legendCanvasRectWidth;  // the power usage number can be long, so make the rect twice width
        })
        .attr('y', margin.top / 3)
        .style('fill', function (d, i) {
            return colorbrewer.Reds[9][i];
        });



    // ========= end of legend part



    // ------------infomation that need to be redraw
    update();
    // ------------infomation that need to be redraw, END

    d3.selectAll('[name = selectUsage]').on('click', function () {
        category = "mean_" + $('input[name="selectUsage"]:checked').val();
        maximumUsage = getMaxUsageAccordingTo(category);
        console.log(category);
        update();
    });

    function update() {
        // update the color of rect
        hourlyUsageRect.style("fill", function (d) {
            return colorScale(d[category]);
        });

        // update hourly detail info on rect
        $('.title').remove();
        hourlyUsageRect.append("title")
            .text(function (d) {
                return timeFormatToDisplay(d.dateTime) + " : " + parseFloat(d[category]).toFixed(2);
            }).attr('class', 'title');



        // update the legend Axis
        var xScaleForDescription = d3.scaleLinear().domain([0, maximumUsage]).range([0, legendCanvasWidth]);
        $('.xScaleForDescriptionG').remove();
        legendCanvas.append("g")
            .attr("transform", "translate(" + margin.left + "," + 25 + ")")
            .attr("class", "xScaleForDescriptionG")
            .call(d3.axisTop(xScaleForDescription).tickSize(0));
    }
}


