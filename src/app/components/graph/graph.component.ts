import { Component, OnInit } from '@angular/core';
import { resultCollectionSpainNov19 } from "./test-data";
import * as d3 from 'd3';
import { CrudService } from 'src/app/services/crud.service';
import { IGraphDataWithSum } from 'src/app/common/interfaces-and-classes';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
    
    constructor(private crudService: CrudService) {

        this.graphSVG = d3.select('#graph')
        // this.redrawGraph()

        this.crudService.getGraphAggregation().subscribe(graphAggregation => {
            console.log('received new graph aggregation in d3 graph component')
            console.log(graphAggregation)
            this.graphData = graphAggregation
            console.log(this.graphSVG)
            this.redrawGraph()
        })
    
       }
    
    graphData!: IGraphDataWithSum[]
    yMax: number = 0

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
    barWidthOld = (this.chartDimensions.width - this.barPadding * this.politicalPartiesCount) / this.politicalPartiesCount;
    
    dataPoints: number = 1
    barWidth: number = 20

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

    oldgraphSVG: any
    graphSVG: any

  ngOnInit(): void {
    this.oldgraphSVG = d3.select("#oldgraph"),
    this.drawOldGraph()

    this.graphSVG = d3.select('#graph')
    this.redrawGraph()
  }

  drawOldGraph(): void {
    
        this.oldgraphSVG.append("svg")
                .attr("width", this.svgDimensions.width)
                .attr("height", this.svgDimensions.height)
                .attr("style", "background-color: #FBFAF0");
        
        let yScale = d3
                    .scaleLinear()
                    .domain([0, this.maxNumberSeats])
                    .range([0, this.chartDimensions.height]);
        
        let chartGroup = this.oldgraphSVG
            .append("g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .attr("width", this.chartDimensions.width)
            .attr("height", this.chartDimensions.height);

        chartGroup
            .selectAll("rect")
            .data(resultCollectionSpainNov19)
            .enter()
            .append("rect")
            .attr("width", this.barWidthOld)
            .attr("height", (d: { seats: d3.NumberValue; }) => yScale(d.seats))
            .attr("x", (d: any, i: number) => i * (this.barWidthOld + this.barPadding))
            .attr("y", (d: { seats: d3.NumberValue; }) => this.chartDimensions.height - yScale(d.seats))
            // .attr("fill", "#69f0ae")
            .attr("fill", (d: { party: string; }) => this.partiesColorScale(d.party));

  }

  redrawGraph(): void {
    // ##### to do #####
    // add a system to clear the svg ahead of redrawing it


    this.graphSVG.selectAll("g").remove()

    this.graphSVG.append("svg")
        .attr("width", this.svgDimensions.width)
        .attr("height", this.svgDimensions.height)
        // .attr("style", "background-color: #FBFAF0");
        // .attr("style", "background-color: #DDDDDD");

    this.yMax = calculateMaxUnits(this.graphData)

    this.dataPoints = this.graphData.length

    this.barWidth = (this.chartDimensions.width - this.barPadding * this.dataPoints) / this.dataPoints;
    
    console.log("ymax:")
    console.log(this.yMax)

    let yScale = d3
        .scaleLinear()
        .domain([0, this.yMax])
        .range([0, this.chartDimensions.height]);

    let chartGroup = this.graphSVG
        .append("g")
        .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
        .attr("width", this.chartDimensions.width)
        .attr("height", this.chartDimensions.height);

    // console.log("compare data:")
    // console.log(resultCollectionSpainNov19)
    // console.log(this.graphData)

    chartGroup
        .selectAll("rect")
        .data(this.graphData)
        .enter()
        .append("rect")
        .attr("width", this.barWidth)
        .attr("height", (d: { totalunits: d3.NumberValue; }) => {
                                                                    console.log(d)
                                                                    return yScale(d.totalunits)
                                                                })
        .attr("x", (d: any, i: number) => i * (this.barWidth + this.barPadding))
        .attr("y", (d: { totalunits: d3.NumberValue; }) => this.chartDimensions.height - yScale(d.totalunits))
        .attr("fill", "#69f0ae")

  }

}


function calculateMaxUnits(graphData: IGraphDataWithSum[]): number {
    if(graphData.length > 0) {
        let maxValue = Math.max(...graphData.map(dataRow => dataRow.rollingSum))
        return maxValue
    } else {
        return 0
    }
}