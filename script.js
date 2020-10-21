//load dataset

let cafe;
d3.csv('coffee-house-chains.csv', d3.autoType).then(data => {
    console.log('Cafe', data);
    cafe = data;


    //margin convention
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

    //group
    const group = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.company))
        .rangeRound([0, width])
        .paddingInner(0.1);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.stores))
        .range([height, 0]);

    let rects = group.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.company))
        .attr('y', d => yScale(d.stores))
        .attr('width', d => xScale.bandwidth())
        .attr('height', d => (height - yScale(d.stores)))
        .attr('fill', 'blue');

    let xAxis = d3.axisBottom()
        .scale(xScale);

    let yAxis = d3.axisLeft()
        .scale(yScale);

    let xDisplay = group
        .append('g')
        .attr('class', 'axis x-axis')
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);

    let yDisplay = group
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis);

    let yLabel = svg
        .append('text')
        .attr('x', 0 - margin.left)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'middle')
        .text('Stores');

});