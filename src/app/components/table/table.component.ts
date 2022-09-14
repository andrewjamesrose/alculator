import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  constructor(private crudService: CrudService) { }

  columnFields: string[] = ['date', 'volume', 'abv', 'units_per', 'quantity', 'units_total', 'edit', 'delete']

  
  demoStatsTable = [
    {
        id:         123,
        date:       '06-Aug-22',
        volume:     440,
        abv:        5,
        quantity:   2
    },
    {
        id:         234,
        date:       '07-Aug-22',
        volume:     250,
        abv:        12,
        quantity:   1
    },
    {
        id:         345,
        date:       '08-Aug-22',
        volume:     568,
        abv:        4.2,
        quantity:   3
    },
    {
        id:         456,
        date:       '09-Aug-22',
        volume:     50,
        abv:        40,
        quantity:   2
    },
  ]

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

}



interface ResultRow {
    id:         number,
    date:       string
    volume:     number,
    abv:        number,
    quantity:   number
}
