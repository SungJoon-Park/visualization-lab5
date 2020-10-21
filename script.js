// CHART INIT ------------------------------

// create svg with margin convention
const margin = {
        top: 20,
        right: 20,
        bottom: 40,
        left: 50
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let svg = d3
    .select('.chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

const group = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// create scales without domains
const xScale = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

const yScale = d3.scaleLinear()
    .range([height, 0]);

// create axes and axis title containers
const xAxis = d3.axisBottom()
    .scale(xScale);

const yAxis = d3.axisLeft()
    .scale(yScale);

let xDisplay = group
    .append('g')
    .attr('class', 'axis x-axis');

let yDisplay = group
    .append('g')
    .attr('class', 'axis y-axis');

let yLabel = svg
    .append('text')
    .attr('x', 50)
    .attr('y', 10)
    .attr('text-anchor', 'middle')
    .attr('font-size', 14)
    .attr('font-weight', 'bold')
    .attr('alignment-baseline', 'middle');

// (Later) Define update parameters: measure type, sorting direction
let key = (d => d.company);
let type = d3.select('#group-by').node().value;
let sorting = -1; //1 for increasing, -1 for decreasing

// CHART UPDATE FUNCTION -------------------
function update(data, type, sorting) {
    if (sorting == -1) {
        data.sort((a, b) => b[type] - a[type]);
    } else {
        data.sort((a, b) => a[type] - b[type]);
    }

    // update domains
    console.log(type);
    xScale.domain(data.map(key));
    yScale.domain([0, d3.max(data, d => d[type])]);


    // update bars
    let bars = group
        .selectAll('rect')
        .data(data, key);

    bars
        .enter()
        .append('rect')
        .attr('y',height)
        .merge(bars)
        .transition()
        .duration(1000)
        .attr('x', d => xScale(d.company))
        .attr('y', d => yScale(d[type]))
        .attr('width', d => xScale.bandwidth())
        .attr('height', d => (height - yScale(d[type])))
        .attr('fill', 'blue');
    bars
        .exit()
        .remove();

    // update axes and axis title
    xDisplay
        .attr("transform", `translate(0, ${height})`)
        .transition()
        .duration(1000)
        .call(xAxis);

    yDisplay
        .transition()
        .duration(1000)
        .call(yAxis);

    yLabel
        .text(() => {
                if (type == 'stores') {
                    return 'Stores';
                } else {
                    return 'Billion USD';
                }
            }


        );
}

// CHART UPDATES ---------------------------

// Loading data
d3.csv('coffee-house-chains.csv', d3.autoType).then(data => {

    update(data, type, sorting); // simply call the update function with the supplied data

    // (Later) Handling the type change
    d3.select('#group-by')
        .on('change', e => {
            type = e.target.value;
            update(data, type, sorting);
        });
    // (Later) Handling the sorting direction change
    d3.select('#button')
        .on('click', e => {
            sorting *= -1;
            update(data, type, sorting);
        });
});