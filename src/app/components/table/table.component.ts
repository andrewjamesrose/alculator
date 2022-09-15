import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  constructor(private crudService: CrudService) {
    this.crudService.getHistoryDetailed().subscribe(historyDetails=>{this.historyDetails = historyDetails})
  }

    historyDetails!: object[]

    columnFields: string[] = ['date', 'volume', 'abv', 'units_per', 'quantity', 'units_total', 'edit', 'delete']


    ngOnInit(): void {
    }

    calculateUnits(row: ResultRow): number {
        return row.abv * row.volume / 1000
    }


    calculateTotalUnits(row: ResultRow): number {
        return row.quantity * this.calculateUnits(row)
    }


    handleRowDelete(id: number):void {
        console.log("Deleting row: " + id)
    }


    handleRowEdit(id: number):void {
        console.log("Editing row: " + id)
    }


    debug_WriteDemoData(): void {
        this.crudService.admin_setDemoData()  
    }


    debug_ReadDemoData(): void {
        this.crudService.admin_readBackFromDisk()
    }

    debug_PrintLocalTable(): void {
        console.log(this.historyDetails)
    }

}


interface ResultRow {
    id:         number,
    date:       string
    volume:     number,
    abv:        number,
    quantity:   number
}
