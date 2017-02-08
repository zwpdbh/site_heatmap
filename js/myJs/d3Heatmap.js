/**
 * Created by zw on 07/01/2017.
 */

// event for select radio button

var selectedType = "";

function makeHeatmapForHourlyData(data) {
    // pre-process data, to add some attribute on each data
    var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");
    var getWhichDay = d3.timeParse("%Y-%m-%d");
    var timeFormatToDisplay = d3.timeFormat('%Y/%m/%d %H');

    var indexOfDay = 1;
    var currentDay = parseTime(data[0].time).getDate();

    for (var i = 0; i < data.length; i++) {
        data[i].dateTime = parseTime(data[i].time);
        data[i].hour = data[i].dateTime.getHours();
        data[i].day = data[i].dateTime.getDate();
        data[i].whichDay = getWhichDay(data[i].time.slice(0, 10));

        if (currentDay != data[i].day) {
            currentDay = data[i].day;
            indexOfDay++;
        }
        // each data point is arranged by each column is each day
        // each row is each hour in a day.
        data[i].x = indexOfDay;
        data[i].y = data[i].hour;
    }

    // var totalDays = Math.ceil((data.length) / 24); wrong !
    var totalDays = indexOfDay;

    var maximumUsage = null;
    selectedType = "bedroomsAndLounge";
    var category = "mean_" + selectedType;
    // end of pre-process data


    // set variables for svg, scales

    var margin = {top: 80, left: 80, bottom: 80, right: 80};

    var rectWidth = 40;
    var svgHeight = 500;
    var svgWidth = margin.left + totalDays * rectWidth + margin.right;
    var hourlyUsageCanvasWidth = svgWidth - margin.left - margin.right;
    var hourlyUsageCanvasHeight = svgHeight - margin.top - margin.bottom;
    var rectHeight = hourlyUsageCanvasHeight / 24;


    var svg = d3.select("#hourlyDataSVGContainer")
        .append("svg")
        .attr("id", "svgForHourlyData")
        .style("background-color", "aliceblue")
        .attr("width", function () {
            return svgWidth;
        })
        .attr("height", function () {
            return svgHeight;
        });


    var timeExtent = d3.extent(data, function (d) {
        return d.whichDay;
    });


    var xScale = d3.scaleTime().domain(timeExtent).rangeRound([0, hourlyUsageCanvasWidth]);
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
        .attr("class", "hourlyUsageCanvas")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var hourlyUsageRect = hourlyUsageCanvas.append("g")
        .attr("class", "hourlyUsageCanvas")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "hourlyUsageRect")
        .attr("x", function (d) {
            return xScale(d.whichDay);
        })
        .attr("y", function (d) {
            return yScale(d.y);
        })
        .attr("height", function () {
            return rectHeight;
        })
        .attr("width", function () {
            return rectWidth;
        });

    // === add axis
    hourlyUsageCanvas.append("g")
        .attr("class", "xAxisG")
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .call(d3.axisTop(xScale)
            .ticks(d3.timeDay)
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

    // d3-brush
    var brush = d3.brushX()
    // .x(xScale)
    // .extent([0, hourlyUsageCanvasWidth + rectWidth])
        .extent([[0, 0], [hourlyUsageCanvasWidth + rectWidth, hourlyUsageCanvasHeight + rectHeight]])
        .on("end", brushed);

    hourlyUsageCanvas.append("g")
        .attr("id", "brushSelection")
        .call(brush);


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

    $('#selectionForType').on('change', function () {
        selectedType = $(this).val();
        category = "mean_" + selectedType;
        maximumUsage = getMaxUsageAccordingTo(category);
        update();
    });

    $('#selectionForyear').on('change', function () {
        var selectedYear = $(this).val();
        getSelectionRange(selectedYear);
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


    function brushed() {
        if (!d3.event.sourceEvent) return; // Only transition after input.
        if (!d3.event.selection) return; // Ignore empty selections.

        var start = d3.event.selection[0];
        var end = d3.event.selection[1];


        // var brushSelectionWidth = d3.select("#brushSelection")
        //     .selectAll("rect")
        //     .select(function (d, i) {
        //         if (d.type == "selection") {
        //             // this is the "rect" with class "selection"
        //             return this;
        //         } else {
        //             return null;
        //         }
        //     }).style("width");


        // if (brushSelectionWidth > rectWidth * 4) {
        //     d3.select("#brushSelection")
        //         .selectAll("rect")
        //         .select(function (d, i) {
        //             if (d.type == "selection") {
        //                 console.log(this);
        //                 return this;
        //             } else {
        //                 return null;
        //             }
        //         }).style("width", rectWidth * 4);
        // }


        d3.select("#brushSelection")
            .selectAll("rect")
            .select(function (d, i) {
                if (d.type == "selection") {
                    // this is the "rect" with class "selection"
                    return this;
                } else {
                    return null;
                }
            }).style("width", function (d) {
                return rectWidth * 3;
            //
            // var rightPosition = d3.select("#brushSelection").selectAll("rect").select(function (d) {
            //     if (d.type == "e") {
            //         // console.log(this);
            //         return this;
            //     } else {
            //         return null;
            //     }
            // }).style("x");
            //
            // var leftPosition = d3.select("#brushSelection").selectAll("rect").select(function (d) {
            //     if (d.type == "w") {
            //         // console.log(this);
            //         return this;
            //     } else {
            //         return null;
            //     }
            // }).style("x");
            // var leftP = leftPosition.substr(0, leftPosition.length - 2);
            // var rightP = rightPosition.substring(0, rightPosition.length - 2);
            // // console.log(leftPosition, rightPosition);
            // // console.log(rightP - leftP);
            // if ((rightP - leftP) > rectWidth * 4) {
            //     return rectWidth * 4
            // } else {
            //     return rightP - leftP;
            // }
        });
        var d0 = d3.event.selection.map(xScale.invert);

        // if the selection range is too big, limit its selection
        // if (Math.abs(end - start) > rectWidth * 6) {
        //     var d0 = [start, start + rectWidth * 6].map(xScale.invert);
        // } else {
        //     d0 = d3.event.selection.map(xScale.invert);
        // }

        var d1 = d0.map(d3.timeDay);
        // If empty when rounded, use floor & ceil instead.
        // d1[0] and d1[1] are String
        if (d1[0] >= d1[1]) {
            d1[0] = d3.timeDay.ceil(d0[0]);
            d1[1] = d3.timeDay.offset(d1[0]);
        }

        d3.select(this).transition().call(d3.event.target.move, d1.map(xScale));
        drawDetailBetween(d1);
    }


    function drawDetailBetween(selection) {
        $.ajax('../../ajaxGetUsageData.php', {
            type: 'POST',
            data: {'tag': "detail", "selection": selection},
            success: function (data) {
                var usageData = $.parseJSON(data);
                drawHeatmapForDetail(usageData);
                // $('.container').append(data);
            }
        });
    }
}


// === helper function
function getSelectionRange(selectedYear) {
    var start = selectedYear + "-01-01";
    var end = selectedYear + "-12-31";

    $.ajax('../../ajaxGetUsageData.php', {
        type: 'POST',
        data: {"tag": "year", "selection": [start, end]},
        success: function (data) {
            var usageData = $.parseJSON(data);
            $('#svgForHourlyData').remove();
            $('#selectionForType').val("bedroomsAndLounge");
            makeHeatmapForHourlyData(usageData);
            // $('.container').append(data);
        }
    });
}





