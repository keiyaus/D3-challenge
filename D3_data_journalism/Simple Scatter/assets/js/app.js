var svgWidth = 800;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function (data) {

    // parse data / cast as numbers
    data.forEach(function (data) {
        data.poverty = +data.poverty;
        // data.age = +data.age;
        data.obesity = +data.obesity;
    });

    // xLinearScale function above csv import
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.poverty) - 2, d3.max(data, d => d.poverty)+2])
        .range([0, width]);

    // Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.obesity) - 2, d3.max(data, d => d.obesity)+2])
        .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .call(leftAxis);

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", 12)

    // Initialize tool tip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>Obesity: ${d.obesity}`);
        });

    // Create tooltip in the chart
    circlesGroup.call(toolTip);

    // Create event listeners to display and hide tool tip
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        // on mouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });


    // Create axes lables
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axis-text")
        .text("Obesity (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axis-text")
        .text("In Poverty (%)");

    // Add abbreviations of state names to circles
    var stateAbbr = chartGroup.selectAll("null").data(data)
        .enter()
        .append("text")
        .text(function (x) {
            return x.abbr
        })
        .attr("class", "stateText")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.obesity))
        // .attr("text-anchor", "middle")
        .attr("font-size", 10)
    
}).catch(function (error) {
    console.log(error);
});
