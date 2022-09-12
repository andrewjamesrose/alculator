import { Component, OnInit } from '@angular/core';
import { resultCollectionSpainNov19 } from "./test-data";
import * as d3 from 'd3';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
    svgDimensions = { width: 500, height: 500 };
    margin = { left: 5, right: 5, top: 10, bottom: 10 };
    chartDimensions = {
      width: this.svgDimensions.width - this.margin.left - this.margin.right,
      height: this.svgDimensions.height - this.margin.bottom - this.margin.top
    };
    maxNumberSeats = resultCollectionSpainNov19.reduce(
      (max, item) => (item.seats > max ? item.seats : max),
      0
    );
    
    politicalPartiesCount = resultCollectionSpainNov19.length;
    
    barPadding = 5; // We could calculate this value as well
    barWidth =
      (this.chartDimensions.width - this.barPadding * this.politicalPartiesCount) /
      this.politicalPartiesCount;

    partiesColorScale = d3.scaleOrdinal([
                                "#ED1D25",
                                "#0056A8",
                                "#5BC035",
                                "#6B2E68",
                                "#F3B219",
                                "#FA5000",
                                "#C50048",
                                "#029626",
                                "#A3C940",
                                "#0DDEC5",
                                "#FFF203",
                                "#FFDB1B",
                                "#E61C13",
                                "#73B1E6"
                            ])
                            .domain([
                                "PSOE",
                                "PP",
                                "VOX",
                                "UP",
                                "ERC",
                                "Cs",
                                "JxCat",
                                "PNV",
                                "Bildu",
                                "Más pais",
                                "CUP",
                                "CC",
                                "BNG",
                                "Teruel Existe"
                            ]);

    svg: any

  constructor() {

   }




  ngOnInit(): void {
    this.svg = d3.select("svg"),
    this.drawGraph()
  }

  drawGraph(): void {
    this.svg.append("svg")
            .attr("width", this.svgDimensions.width)
            .attr("height", this.svgDimensions.height)
            .attr("style", "background-color: #FBFAF0");
    
    let yScale = d3
                .scaleLinear()
                .domain([0, this.maxNumberSeats])
                .range([0, this.chartDimensions.height]);
    
    let chartGroup = this.svg
    .append("g")
    .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
    .attr("width", this.chartDimensions.width)
    .attr("height", this.chartDimensions.height);

    chartGroup
        .selectAll("rect")
        .data(resultCollectionSpainNov19)
        .enter()
        .append("rect")
        .attr("width", this.barWidth)
        .attr("height", (d: { seats: d3.NumberValue; }) => yScale(d.seats))
        .attr("x", (d: any, i: number) => i * (this.barWidth + this.barPadding))
        .attr("y", (d: { seats: d3.NumberValue; }) => this.chartDimensions.height - yScale(d.seats))
        .attr("fill", (d: { party: string; }) => this.partiesColorScale(d.party));

  }

}
