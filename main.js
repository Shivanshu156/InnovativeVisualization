var g1, g2, g2_height = 80, g2_width=80;
let colorScale;
let planets_data;
let planet_types = []
let earth_mass = 5.97219
let jupiter_mass = 1898.13
let earth_radius = 3958.8
let jupiter_radius = 43441
let wrt = 'earth'
let wrt_color = 'skyblue'
let radiusScale
// let seesaw
let seesaw_height = 300;
let seesaw_width = 400;
let margin = { top: 0, right: 40, bottom: 40, left: 20 };
let seesaw = d3.select(".seesaw-container").append('svg').attr('height', seesaw_height).attr('width',seesaw_width ).attr('class','seesaw');

Promise.all([d3.csv('data/cleaned_5250.csv', (d) => { return d })])
  .then(function (data) {
    console.log('loaded planets data');
    planets_data = data[0];
    // console.log(planets_data)
    planet_types = Array.from(new Set(planets_data.map(item => item.planet_type)));
    console.log(planet_types)
    colorScale = d3.scaleOrdinal().domain(planet_types).range(d3.schemeCategory10);
    planets_data = planets_data.map(d => ({
        ...d, 
        radius: d.radius_wrt === 'earth' ? earth_radius*d.radius_multiplier : jupiter_radius* d.radius_multiplier, 
        mass: d.mass_wrt === 'earth' ? earth_mass*d.mass_multiplier : jupiter_mass* d.mass_multiplier, 
    }));
    console.log(planets_data)
    radiusScale = d3.scaleLinear()
            .domain([d3.min(planets_data, d => d.radius), d3.max(planets_data, d => d.radius)]) // Input domain
            .range([2,15]); // Output range
    
    distanceScale = d3.scaleLinear()
                    .domain([d3.min(planets_data, d => d.distance), d3.max(planets_data, d => d.distance)]) // Input domain
                    .range([30,100]); // Output range

    $(document).ready(function () {
 
                drawSolarChart()
                drawSeesaw()
    });
  });


let dropRange = 200


function drawSeesaw(){
    
    const group = seesaw.append("g")
    .attr("transform", `translate(0,${dropRange})`);

    group.append("path")
        .attr("id", "triangle")
        .attr("d", "M 200 20 L 180 60 L 220 60 Z")
        .attr("fill", "lightblue");

    // Append a line element for the horizontal line
    group.append("line")
        .attr("id", "line")
        .attr("x1", 100)
        .attr("y1", 20)
        .attr("x2", 300)
        .attr("y2", 20)
        .attr("stroke", "white")
        .attr("stroke-width", 4);

    seesaw.append('text')
        .attr('class', 'seesaw-label')
        .attr('x', seesaw_width / 2 - margin.right )
        .attr('y', seesaw_height )
        .text("Mass Scale")
        .attr("font-size", "20px")
        .style("stroke", "white");

    seesaw.append('g').attr('class', 'fig-1')
    seesaw.append('g').attr('class', 'fig-2')
    seesaw.append('text').attr('class', 'seesaw-info')

}


function updateCircles(n, name, color) {
    console.log('ionside update circles')
    if (wrt==='earth'){
        wrt_color = 'skyblue'
    }    
    else{
        wrt_color='orange'
    }
    // d3.selectAll('.seesaw').remove()
    d3.selectAll('.fig-1').transition().duration(100).attr("transform", `translate(0, -100)`);
    d3.selectAll('.fig-2').transition().duration(100).attr("transform", `translate(${300-g2_width}, -100)`)
    d3.selectAll('.seesaw-info').transition().duration(100).style('opacity', 0)
    .on("end", function(){

        seesaw = d3.select(".seesaw");
        g1 = seesaw.append("g").attr("class", "fig-1").attr("transform", "translate(0, -100)");
        const elementsArray = generateCircles(n, g2_width, g2_height, wrt_color); 
        g2  = createElements(elementsArray).attr("class", "fig-2").attr("transform", `translate(${200-g2_width}, -100)`);
        g2_height = g2.node().getBoundingClientRect().height
        g2_width = g2.node().getBoundingClientRect().width
    
        g1.append("circle")
            .attr("cx", 100)
            .attr("cy", -20)
            .attr("r", 20)
            .attr("fill",color );
        balanceSeesaw(n, name)

 
    });

}

