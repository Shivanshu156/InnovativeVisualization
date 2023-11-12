const seesaw = d3.select("#seesaw");

let circles = [];

function updateCircles() {
    const figure = seesaw.selectAll(".figure")
        .data(circles, d => d.id);

    figure.enter().append("circle")
        .attr("class", d => `fig-${d.color}`)
        .attr("cx", d => d.cx)
        .attr("cy", d => d.cy)
        .attr("r", d => d.r)
        .attr("fill",d=>d.color );

    figure.exit().remove();
}

function balanceSeesaw() {

    imbalance = 30
    
    const angleInRadians = imbalance * (Math.PI / 180);
    const end1_dy =  100* Math.sin(angleInRadians)
    const end1_dx = 100 - 100* Math.cos(angleInRadians)
    // Update the position of the circles based on the imbalance
    seesaw.selectAll(".fig-blue")
        .transition()
        .duration(1000)
        .attr("cx", d=> d.cx )
        .attr("cy", d=> d.cy + 100 - 10)
        .on('end', function () {

            seesaw.select("#line")
            .transition()
            .duration(1000)
            .attr("transform", `rotate(${-imbalance}, 200, 20)`) // Rotate around the tip of the triangle


            seesaw.selectAll(".fig-blue")
            .transition()
            .duration(1000)
            .attr("cx", d=>  d.cx + end1_dx)
            .attr("cy", d=>  100+  end1_dy- d.r - 10)
            .on('end', function(){
                seesaw.selectAll(".fig-orange")
                .transition()
                .duration(1000)
                .attr("cx", d=>d.cx - end1_dx)
                .attr("cy", d=> d.cy + end1_dy)
                .on("end", function(){
                    seesaw.select("#line")
                    .transition()
                    .duration(1000)
                    .attr("transform", `rotate(${0}, 200, 20)`); // Rotate around the tip of the triangle

                    seesaw.selectAll(".fig-orange")
                    .transition()
                    .duration(1000)
                    .attr("cx", d=>  d.cx - end1_dx)
                    .attr("cy", d=>  d.cy +100 - 10)
                    

                    seesaw.selectAll(".fig-blue")
                    .transition()
                    .duration(1000)
                    .attr("cx", d=>  d.cx )
                    .attr("cy", d=>  d.cy +100 - 10)
                })
            });
        });


}

const circleData = [
    { id: 1, color: "blue", weight: 1, cx: 100, cy:-20, r: 20 },
    { id: 2, color: "orange", weight: 3.5, cx: 300, cy:-20, r: 20 },
    { id: 3, color: "orange", weight: 3.5, cx: 340, cy:-20, r: 20 },
    // Add more circles as needed
];

circles = circleData;

updateCircles();
balanceSeesaw();