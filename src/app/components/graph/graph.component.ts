import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { CrudService } from 'src/app/services/crud.service';
import { IGraphDataWithSum } from 'src/app/common/interfaces-and-classes';
import { MAX_7_DAY_TOTAL, MAX_DAILY } from 'src/app/common/constants';
import { timeFormat } from 'd3';

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
            this.graphData = graphAggregation
            this.redrawGraph()
        })
    
       }
    
    graphData!: IGraphDataWithSum[]
    yMax: number = 0

    svgDimensions = { width: 800, height: 500 };
    margin = { left: 5, right: 5, top: 10, bottom: 10 };
    chartDimensions = {
        width: this.svgDimensions.width - this.margin.left - this.margin.right,
        height: this.svgDimensions.height - this.margin.bottom - this.margin.top
    };
    
    barPadding = 5; // We could calculate this value as well
    dataPoints: number = 1
    barWidth: number = 20
    graphSVG: any

    ngOnInit(): void {
        this.graphSVG = d3.select('#graph')
        this.redrawGraph()
    }


    redrawGraph(): void {
        //clear the canvas ahead of a redraw
        this.graphSVG.selectAll("g").remove()

        this.graphSVG.append("svg")
            .attr("width", this.svgDimensions.width)
            .attr("height", this.svgDimensions.height)

        this.yMax = calculateMaxUnits(this.graphData)

        this.dataPoints = this.graphData.length

        this.barWidth = (this.chartDimensions.width - this.barPadding * this.dataPoints) / this.dataPoints;
        
        // let xScaleAxis = d3.scalePoint()
        //         .domain( this.graphData.map(graphDatum => graphDatum[]))         
        //         .range([0, this.chartDimensions.width])

        let dateExtent = <[Date, Date]>d3.extent(this.graphData.map(datum=>datum.date))

        let xScaleAxis = d3.scaleTime()
                .domain((dateExtent))
                .range([0, this.chartDimensions.width]);
        

        let x_axis = d3.axisBottom(xScaleAxis)


        this.graphSVG.append("g")
            .attr("transform", "translate(50, 450)")
            .call(x_axis);

        let yScaleData = d3
            .scaleLinear()
            .domain([0, this.yMax])
            .range([0, this.chartDimensions.height]);

        let yScaleAxis = d3
            .scaleLinear()
            .domain([0, this.yMax])
            .range([this.chartDimensions.height, 0]);

        let y_axis = d3.axisLeft(yScaleAxis)

        this.graphSVG.append("g")
            .attr("transform", "translate(50, 10)")
            .call(y_axis);

        let chartGroup = this.graphSVG
            .append("g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .attr("width", this.chartDimensions.width)
            .attr("height", this.chartDimensions.height);


        chartGroup
            .selectAll("rect")
            .data(this.graphData)
            .enter()
            .append("rect")
            .attr("width", this.barWidth)
            .attr("height", (d: { totalunits: d3.NumberValue; }) => {
                                                                        console.log(d)
                                                                        return yScaleData(d.totalunits)
                                                                    })
            .attr("x", (d: any, i: number) => i * (this.barWidth + this.barPadding))
            .attr("y", (d: { totalunits: d3.NumberValue; }) => this.chartDimensions.height - yScaleData(d.totalunits))
            .attr("fill", "#69f0ae")

        chartGroup.append("path")
            .datum(this.graphData)
            .attr("d", d3.line()
                .x( (d: any, i: number) => (i * (this.barWidth + this.barPadding)))
                .y( (d: any) => this.chartDimensions.height - yScaleData(d.rollingSum))
                .curve(d3.curveStepAfter)
            )
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 3)


        chartGroup.append("path")
            .datum([...this.graphData, "spacer"])
            .attr("d", d3.line()
                .x( (d: any, i: number) => (i * (this.barWidth + this.barPadding)))
                .y( (d: any) => this.chartDimensions.height - yScaleData(MAX_7_DAY_TOTAL))
            )
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 3)
            .style("stroke-dasharray", ("3, 3"))


        chartGroup.append("path")
            .datum([...this.graphData, "spacer"])
            .attr("d", d3.line()
                .x( (d: any, i: number) => (i * (this.barWidth + this.barPadding)))
                .y( (d: any) => this.chartDimensions.height - yScaleData(MAX_DAILY))
            )
            .attr("fill", "none")
            .attr("stroke", "#69f0ae")
            .attr("stroke-width", 3)
            .style("stroke-dasharray", ("3, 3"))

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