function balanceSeesaw(n, name) {

    imbalance = 30
    const angleInRadians = imbalance * (Math.PI / 180);
    const end1_dy =  100* Math.sin(angleInRadians)
    const end1_dx = 100 - 100* Math.cos(angleInRadians)
    // Update the position of the circles based on the imbalance

    g1.transition()
    .duration(500)
    .attr("transform", `translate(0, &{dropRange})`)
    .on("end", function(){
        seesaw.select("#line")
            .transition()
            .duration(500)
            .attr("transform", `rotate(${-imbalance}, 200, 20)`) 

        g1
        .transition()
        .duration(500)
        .attr("transform", `translate(${end1_dx}, ${dropRange+end1_dy+5})`)
        .on("end", function(){
            g2.transition()
            .duration(500)
            .attr("transform", `translate(${300-g2_width/2-end1_dx}, ${dropRange-end1_dy-g2_height+5})`)
            .on("end", function(){

                seesaw.select("#line")
                .transition()
                .duration(500)
                .attr("transform", `rotate(0, 200, 20)`) 
                
                g1
                .transition()
                .duration(500)
                .attr("transform", `translate(0, ${dropRange})`)

                g2
                .transition()
                .duration(500)
                .attr("transform", `translate(${300-g2_width/2}, ${dropRange-g2_height+5})`)
                .on("end", function(){

                    seesaw = d3.select('.seesaw')
                    seesaw.append('text')
                    .attr("class", "seesaw-info")
                    .attr("transform", `translate(${seesaw_width/2 }, ${seesaw_height/5})`)
                    .text(`1 ${name} = ${n} ${wrt.toLocaleLowerCase()}`)
                    .attr("font-size", "20px")
                    .attr("text-anchor", "middle") // Align text in the center horizontally
                    .attr("dominant-baseline", "middle")
                    .style("stroke", "white");
                })

            })
        })
    })

}

function generateCircles(n, containerWidth, containerHeight, color) {
    let circles = [];

    let maxRadius = Math.min(containerWidth / (Math.floor(n) + 1), containerHeight / 2);
    let verticalSpacing = 2 * maxRadius;

    let totalCircles = Math.floor(n);
    let rowCount = 1;

    let fraction = n % 1;
    if (fraction > 0) {
        const pieRadius = maxRadius;
        const pieX = 0; // Adjust as needed
        const pieY = (rowCount - 1) * verticalSpacing + verticalSpacing / 2;

        const arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(pieRadius)
            .startAngle( Math.PI/2)
            .endAngle(fraction * 2 * Math.PI + Math.PI/2);

        circles.push({
            id: "pie",
            cx: pieX,
            cy: pieY,
            r: pieRadius,
            color: color,
            arcPath: arcGenerator()
        });
        rowCount++;
    }

    while (totalCircles > 0) {
        const circlesInRow = Math.min(totalCircles, rowCount);
        const horizontalSpacing = (circlesInRow - 1) * 2 * maxRadius;

        for (let col = 0; col < circlesInRow; col++) {
            const x = col * (2 * maxRadius) - horizontalSpacing / 2;
            const y = (rowCount - 1) * verticalSpacing + verticalSpacing / 2;

            circles.push({
                id: circles.length + 1,
                cx: x,
                cy: y,
                r: maxRadius,
                color: color // You can implement a function to generate random colors
            });
        }

        totalCircles -= circlesInRow;
        rowCount++;
    }

    maxRadius = g2_height/(2*(rowCount-1));
    circles = [];


    verticalSpacing = 2 * maxRadius;

    totalCircles = Math.floor(n);
    rowCount = 1;

    fraction = n % 1;
    if (fraction > 0) {
        const pieRadius = maxRadius;
        const pieX = 0; // Adjust as needed
        const pieY = (rowCount - 1) * verticalSpacing + verticalSpacing / 2;

        const arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(pieRadius)
            .startAngle( Math.PI/2)
            .endAngle(fraction * 2 * Math.PI + Math.PI/2);

        circles.push({
            id: "pie",
            cx: pieX,
            cy: pieY,
            r: pieRadius,
            color: color,
            arcPath: arcGenerator()
        });
        rowCount++;
    }

    while (totalCircles > 0) {
        const circlesInRow = Math.min(totalCircles, rowCount);
        const horizontalSpacing = (circlesInRow - 1) * 2 * maxRadius;

        for (let col = 0; col < circlesInRow; col++) {
            const x = col * (2 * maxRadius) - horizontalSpacing / 2;
            const y = (rowCount - 1) * verticalSpacing + verticalSpacing / 2;

            circles.push({
                id: circles.length + 1,
                cx: x,
                cy: y,
                r: maxRadius,
                color: color // You can implement a function to generate random colors
            });
        }

        totalCircles -= circlesInRow;
        rowCount++;
    }

    return circles;
}

