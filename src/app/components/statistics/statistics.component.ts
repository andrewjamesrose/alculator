import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  constructor(private crudService: CrudService) { 
    this.mostRecent = this.crudService.mostRecentDrink()
    this.daysSinceLast = this.crudService.daySinceLastDrink()
  }

    mostRecent: Date
    daysSinceLast: number


  ngOnInit(): void {
  }

}
