import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  constructor() { }

  
    bibationForm = new FormGroup({
        date: new FormControl(''),
        drink: new FormControl<string>('')
    })


    drinkForm = new FormGroup({
        name: new FormControl<string|null>(''),
        abv: new FormControl<number|null>(null),
        volume: new FormControl<number|null>(null),
    })


  ngOnInit(): void {
  }

}
