import { Injectable } from '@angular/core';
import {
  first,
  from,
  fromEvent,
  map,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageConverterService {
  private fileReader = new FileReader(); // per convertire il file dell'immagine in base64

  constructor() {}

  // da file binario a base64
  toBase64(file: File): Observable<string | ArrayBuffer | null> {
    this.fileReader.readAsDataURL(file);
    return merge(
      fromEvent<ProgressEvent>(this.fileReader, 'error'),
      fromEvent<ProgressEvent>(this.fileReader, 'load')
    ).pipe(
      switchMap((event) => {
        // errore nella conversione
        if (event.type === 'error') {
          return throwError(() => 'error');
        } else return of(event);
      }),
      map((_) => {
        // conversione completa
        return this.fileReader.result;
      })
    );
  }

  // da base64 a blob
  toBlob(base64string: string): Observable<Blob | never> {
    return from(
      fetch(base64string)
        .then((res) => res.blob())
        .catch((error) => error)
    ).pipe(
      switchMap((value) => {
        if (value instanceof Blob)
        return of(value);
        else return throwError(() => value) // in caso di errore
      })
    );

  }
}
