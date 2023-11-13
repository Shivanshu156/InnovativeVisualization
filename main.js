var g1, g2, g2_height = 80, g2_width=80;
var g3, g4, g4_height = 80, g4_width=80;
let colorScale;
let planets_data;
let planets;
let data=[];
let planet_types = []
let earth_mass = 5.97219
let jupiter_mass = 1898.13
let earth_radius = 3958.8
let jupiter_radius = 43441
let wrt = 'earth'
// let wrt_color = '#3498DB'
let radiusScale
let year = 1992;
let distanceMin = 50, distanceMax = 200;
let d_min, d_max;
let radiusMin = 5, radiusMax = 20;
// let seesawEarth
let seesawEarth_height = 300;
let seesawEarth_width = 400;
let seesawJupiter_height = 300;
let seesawJupiter_width = 400;
let planetChartWidth = 600;
let planetChartHeight = 600;
let margin = { top: 0, right: 40, bottom: 40, left: 20 };
let seesawEarth = d3.select(".seesawEarth-container").append('svg').attr('height', seesawEarth_height).attr('width',seesawEarth_width ).attr('class','seesawEarth');
let seesawJupiter = d3.select(".seesawJupiter-container").append('svg').attr('height', seesawJupiter_height).attr('width',seesawJupiter_width ).attr('class','seesawJupiter');

Promise.all([d3.csv('data/cleaned_5250.csv', (d) => { return d })])
  .then(function (csv_data) {
    console.log('loaded planets data');
    planets_data = csv_data[0];
    // console.log(planets_data)
    planet_types = Array.from(new Set(planets_data.map(item => item.planet_type)));
    console.log(planet_types)
    // colorScale = d3.scaleOrdinal().domain(planet_types).range(d3.schemeCategory10);
    colorScale = d3.scaleOrdinal().domain(planet_types).range([ '#145A32', '#C0392B', '#7D3C98', '#6E2C00', '#D4AC0D']);
    data = planets_data.filter(d=>d.discovery_year<=year).map(d => ({
        ...d, 
        radius: d.radius_wrt === 'Earth' ? earth_radius*d.radius_multiplier : jupiter_radius* d.radius_multiplier, 
        mass: d.mass_wrt === 'Earth' ? earth_mass*d.mass_multiplier : jupiter_mass* d.mass_multiplier, 
    }));
    console.log(data)
    radiusScale = d3.scaleLinear()
            .domain([Math.min(earth_radius, d3.min(data, d => d.radius)), d3.max(data, d => d.radius)]) // Input domain
            .range([radiusMin,radiusMax]); // Output range
    d_min = d3.min(data, d => d.distance);
    d_max = d3.max(data, d => d.distance);
    distanceScale = d3.scaleLinear()
                    .domain([d_min*.89, d_max*1.13]) // Input domain
                    .range([distanceMin,distanceMax]); // Output range

    $(document).ready(function () {
        // $('[x-axis-nav-value="Data.Health.Birth Rate"]').click();

        dispatchEventForYear();

                drawSolarChart();
                drawSeesawEarth();
                drawSeesawJupiter();
    });
  });



document.addEventListener("DOMContentLoaded", function () {

    // Select and show selected X-axis value
    document.querySelectorAll('.wrt-nav').forEach(function (item) {
      item.addEventListener('click', function () {
        console.log('inside click functinos')
        wrt_value = item.getAttribute('wrt-nav-value');
        wrt_display = item.textContent
        document.getElementById('wrt-nav-selected').textContent = wrt_display;
        // updateChart('wrt');
      });
    });
  

    // Select and show selected year value
    var yearInput = document.getElementById("year-input");
    const slider = document.getElementById("slider");
  
    yearInput.addEventListener("change", function (event) {
        console.log('input event occurrred')
      event.stopPropagation();
      
      year = parseInt(yearInput.value);
      slider.value = year;
      console.log(year)
      updateChart('year');
    });
    slider.addEventListener("input", function (event) {
        
      event.stopPropagation();
      year = slider.value;
  
      yearInput.value = year;
      updateChart('year');
    });
    document.querySelectorAll(' .year-event').forEach(function (item) {
      item.addEventListener('click', function (event) {
        event.stopPropagation();
        year = parseInt(item.getAttribute('value'));
  
        yearInput.value = year;
        slider.value = year;
        updateChart('year');
      });
    });
  
  });


