/**
 * Created by zw on 04/02/2017.
 */

function drawHeatmapForDetail(data) {
    console.log(data.length);

   $('.detailUsageCanvas').remove();

    var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");
    // var timeFormatToDisplay = d3.timeFormat('%Y/%m/%d %H');

    var marginForDetail = {top: 80, left: 80, bottom: 80, right: 80};
    var detailSVGWidth = 960;
    var detailSVGHeight = 500;
    var detailUsageCanvasHeight = detailSVGHeight - marginForDetail.top - marginForDetail.bottom;
    var detailUsageCanvasWidth = detailSVGWidth - marginForDetail.left - marginForDetail.right;
    var svg = d3.select("#demo").select("#detailsvg")
        .attr("width", detailSVGWidth)
        .attr("height", detailSVGHeight);

    var detailUsageCanvas = svg.append("g")
        .attr("class", "detailUsageCanvas")
        .attr("transform", "translate(" + marginForDetail.left + "," + marginForDetail.top + ")");



    var xTimeScale = d3.scaleTime()
        .domain(d3.extent(data, function (d) {
            return parseTime(d.time);
        }))
        .rangeRound([0, detailUsageCanvasWidth]);


    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d[selectedType];
        })])
        .rangeRound([detailUsageCanvasHeight, 0]);

    var area = d3.area()
        .x(function (d) {
            return xTimeScale(parseTime(d.time));
        })
        .y0(yScale(0))
        .y1(function (d) {
            return yScale(d[selectedType]);
        });

    detailUsageCanvas.append("path")
        .datum(data)
        .attr("fill", "steelblue")
        .attr("d", area);

    detailUsageCanvas.append("g")
        .attr("class", "xAxisG")
        .attr("transform", "translate(0," + detailUsageCanvasHeight + ")")
        .call(d3.axisBottom(xTimeScale).ticks(d3.day));

    detailUsageCanvas.append("g")
        .attr("class", "yAxisG")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("PowerUsage: " + selectedType);
}