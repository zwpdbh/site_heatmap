/**
 * Created by zw on 07/01/2017.
 */


function makeHeatMap(data) {
    console.log(data);
    var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");

    // // process the data, to set useful attributes
    //
    // data.forEach(function (d) {
    //     d.dateTime = parseTime(d.date);
    //     d.day = d.dateTime.getDate();
    //     d.month = d.dateTime.getMonth();
    //     d.year = d.dateTime.getFullYear();
    //     d.hour = d.dateTime.getHours();
    //     d.min = d.dateTime.getMinutes();
    //
    //     d.x = d.day;
    //     d.y = d.hour;
    //
    // });
    //
    // var totalNum = data.length;
    // var previousOne = data[0];
    // var processedHourlyData = [];
    // var tmp = [];
    // var maxUsage = 0;
    //
    //
    // // calculate data per hourly and store them in processedHourlyData
    // tmp.push(previousOne);
    // for (var i = 1; i < totalNum; i++) {
    //     var currentOne = data[i];
    //     // be careful, when the loop end, there will be some data left in the tmp, do not forget to process them.
    //     if (previousOne.hour == currentOne.hour) {
    //         tmp.push(currentOne);
    //     } else {
    //         var hourlyData = tmp[0];
    //         var count = tmp.length;
    //         for (var j = 1; j < count; j++) {
    //             hourlyData.laundrayAndGarage = parseFloat(hourlyData.laundrayAndGarage) + parseFloat(tmp[j].laundrayAndGarage);
    //             hourlyData.heatPump = parseFloat(hourlyData.heatPump) + parseFloat(tmp[j].heatPump);
    //             hourlyData.incomerAll = parseFloat(hourlyData.incomerAll) +  parseFloat(tmp[j].incomerAll);
    //             hourlyData.ovenAll = Math.abs(parseFloat(hourlyData.ovenAll)) + Math.abs(parseFloat(tmp[j].ovenAll));
    //             hourlyData.kitchenApplicance = parseFloat(hourlyData.kitchenApplicance) + parseFloat(tmp[j].kitchenApplicance);
    //             hourlyData.bedroomAndLounge = parseFloat(hourlyData.bedroomAndLounge) + parseFloat(tmp[j].bedroomAndLounge);
    //         }
    //         hourlyData.laundrayAndGarage = parseFloat(hourlyData.laundrayAndGarage) / count;
    //         hourlyData.heatPump = parseFloat(hourlyData.heatPump) / count;
    //         hourlyData.incomerAll = parseFloat(hourlyData.incomerAll) / count;
    //         hourlyData.ovenAll = parseFloat(hourlyData.ovenAll)  / count;
    //         hourlyData.kitchenApplicance = parseFloat(hourlyData.kitchenApplicance) / count;
    //         hourlyData.bedroomAndLounge = parseFloat(hourlyData.bedroomAndLounge)  / count;
    //         processedHourlyData.push(hourlyData);
    //
    //         maxUsage = d3.max([maxUsage,
    //             hourlyData.laundrayAndGarage,
    //             hourlyData.heatPump,
    //             hourlyData.incomerAll,
    //             hourlyData.ovenAll,
    //             hourlyData.kitchenApplicance,
    //             hourlyData.bedroomAndLounge]);
    //
    //         tmp = [];
    //         tmp.push(currentOne);
    //     }
    //     previousOne = currentOne;
    // }
    //
    // // after the final loop, there still have data left in tmp, process them
    // hourlyData = tmp[0];
    // count = tmp.length;
    //
    // for (j = 1; j < count; j++) {
    //     hourlyData.laundrayAndGarage = Math.abs(parseFloat(hourlyData.laundrayAndGarage))  + Math.abs(parseFloat(tmp[j].laundrayAndGarage));
    //     hourlyData.heatPump = Math.abs(parseFloat(hourlyData.heatPump))  + Math.abs(parseFloat(tmp[j].heatPump));
    //     hourlyData.incomerAll = parseFloat(hourlyData.incomerAll) +  parseFloat(tmp[j].incomerAll);
    //     hourlyData.ovenAll = Math.abs(parseFloat(hourlyData.ovenAll)) + Math.abs(parseFloat(tmp[j].ovenAll));
    //     hourlyData.kitchenApplicance = parseFloat(hourlyData.kitchenApplicance) + parseFloat(tmp[j].kitchenApplicance);
    //     hourlyData.bedroomAndLounge = parseFloat(hourlyData.bedroomAndLounge) + parseFloat(tmp[j].bedroomAndLounge);
    // }
    //
    // hourlyData.laundrayAndGarage = parseFloat(hourlyData.laundrayAndGarage) / count;
    // hourlyData.heatPump = parseFloat(hourlyData.heatPump) / count;
    // hourlyData.incomerAll = parseFloat(hourlyData.incomerAll) / count;
    // hourlyData.ovenAll = parseFloat(hourlyData.ovenAll)  / count;
    // hourlyData.kitchenApplicance = parseFloat(hourlyData.kitchenApplicance) / count;
    // hourlyData.bedroomAndLounge = parseFloat(hourlyData.bedroomAndLounge)  / count;
    // processedHourlyData.push(hourlyData);
    //
    // maxUsage = d3.max([maxUsage,
    //     hourlyData.laundrayAndGarage,
    //     hourlyData.heatPump,
    //     hourlyData.incomerAll,
    //     hourlyData.ovenAll,
    //     hourlyData.kitchenApplicance,
    //     hourlyData.bedroomAndLounge]);
    //
    // console.log(maxUsage);
    //
    //
    // // processedHourlyData.forEach(function (d) {
    // //     console.log(d);
    // // });
    //
    // var svgHeight = 500;
    // var svgWidth = 500;
    // var margin = 50;
    //
    //
    //
    // var days = [], hours = [];
    // // 31 days in Aug
    // for (i = 1; i <= 31; i++) {
    //     days.push(i);
    // }
    // for (i = 0; i <= 23; i++) {
    //     hours.push(i);
    // }
    // var blockHeight = svgHeight / hours.length, blockWidth = svgWidth / days.length;
    //
    // var xScale = d3.scaleLinear().domain([1,31]).range([margin, svgWidth]);
    // var yScale = d3.scaleLinear().domain([0,23]).range([margin, svgHeight- margin]);
    //
    //
    // var xAxisScale = d3.scaleLinear().domain([days[0], days[days.length - 1]]).range([margin, svgWidth]);
    // var yAxisScale = d3.scaleLinear().domain([hours[0], hours[hours.length - 1]]).range([margin, svgHeight - margin]);
    //
    // var xAxis = d3.axisBottom(xAxisScale).tickSize(svgHeight - margin - margin + blockHeight).tickValues(days);
    // var yAxis = d3.axisRight(yAxisScale).tickSize(svgWidth - margin + blockWidth).tickValues(hours);
    //
    // var usageExtent = d3.extent(data, function (d) {
    //     return d.kitchenApplicance;
    // });
    //
    // var colorScale = d3.scaleQuantize().domain([0, maxUsage])
    //     .range(colorbrewer.Reds[7]);
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
    // // add axis
    // svg.append("g")
    //     .attr("id", "xAxisG")
    //     .call(xAxis)
    //     .attr("transform", "translate(" + 0 + "," + (margin) +")");
    // svg.append("g")
    //     .attr("id", "yAxisG")
    //     .attr("transform", "translate(" + margin + "," + (0) +")")
    //     .call(yAxis);


}