function createElements(data) {
    const g = seesaw.append('g')
    .attr("transform", `translate(${g2_width/2}, ${g2_height/2})`);;
    g.append("rect")
    .attr("width", g2_width)
    .attr("height", g2_height)
    .attr("fill", "none")

    const pieData = data.find(d => d.id === "pie");
    if (pieData) {
        g.append("path")
            .attr("class", "pie-slice")
            .attr("transform", `translate(${pieData.cx+g2_width/2},${pieData.cy})`)
            .attr("d", pieData.arcPath)
            .attr("fill", pieData.color);
    }

    // Create circles
    g.selectAll(".circle")
        .data(data.filter(d => d.id !== "pie"))
        .enter().append("circle")
        .attr("class", "circle")
        .attr("cx", d => d.cx+g2_width/2)
        .attr("cy", d => d.cy)
        .attr("r", d => d.r)
        .attr("fill", d => d.color);

    // Dynamically adjust viewBox to fit all elements
    const bbox = g.node().getBBox();
    const padding = 20;
    g.attr("viewBox", `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + 2 * padding} ${bbox.height + 2 * padding}`);
    return g
}



// Scaled distances for circular lines
let scaledDistances = [50, 100, 150, 200, 250, 300, 350, 800, 900];

// Define SVG container
const svgWidth = 600;
const svgHeight = 600;

const svg = d3.select(".planet-chart-container")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .style("border-radius", '50%')



// Create a group for the night sky background
// const nightSky = svg.append("rect")
//     .attr("width", svgWidth)
//     .attr("height", svgHeight)
//     .attr("fill", "black");

// Create circles for stars
// const starsData = Array.from({ length: 200 }, () => ({
//     x: Math.random() * 1300,
//     y: Math.random() * seesaw_height,
//     radius: Math.random() * 1.5,
//     color: "white",
// }));

// const stars = seesaw.selectAll("circle.star")
//     .data(starsData)
//     .enter().append("circle")
//     .attr("class", "star")
//     .attr("cx", d => d.x)
//     .attr("cy", d => d.y)
//     .attr("r", d => d.radius)
//     .attr("fill", d => d.color);


