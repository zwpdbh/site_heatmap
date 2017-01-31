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


    var yAxisScale = d3.scaleLinear().domain([0, 23]).range([contentY[0], contentY[1]]);
    var yAxisValues = [];
    for (i = 0; i < 24; i++) {
        yAxisValues.push(i);
    }
    var yAxis = d3.axisLeft(yAxisScale).tickValues(yAxisValues);

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

    // function brushended() {
    //     if (!d3.event.sourceEvent) return; // Only transition after input.
    //     if (!d3.event.selection) return; // Ignore empty selections.
    //     var d0 = d3.event.selection.map(x.invert),
    //         d1 = d0.map(d3.timeDay.round);
    //
    //     // If empty when rounded, use floor & ceil instead.
    //     if (d1[0] >= d1[1]) {
    //         d1[0] = d3.timeDay.floor(d0[0]);
    //         d1[1] = d3.timeDay.offset(d1[0]);
    //     }
    //
    //     d3.select(this).transition().call(d3.event.target.move, d1.map(x));
    // }

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
    var svg = d3.select("#demo").select("svg");
    var svgWidth = svg.attr("width");
    var svgHeight = svg.attr("height");

    var margin = {top: 200, right: 40, bottom: 200, left: 40};
    var hourlyDataContentWidth = svgWidth - margin.left - margin.right;
    var hourlyDataContentHeight = svgHeight - margin.top - margin.bottom;

    var timeExtent = d3.extent(data, function (d) {
        return parseTime(d.time);
    });

    var xTimeScale = d3.scaleTime().domain(timeExtent).range([0, hourlyDataContentWidth]);

}


