import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IDrinkHistoryAggregation, IDrinkHistoryEntry } from 'src/app/common/interfaces-and-classes';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  constructor(private crudService: CrudService) {
    this.crudService.getHistoryDetailed().subscribe(historyDetails=>{
        this.historyDetails = historyDetails
        this.historyDetails.sort(function(element1: IDrinkHistoryEntry, element2: IDrinkHistoryEntry){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return -1 * (element1.date.valueOf() - element2.date.valueOf());
          });
    })
  }

    historyDetails!: IDrinkHistoryEntry[]
    historyAggregate!: IDrinkHistoryAggregation[]
    graphData!: IDrinkHistoryAggregation[]


    detailColumnFields: string[] = ['date', 'volume', 'abv', 'units_per', 'quantity', 'units_total', 'edit', 'delete']
    aggregateColumnFields: string[] = ['date', 'units_total', 'prev_week', 'other_stats']

    mode = new FormControl<string>('details') // 'details' or 'aggregate'

    ngOnInit(): void {
    }


    calculateUnits(row: IDrinkHistoryEntry): number {
        return row.abv * row.volume / 1000
    }


    calculateTotalUnits(row: IDrinkHistoryEntry): number {
        return row.quantity * this.calculateUnits(row)
    }


    handleRowDelete(id: string):void {
        console.log("Deleting row: " + id)
        this.crudService.deleteHistoryEntry(id)
    }


    handleRowEdit(id: number):void {
        console.log("Editing row: " + id)
    }


    debug_ResetDemoData(): void {
        this.crudService.admin_setDemoData()  
    }


    debug_ReadDemoData(): void {
        this.crudService.admin_readBackFromDisk()
    }

    debug_PrintLocalTable(): void {
        console.log(this.historyDetails)
    }


    test_testFunction(): void {
        //note that months are 0 indexed so 0=Jan etc
        // let start = new Date(2022, 8, 1)
        // let end = new Date(2022, 9, 14)
        // let returnValue = getDates(start, end)
        // console.log (returnValue)
        
        
        this.crudService.recalculateGraphData()

        // this.crudService.recalculateHistoryAggregation()

        // calculateGraphAggregations
    }

    test_DateSerializer():void {
        let date = new Date()
        let string = JSON.stringify(date)
        console.log(string)
    }
}


function getDates(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = []
    let currentDate = startDate

    function addDays(date: Date, days: number) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      }

    while (currentDate <= endDate) {
      dates.push(currentDate)
      currentDate = addDays(currentDate, 1)
    }

    return dates
}
  
//   // Usage
//   const dates = getDates(new Date(2013, 10, 22), new Date(2013, 11, 25))
//   dates.forEach(function (date) {
//     console.log(date)
//   })

