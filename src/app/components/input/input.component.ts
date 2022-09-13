import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DRINK_NAMED_VOLUMES } from 'src/app/common/constants';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

    quantities: number[]

    constructor() {
        this.quantities =  Array(12).fill(0).map((x,i)=>i+1)
    }

    namedVolumes = DRINK_NAMED_VOLUMES

  
    bibationForm = new FormGroup({
        date: new FormControl<Date>(new Date()),
        drink: new FormControl<string>(''),
        namedVol: new FormControl<string>(''),
        quantity: new FormControl<number>(1)
    })


    drinkForm = new FormGroup({
        name: new FormControl<string|null>(''),
        abv: new FormControl<number|null>(null),
        volume: new FormControl<number|null>(null),
    })

    // preDefinedVol = new FormGroup({

    // })


  ngOnInit(): void {
  }

}
