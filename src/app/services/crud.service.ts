import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DrinkHistoryAggregation, DrinkHistoryEntry } from '../common/interfaces-and-classes';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private _drinkHistory: DrinkHistoryEntry[]
  private drinkHistory$: BehaviorSubject<DrinkHistoryEntry[]> 

  constructor(private localStorage: LocalStorageService) {
    if(localStorage.getData('alculator_history') === null || localStorage.getData('alculator_history') === ''){
        console.log("creating new blank object")
        localStorage.saveData('alculator_history', JSON.stringify(new Object()))

    }

    this._drinkHistory = JSON.parse(localStorage.getData('alculator_history'), parseDate)

    this.drinkHistory$ = new BehaviorSubject(this._drinkHistory)
  }

    private readLocalStorage(): void{
        if(this.localStorage.getData('alculator_history') === null || this.localStorage.getData('alculator_history') === ''){
            this.localStorage.saveData('alculator_history', JSON.stringify(new Object()))

        } 
        
        this._drinkHistory = JSON.parse(this.localStorage.getData('alculator_history'), parseDate)
    }


    private writeToLocalStorage(): void{
        this.localStorage.saveData('alculator_history', JSON.stringify(this._drinkHistory))

    }

    
    getHistoryDetailed(): Observable<DrinkHistoryEntry[]> {
        return this.drinkHistory$.asObservable()
    }


    getHistoryAggregated(): DrinkHistoryAggregation[] {
        return []
    }


    deleteHistoryEntry(id: string) {
        // 'delete the entry in memory
        let _outputArray = this._drinkHistory.filter(item => item.id !== id)
        this._drinkHistory = _outputArray

        // 'write memory back to disk
        this.writeToLocalStorage()
    
        // 'read back memory to ensure sync
        this.readLocalStorage

        this.drinkHistory$.next(this._drinkHistory)
    }


    admin_getDataFromMemory(): object[] {
        return this._drinkHistory
    }


    admin_setData(inputData: DrinkHistoryEntry[]): void {
        this._drinkHistory = inputData
        this.writeToLocalStorage()
        
    }


    admin_setDemoData(): void {
        this.admin_setData(demoStatsTable.slice())
        console.log("updated local storage with initial demo data")
        this.drinkHistory$.next(this._drinkHistory)
    }


    admin_readBackFromDisk(): void {
        console.log("reading from disk to console:")
        let tempObject = JSON.parse(this.localStorage.getData('alculator_history'), parseDate)
        // console.log(this.localStorage.getData('alculator_history'))
        console.log(tempObject) 
    }

}


const isoDateRegex: RegExp = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

function isIsoDate(value: string) {
  return isoDateRegex.exec(value);
}

function parseDate(ignored: any, value: any) {
  if (typeof value !== "string") {
    return value;
  }

  if (isIsoDate(value)) {
    return new Date(value);
  }

  return value;
}


const demoStatsTable: DrinkHistoryEntry[] = [
    {
        id:         '716aec4c-2131-4a88-93de-1491be63f0d5',
        date:       new Date('2022-08-06T13:44:58.526Z'),
        volume:     440,
        abv:        5,
        quantity:   2
    },
    {
        id:         '73c73ff8-4ca9-4ad2-b154-84f838d428aa',
        date:       new Date('2022-08-06T13:44:58.526Z'),
        volume:     175,
        abv:        13,
        quantity:   1
    },
    {
        id:         'a987cf62-a6c9-409e-bff1-5c334130c708',
        // date:       '07-Aug-22', 
        date:       new Date('2022-08-07T13:44:58.526Z'), 
        volume:     250,
        abv:        12,
        quantity:   1
    },

    {
        id:         '74691ffe-eaa7-4f57-8f4e-c83412c3fa69',
        // date:       '09-Aug-22',
        date:       new Date('2022-08-09T13:44:58.526Z'),
        volume:     50,
        abv:        40,
        quantity:   2
    },
    {
        id:         '220cf793-816f-4a54-b376-408e44878e74',
        // date:       '09-Aug-22',
        date:       new Date('2022-08-09T13:44:58.526Z'),
        volume:     50,
        abv:        40,
        quantity:   1
    },
    {
        id:         '7d7da60b-6388-4d41-8d78-69b02e573237',
        // date:       '09-Aug-22',
        date:       new Date('2022-08-09T13:44:58.526Z'),
        volume:     50,
        abv:        40,
        quantity:   1
    },

    {
        id:         '6ba14632-08d1-4375-a958-fc25fc673d08',
        // date:       '08-Aug-22',
        date:       new Date('2022-08-08T13:44:58.526Z'),
        volume:     568,
        abv:        4.2,
        quantity:   3
    },
  ]


  