let dropRange = 200


function drawSeesawEarth(){
    
    const group = seesawEarth.append("g")
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

    seesawEarth.append('text')
        .attr('class', 'seesawEarth-label')
        .attr('x', seesawEarth_width / 2 - margin.right -margin.left - 10)
        .attr('y', seesawEarth_height -10)
        .text("Mass Scale Earth")
        .attr("font-size", "20px")
        // .attr("text-anchor", "middle") 
        // .attr("dominant-baseline", "middle")
        .style("stroke", "white");

    seesawEarth.append('g').attr('class', 'fig-1')
    seesawEarth.append('g').attr('class', 'fig-2')
    seesawEarth.append('text').attr('class', 'seesawEarth-info')

}

function drawSeesawJupiter(){
    
    const group = seesawJupiter.append("g")
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

    seesawJupiter.append('text')
        .attr('class', 'seesawJupiter-label')
        .attr('x', seesawJupiter_width / 2 - margin.right - margin.left -15)
        .attr('y', seesawJupiter_height -10)
        .text("Mass Scale Jupiter")
        .attr("font-size", "20px")
        .style("stroke", "white");

    seesawJupiter.append('g').attr('class', 'fig-3')
    seesawJupiter.append('g').attr('class', 'fig-4')
    seesawJupiter.append('text').attr('class', 'seesawJupiter-info')

}


function updateCirclesEarth(n, mass_wrt, name, color) {
    console.log('ionside update circles')
    let wrt_color = '#3498DB'
    if (mass_wrt==='Jupiter'){
       n = n*jupiter_mass/earth_mass;
    }    
    // else{
        
    // }
    // d3.selectAll('.seesawEarth').remove()
    d3.selectAll('.fig-1').transition().duration(100).attr("transform", `translate(0, -100)`);
    d3.selectAll('.fig-2').transition().duration(100).attr("transform", `translate(${300-g2_width}, -100)`)
    d3.selectAll('.seesawEarth-info').transition().duration(100).style('opacity', 0)
    .on("end", function(){

        seesawEarth = d3.select(".seesawEarth");
        g1 = seesawEarth.append("g").attr("class", "fig-1").attr("transform", "translate(0, -100)");
        const elementsArray = generateCircles(n, g2_width, g2_height, wrt_color); 
        g2  = createElements(elementsArray, 'Earth').attr("class", "fig-2").attr("transform", `translate(${200-g2_width}, -100)`);
        g2_height = g2.node().getBoundingClientRect().height
        g2_width = g2.node().getBoundingClientRect().width
    
        g1.append("circle")
            .attr("cx", 100)
            .attr("cy", -20)
            .attr("r", 20)
            .attr("fill",color );
        balanceSeesawEarth(n, name)

 
    });

}


function updateCirclesJupiter(n, mass_wrt, name, color) {
    console.log('ionside update circles')
    let wrt_color = '#DC7633'
    if (mass_wrt==='Earth'){
       n = n*earth_mass/jupiter_mass;
    }    
    // else{
        
    // }
    // d3.selectAll('.seesawEarth').remove()
    d3.selectAll('.fig-3').transition().duration(100).attr("transform", `translate(0, -100)`);
    d3.selectAll('.fig-4').transition().duration(100).attr("transform", `translate(${300-g2_width}, -100)`)
    d3.selectAll('.seesawJupiter-info').transition().duration(100).style('opacity', 0)
    .on("end", function(){

        seesawJupiter = d3.select(".seesawJupiter");
        g3 = seesawJupiter.append("g").attr("class", "fig-3").attr("transform", "translate(0, -100)");
        const elementsArray = generateCircles(n, g4_width, g4_height, wrt_color); 
        g4  = createElements(elementsArray, 'Jupiter').attr("class", "fig-4").attr("transform", `translate(${200-g4_width}, -100)`);
        g4_height = g4.node().getBoundingClientRect().height
        g4_width = g4.node().getBoundingClientRect().width
    
        g3.append("circle")
            .attr("cx", 100)
            .attr("cy", -20)
            .attr("r", 20)
            .attr("fill",color );
        balanceSeesawJupiter(n, name)

 
    });

}

