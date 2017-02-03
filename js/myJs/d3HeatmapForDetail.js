/**
 * Created by zw on 04/02/2017.
 */


function drawHeatmapForDetail(data) {
    console.log(data[0]);
    console.log(data[data.length - 1]);

    // ===== svg part for detail
    var margin = {top: 80, left: 80, bottom: 80, right: 80};
    var detailSVGWidth = 960;
    var detailSVGHeight = 500;
    var detailUsageCanvasHeight = detailSVGHeight - margin.top - margin.bottom;
    var detailUsageCanvasWidth = detailSVGWidth - margin.left - margin.right;

    var svg = d3.select("#demo").select("#detailsvg")
        .attr("width", detailSVGWidth)
        .attr("height", detailSVGHeight);


    var detailUsageCanvas = svg.append("g")
        .attr("class", "detailUsageCanvas")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}