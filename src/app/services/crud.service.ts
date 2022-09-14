import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  drinkHistory: object[]

  constructor(private localStorage: LocalStorageService) {
    if(localStorage.getData('alculator_history') === null || localStorage.getData('alculator_history') === ''){
        console.log("creating new blank object")
        localStorage.saveData('alculator_history', JSON.stringify(new Object()))

    }

    this.drinkHistory = JSON.parse(localStorage.getData('alculator_history'))
  }

    private readLocalStorage(): void{
        if(this.localStorage.getData('alculator_history') === null || this.localStorage.getData('alculator_history') === ''){
            this.localStorage.saveData('alculator_history', JSON.stringify(new Object()))

        } 
        
        this.drinkHistory = JSON.parse(this.localStorage.getData('alculator_history'))
    }

    private writeToLocalStorage(): void{
        this.localStorage.saveData('alculator_history', JSON.stringify(this.drinkHistory))
    }

    admin_getDataFromMemory(): object[] {
        return this.drinkHistory
    }

    admin_setData(inputData: object[]): void {
        this.drinkHistory = inputData
        this.writeToLocalStorage()
        
    }

    admin_setDemoData(): void {
        this.admin_setData(demoStatsTable)
        console.log("updated local storage with initial demo data")
    }

    admin_readBackFromDisk(): void {
        console.log("reading from disk to console:")
        console.log(this.localStorage.getData('alculator_history'))
    }

}


const demoStatsTable = [
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