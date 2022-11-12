import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  /*
      Servizio che consente di notificare i vari componenti
      che si sottoscrivono al searchObservable che è stato digitato un carattere nella
      barra di ricerca nella toolbar
  */
  private _searchSubject = new Subject<string>();
  searchObservable = this._searchSubject.asObservable();

  constructor() { }

  emitSearch(value: string) {
    // emissione valore di ricerca nell'observable
    this._searchSubject.next(value);
  }
}
