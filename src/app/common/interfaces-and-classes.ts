export interface IDrink {
    volume: number
    abv: number
    name: string
}


export class Drink implements IDrink {
    volume: number
    abv: number
    name
    
    constructor(name: string, volume: number, abv: number){
        this.volume = volume
        this.abv = abv
        this.name = name
    }

    getUnits(): number {
        return this.volume * this.abv / 1000
    }

}



export interface IBibation {
    date: Date
    drink: Drink
}


export class Bibation implements IBibation {
    date: Date
    drink: Drink

    constructor(date: Date, drink: Drink){
        this.date = date
        this.drink = drink
    }
    
}


export interface IDrinkHistoryEntry {
    id:         string,
    date:       Date,
    volume:     number,
    abv:        number,
    quantity:   number
}


export interface IDrinkHistoryAggregation {
    date: Date,
    volume: number,
    abv: number,
    quantity: number
}


export interface IGraphData {
    date: Date
    totalunits: number
}


export class GraphData implements IGraphData {
    date: Date
    totalunits: number

    constructor(date: Date, totalUnits: number){
        this.date = date
        this.totalunits = totalUnits
    }

    addUnits(additionalUnits: number){
        if(additionalUnits > 0){
            this.totalunits = this.totalunits + additionalUnits
        }
    }
}


export interface IGraphDataWithSum extends IGraphData {
    rollingSum: number
}