function drawSolarChart(){
    console.log('inside')
    // Create a group for the central planet (Sun)
    const centralPlanetGroup = svg.append("g")
        .attr("transform", `translate(${svgWidth/2}, ${svgHeight / 2})`);


    beeswarm = beeswarmForce()
        .x(d => distanceScale(d.distance))
        .y(svgHeight / 2)
        .r(d => radiusScale(d.radius))
    
    let b_data = beeswarm(planets_data)

    const planetTooltip = d3.select("body").append("div")
    .attr("id", "planetTooltip")
    .style("position", "absolute")
    .style("border", "2px solid black")
    .style("padding", "5px")
    .style("opacity", 0.9)
  
    .style("display", "none");

    // Create circles for each planet
    centralPlanetGroup
    .append("circle")
    .attr("class", "planet")
    .attr("cx", d => 0)
    .attr("cy", d => 0)
    .attr("r", d => 15)
    .attr("fill", "skyblue")

    let planets = centralPlanetGroup.selectAll("circle.planet")
        .data(b_data)
        .enter().append("circle")
        .attr("class", "planet")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => d.r)
        .style("stroke", "black")
        .style("stroke-width", 1)
        // .attr("r", d => radiusScale(d.radius))
        .attr("fill", d => colorScale(d.data.planet_type))
        
        planets.on('mouseover', function (event, d) {

            

            d3.select(this)
                .style('stroke-width', 2)
                .attr('class', 'this.planet')
            const xPosition = event.pageX + 10;
            const yPosition = event.pageY - 30;
            // console.log(d)
            planetTooltip.html(`<strong>${d.data.name}</strong><br>Distance: ${d.data.distance} AU`)
            planetTooltip.style('left', xPosition + 'px')
                .style('top', yPosition + 'px');
            planetTooltip.style('display', 'inline-block')
            planetTooltip.style('background-color', colorScale(d.data.planet_type))

            d3.selectAll(".planet").style('opacity', 0.2)
            })
        .on('mousemove', function (event, d) {
            const xPosition = event.pageX + 10;
            const yPosition = event.pageY - 30;
            planetTooltip.style('left', xPosition + 'px')
                .style('top', yPosition + 'px');
            })
        .on('mouseout', function () {
            

            d3.select(this)
                .style('stroke-width', 1)
                .attr('class', 'planet');
            planetTooltip.style('display', 'none');
            d3.selectAll(".planet").style('opacity', 1)
            })
        .on('click', function(event, d){

            updateCircles(d.data.mass_multiplier, d.data.name, colorScale(d.data.planet_type));
            // balanceSeesaw();
        })


    // Add circular labels for the distance axis
    const distanceCircles = svg.selectAll("g.distance-circle-group")
        .data(scaledDistances)
        .enter().append("g")
        .attr("class", "distance-circle-group")
        .attr("transform", `translate(${svgWidth/2}, ${0})`);
        ;

    distanceCircles.append("circle")
        .attr("class", "distance-circle")
        .style('stroke-width', 2)
        .attr("cx", 0)
        .attr("cy", svgHeight / 2)
        .attr("r", d => d);

    distanceCircles.append("text")
        .attr("class", "distance-label")
        .attr("x", d=> d*Math.cos(Math.PI/6))
        .attr("y", d => Math.min(svgHeight, svgHeight/2 +  d*Math.sin(Math.PI/6)))
        .text(d => `${d} AU`);
   
}
        
 
beeswarmForce = function () {
    let x = d => d.x;
    let y = d => d.y;
    let r = d => d.r;
    // let c = d => d[3];
    // console.log('beeswarm force called')
    let ticks = 500;
  
    function beeswarm(data) {
      // console.log('beeswarm called')
  
      const entries = data.map(d => {
        return {
          x0: typeof x === "function" ? x(d) : x,
          y0: typeof y === "function" ? y(d) : y,
          r: typeof r === "function" ? r(d) : r,
          //   c: typeof c === "function" ? c(d) : c,
          data: d
        }
      });
  
      const simulation = d3.forceSimulation(entries)
        .force("radial", d3.forceRadial(d => d.x0))
        // .force("y", d3.forceY(d => d.y0))
        // .force("collide", d3.forceCollide(d => d.r));
  
      for (let i = 0; i < ticks; i++) simulation.tick();
  
      return entries;
    }
  
    beeswarm.x = f => f ? (x = f, beeswarm) : x;
    beeswarm.y = f => f ? (y = f, beeswarm) : y;
    beeswarm.r = f => f ? (r = f, beeswarm) : r;
    beeswarm.ticks = n => n ? (ticks = n, beeswarm) : ticks;
  
    return beeswarm;
  }
  