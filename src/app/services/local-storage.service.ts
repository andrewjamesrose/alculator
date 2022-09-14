import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

    // purely to stop users doctoring their stats
    // ...unless they read the code in which case, fair play

  private enckey = 'oZZ%9(pa{fAC}<9'

  public saveData(key: string, value: string) {
    localStorage.setItem(key, this.encrypt(value));
  }

  public getData(key: string) {
    let data = localStorage.getItem(key)|| "";
    return this.decrypt(data);
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.enckey).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.enckey).toString(CryptoJS.enc.Utf8);
  }

}

