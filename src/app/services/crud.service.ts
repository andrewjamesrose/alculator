import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { GraphData, IDrinkHistoryAggregation, IDrinkHistoryEntry, IGraphData, IGraphDataWithSum as IGraphDataWithStats } from '../common/interfaces-and-classes';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private _drinkHistory: IDrinkHistoryEntry[]
  private drinkHistory$: BehaviorSubject<IDrinkHistoryEntry[]> 

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

    
    getHistoryDetailed(): Observable<IDrinkHistoryEntry[]> {
        return this.drinkHistory$.asObservable()
    }


    getHistoryAggregated(): IDrinkHistoryAggregation[] {
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


    recalculateHistoryAggregation(): void {
        // get a copy of the detailed list in memory
        let data = [...this._drinkHistory]

        let myVar = calculateAggregations(data)
        console.log(myVar) 
    }

    
    recalculateGraphData(): void {

        let newList = calculateGraphAggregations([...this._drinkHistory])

        computeGraphData(newList)
        // create a history list for each date between (and including) the min and max
        

        // merge with detailed list
    }


    mostRecentDrink(): Date {
        let maxDate = new Date(Math.max(...this._drinkHistory.map(item => item.date.getTime())))
        return truncatedDate(maxDate)
    }


    daySinceLastDrink(): number {
        let now = truncatedDate(new Date())
        let recent = this.mostRecentDrink()
        return dateDiff(recent, now)
    }



    admin_getDataFromMemory(): object[] {
        return this._drinkHistory
    }


    admin_setData(inputData: IDrinkHistoryEntry[]): void {
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


const demoStatsTable: IDrinkHistoryEntry[] = [
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
    {
        id:         '6ba14632-08d1-4375-a958-fc25fc673d08',
        // date:       '20-Aug-22',
        date:       new Date('2022-08-20T10:41:58.526Z'),
        volume:     568,
        abv:        4.2,
        quantity:   3
    },
  ]



 export function truncatedDate(longDate: Date): Date {
    let outputDate: Date = new Date(longDate.getFullYear(), longDate.getMonth(), longDate.getDate())
    return outputDate
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

function computeGraphData(inputData: IGraphData[]): void {
    let output = [... inputData]

    // output = output.map(obj => ({...obj, rollingSum: 0}))
    
    // output = output.map(obj => ({...obj, rollingSum:  output.filter( (element) => {element.date <= obj.date && element.date >= subtractNDays(obj.date, 7) } )
    //                                                                             .map(element => element.totalunits)
    //                                                                             .reduce((runningTotal, totalUnits) => runningTotal + totalUnits, 0 ) }))

    let localGraphData = output.map(object => calculateRollingSum(object, output, 6))

    // return output
     console.log(localGraphData)

}

function calculateRollingSum(object: IGraphData, wholeList: IGraphData[], sumWindow: number): IGraphDataWithStats {
    let currentDate = object.date
    let pastDate = subtractNDays(object.date, sumWindow)

    let filteredList = wholeList.filter(element => element.date <= currentDate && element.date >=pastDate)
    let outputValue = filteredList.map(element => element.totalunits).reduce((runningSumVal, currentVal) => runningSumVal + currentVal, 0)  

    let output: IGraphDataWithStats = {...object, rollingSum: outputValue}

    return output
}


function calculateAggregations(inputHistory: IDrinkHistoryEntry[]): IGraphData[] {
    // note that dates must be serialised in order to be directly comparable
    let uniqueDatesSet = new Set([...inputHistory.map(item=>truncatedDate(item.date).getTime())])
    
    let output: IGraphData[] = [...uniqueDatesSet].map(uniquedate => {
                                                                let sumValue = inputHistory.filter(row=>truncatedDate(row.date).getTime()===uniquedate)
                                                                                        .map(row => {
                                                                                                let val = calculateTotalUnits(row) 
                                                                                                return val
                                                                                            }
                                                                                        )
                                                                                        .reduce((runningSumVal, currentVal) => runningSumVal + currentVal, 0)
                                                                
                                                                return new GraphData(new Date(uniquedate), sumValue)
                                                            }
                                            )

    return output

}

function calculateGraphAggregations(inputHistory: IDrinkHistoryEntry[]): IGraphData[]{
    let maxDate = new Date(Math.max(...inputHistory.map(item => item.date.getTime())))
    let minDate = new Date(Math.min(...inputHistory.map(item => item.date.getTime())))
    
    //console.log(this._drinkHistory)

    //truncate dates
    maxDate = truncatedDate(maxDate)
    minDate = truncatedDate(minDate)

    let dateList: Date[] = getDates(minDate, maxDate)

    let output: IGraphData[] = dateList.map(uniquedate => {
                                                let sumValue = inputHistory.filter(row=>truncatedDate(row.date).getTime()===uniquedate.getTime())
                                                                            .map(row => {
                                                                                    let val = calculateTotalUnits(row) 
                                                                                    return val
                                                                                }
                                                                            )
                                                                            .reduce((runningSumVal, currentVal) => runningSumVal + currentVal, 0)
        
                                                return new GraphData(new Date(uniquedate), sumValue)
                                            }
                                        )

    
    return output
}


function subtractNDays(date: Date, n_days: number): Date {
    let outputDate: Date = new Date(date);
    outputDate.setDate(outputDate.getDate()-n_days);
    return outputDate
}

function dateDiff(past: Date, future: Date): number {
    return Math.round((future.getTime()-past.getTime())/(1000*60*60*24));
}

function calculateUnits(row: IDrinkHistoryEntry): number {
    return row.abv * row.volume / 1000
}


function calculateTotalUnits(row: IDrinkHistoryEntry): number {
    return row.quantity * calculateUnits(row)
}