function balanceSeesawEarth(n, name) {

    imbalance = 30
    const angleInRadians = imbalance * (Math.PI / 180);
    const end1_dy =  100* Math.sin(angleInRadians)
    const end1_dx = 100 - 100* Math.cos(angleInRadians)
    // Update the position of the circles based on the imbalance

    g1.transition()
    .duration(500)
    .attr("transform", `translate(0, &{dropRange})`)
    .on("end", function(){
        seesawEarth.select("#line")
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

                seesawEarth.select("#line")
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

                    seesawEarth = d3.select('.seesawEarth')
                    seesawEarth.append('text')
                    .attr("class", "seesawEarth-info")
                    .attr("transform", `translate(${seesawEarth_width/2 }, ${seesawEarth_height/4})`)
                    .text(`1 (${name}) = ${parseFloat(n).toFixed(3)} (Earth)`)
                    .attr("font-size", "15px")
                    .attr("text-anchor", "middle") 
                    .attr("dominant-baseline", "middle")
                    .style("stroke", "white");
                })

            })
        })
    })

}


function balanceSeesawJupiter(n, name) {

    imbalance = 30
    const angleInRadians = imbalance * (Math.PI / 180);
    const end1_dy =  100* Math.sin(angleInRadians)
    const end1_dx = 100 - 100* Math.cos(angleInRadians)
    // Update the position of the circles based on the imbalance

    g3.transition()
    .duration(500)
    .attr("transform", `translate(0, &{dropRange})`)
    .on("end", function(){
        seesawJupiter.select("#line")
            .transition()
            .duration(500)
            .attr("transform", `rotate(${-imbalance}, 200, 20)`) 

        g3
        .transition()
        .duration(500)
        .attr("transform", `translate(${end1_dx}, ${dropRange+end1_dy+5})`)
        .on("end", function(){
            g4.transition()
            .duration(500)
            .attr("transform", `translate(${300-g4_width/2-end1_dx}, ${dropRange-end1_dy-g4_height+5})`)
            .on("end", function(){

                seesawJupiter.select("#line")
                .transition()
                .duration(500)
                .attr("transform", `rotate(0, 200, 20)`) 
                
                g3
                .transition()
                .duration(500)
                .attr("transform", `translate(0, ${dropRange})`)

                g4
                .transition()
                .duration(500)
                .attr("transform", `translate(${300-g4_width/2}, ${dropRange-g4_height+5})`)
                .on("end", function(){

                    seesawJupiter = d3.select('.seesawJupiter')
                    seesawJupiter.append('text')
                    .attr("class", "seesawJupiter-info")
                    .attr("transform", `translate(${seesawJupiter_width/2 }, ${seesawJupiter_height/4})`)
                    .text(`1 (${name}) = ${parseFloat(n).toFixed(3)} (Jupiter)`)
                    .attr("font-size", "15px")
                    .attr("text-anchor", "middle") 
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

function createElements(data, wrt) {
    var g
    if (wrt==='Earth'){
     g = seesawEarth.append('g').attr("transform", `translate(${g2_width/2}, ${g2_height/2})`);}
    else{
     g = seesawJupiter.append('g').attr("transform", `translate(${g4_width/2}, ${g4_height/2})`);}

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

let scaledDistances = [50, 100, 150, 200, 250, 300];

const planetSvg = d3.select(".planet-chart-container")
    .append("svg")
    .attr("width", planetChartWidth)
    .attr("height", planetChartHeight)
    .style("border-radius", '35%')
let centralPlanetGroup = planetSvg.append("g").attr("transform", `translate(${planetChartWidth/2}, ${planetChartHeight / 2})`);

const distanceCircles = planetSvg.selectAll("g.distance-circle-group")
.data(scaledDistances)
.enter().append("g")
.attr("class", "distance-circle-group")
.attr("transform", `translate(${planetChartWidth/2}, ${0})`);
;

distanceCircles.append("circle")
.attr("class", "distance-circle")
.style('stroke-width', 2)
.attr("cx", 0)
.attr("cy", planetChartHeight / 2)
.attr("r", d => d);

function drawSolarChart(){
    let b_data = beeswarm(data)
    centralPlanetGroup
    .append("circle")
    .attr("class", "earth")
    .attr("cx",  0)
    .attr("cy",  0)
    .attr("r", radiusScale(earth_radius))
    .attr("fill", '#3498DB')

    planets = centralPlanetGroup.selectAll("circle.planet")
        .data(b_data)
        .enter().append("circle")
        .attr("class", "planet")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => d.r)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("opacity", 0.9)
        // .attr("r", d => radiusScale(d.radius))
        .attr("fill", d => colorScale(d.data.planet_type))
        
    // Add circular labels for the distance axis


    distanceCircles.append("text")
        .attr("class", "distance-label")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "15px")
        .attr("x", d=> d*Math.cos(Math.PI/6))
        .attr("y", d => Math.min(planetChartHeight, planetChartHeight/2 +  d*Math.sin(Math.PI/6)))
        .text(d => `${Math.ceil(distanceScale.invert(d))} ly`);
   
}
        
 
beeswarmForce = function () {
    let x = d => d.x;
    let y = d => d.y;
    let r = d => d.r;
    // let c = d => d[3];
    // console.log('beeswarm force called')
    let ticks = 500;
  
    function beeswarm(data1) {
      // console.log('beeswarm called')
  
      const entries = data1.map(d => {
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
        .force("collide", d3.forceCollide(d => d.r));
  
      for (let i = 0; i < ticks; i++) simulation.tick();
  
      return entries;
    }
  
    beeswarm.x = f => f ? (x = f, beeswarm) : x;
    beeswarm.y = f => f ? (y = f, beeswarm) : y;
    beeswarm.r = f => f ? (r = f, beeswarm) : r;
    beeswarm.ticks = n => n ? (ticks = n, beeswarm) : ticks;
  
    return beeswarm;
  }
  
const beeswarm = beeswarmForce()
  .x(d => distanceScale(d.distance))
  .y(planetChartHeight / 2)
  .r(d => radiusScale(d.radius))

  
function updateChart(change) {
    if (change == 'year') {
      console.log('Year change event occured')
      d3.selectAll('.fig-1').remove()
      d3.selectAll('.fig-2').remove()
      d3.selectAll('.fig-3').remove()
      d3.selectAll('.fig-4').remove()
      updateData()
    
      let b_data = beeswarm(data)
      console.log('total data points are ' + JSON.stringify(b_data.length))
      console.log(b_data)
      planets = centralPlanetGroup.selectAll("circle.planet")
        .data(b_data)
        .join("circle")
        .attr("class", "planet")
        .transition()
        .duration(1000)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => d.r)
        .style("stroke", "black")
        .style("opacity", 0.9)
        .style("stroke-width", 1)
        .attr("fill", d => colorScale(d.data.planet_type))
        .delay(function (d, i) { return (Math.min(i, 1800 )) })

    }
    
    else if (change == 'x-axis') {
      console.log('x-axis change event occured')
      updateXminmax();
      beeswarm_svg.selectAll('.x-axis-title')
        .transition()
        .duration(1000)
        .style("opacity", 0)
        .on('end', function () {
          beeswarm_svg.select(".x-axis-line")
            .transition()
            .duration(1000)
            .call(d3.axisBottom(xScale))
            .on('end', function () {
              beeswarm_svg.select('.x-axis-title')
                .transition()
                .duration(1000)
                .text(x_axis_display)
                .style("opacity", 1)
                .on('end', function () {
                  let b_data = beeswarm(data)
                  g.selectAll('circle')
                    .data(b_data, d => d.data.country)
                    .join('circle')
                    .transition()
                    .duration(1000)
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    .attr("r", d => d.r)
                    .delay(function (d, i) { return (i * 5) })
                });
  
            });
        });
  
      updateData();
      addToolTip()
  
  
    }

  
    const planetTooltip = d3.select("body").append("div")
    .attr("id", "planetTooltip")
    .style("position", "absolute")
    .style("border", "2px solid black")
    .style("padding", "5px")
    .style("opacity", 0.9)  
    .style("display", "none");


    centralPlanetGroup.selectAll("circle.planet").on('mouseover', function (event, d) {
        d3.select(this)
            .style('stroke-width', 2)
            .attr('class', 'this.planet')
        const xPosition = event.pageX + 10;
        const yPosition = event.pageY - 30;
        // console.log(d)
        planetTooltip.html(`<strong>${d.data.name}</strong><br>Distance: ${d.data.distance} ly <br>Planet Type: ${d.data.planet_type}`)
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

        updateCirclesEarth(d.data.mass_multiplier, d.data.mass_wrt, d.data.name, colorScale(d.data.planet_type));
        updateCirclesJupiter(d.data.mass_multiplier, d.data.mass_wrt, d.data.name, colorScale(d.data.planet_type));
        // balanceSeesawEarth();
    })
}


function updateData() {
    
    data = planets_data.filter(d=>parseInt(d.discovery_year)===parseInt(year)).map(d => ({
        ...d, 
        radius: d.radius_wrt === 'earth' ? earth_radius*d.radius_multiplier : jupiter_radius* d.radius_multiplier, 
        mass: d.mass_wrt === 'earth' ? earth_mass*d.mass_multiplier : jupiter_mass* d.mass_multiplier, 
    }));
    data = data.slice(0,400)

    console.log('updated data is')
    console.log(data)
    if(data.length!==0){
    radiusScale = d3.scaleLinear()
                .domain([Math.min(earth_radius, d3.min(data, d => d.radius)), d3.max(data, d => d.radius)]) // Input domain
                    .range([radiusMin,radiusMax]); // Output range

    d_min = d3.min(data, d => d.distance);
    d_max = d3.max(data, d => d.distance);
    distanceScale = d3.scaleLinear()
                    .domain([d_min*.89, d_max*1.13]) // Input domain
                    .range([distanceMin,distanceMax]); // Output range

    distanceCircles.selectAll('text')
        .transition()
        .duration(500)
        .style("opacity", 0)
        .on('end', function () {
            distanceCircles.selectAll("text")
            .transition()
            .duration(500)
            .text(d => `${Math.ceil(distanceScale.invert(d))} ly`)
            .style("opacity", 1);
        });
    }
  }


function dispatchEventForYear() {
    console.log('Year is ' + year);
    const slider = document.getElementById("slider");
    slider.value = year;
  
    const inputEvent = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    slider.dispatchEvent(inputEvent);
  }

var currently_playing = false;
var each_year_time;

function play_animation_pleaaaassssseeeee() {
currently_playing = true;
dispatchEventForYear();
let animation_time = 2000;
if(year===2014 || year===2016){
    animation_time = 2000;
}

each_year_time = setInterval(function () {
    year++;
    if (year <= 2023) {
    dispatchEventForYear();
    if (year == 2023) {
        togglePlayPause()
    }
    } else {

    stoooooopiiitttttttt();
    }
}, animation_time);
}


function stoooooopiiitttttttt() {
currently_playing = false;
clearInterval(each_year_time);
}

function togglePlayPause() {
var playIcon = document.getElementById("playIcon");
var playText = document.getElementById("playText");

if (!currently_playing) {
    play_animation_pleaaaassssseeeee();
    playIcon.className = "fas fa-pause";
    playText.textContent = "Pause";
    currently_playing = true;
} else {
    stoooooopiiitttttttt();
    playIcon.className = "fas fa-play";
    playText.textContent = "Play";
    currently_playing = false;
}
}
  