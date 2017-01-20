/**
 * Created by zw on 20/01/2017.
 */


function makePieChart(data) {
    // bring back our tweets.json from chapter 2
    console.log(data);

    // set nest operator
    var nestedTweets = d3.nest()
        .key(function (d) {
            return d['user'];
        })
        .entries(data);
    //
    console.log(nestedTweets);

    nestedTweets.forEach(function (d) {
        d['numTweets'] = d['values'].length;
        d['numFavorites'] = d3.sum(d.values, function (d) {
            return d['favorites'].length;
        });
        d['numRetweets'] = d3.sum(d.values, function (d) {
            return d['retweets'].length;
        });
    });

    var pieChart = d3.pie();
    pieChart.value(function (d) {
        return d['numTweets'];
    });
    // var yourPie = pieChart([1, 1, 2]);
    var yourPie = pieChart(nestedTweets);

    var newArc = d3.arc();
    newArc.outerRadius(100).innerRadius(20);

    console.log(newArc(yourPie[0]));

    d3.select("svg").append("g")
        .attr("transform", "translate(250, 250)")
        .selectAll("path")
        .data(yourPie)
        .enter()
        .append("path")
        .attr("d", newArc)
        .style("fill", "blue")
        .style("opacity", .5)
        .style("stroke", "black")
        .style("stroke-width", "2px");

    pieChart.value(function (d) {
        return d['numFavorites'];
    });

    d3.selectAll("path").data(pieChart(nestedTweets))
        .transition().duration(1000).attr("d", newArc);

    // pieChart.value(function(d) {
    //     return d['numRetweets']
    // });
    //
    // d3.selectAll("path").data(pieChart(nestedTweets))
    //     .transition().duration(1000).attr("d", newArc);

}