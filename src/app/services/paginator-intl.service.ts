import { Injectable } from '@angular/core';
import { MatPaginatorIntl} from '@angular/material/paginator';
import { TranslateService } from "@ngx-translate/core";
@Injectable(
  {
    providedIn: 'root'
  }
)
export class PaginatorIntlService extends MatPaginatorIntl {
  translate?: TranslateService;

   override getRangeLabel = (page: number, pageSize: number, length: number) => {
    const of = this.translate ? this.translate.instant('PAGINATOR.OF') : 'OF';
    if (length === 0 || pageSize === 0) {
      return '0 ' + of + ' ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    /* lo startIndex è il numero del primo elemento di ogni pagina,
    l'endIndex è il numero dell'ultimo elemento di ogni pagina
    */
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' ' + of + ' ' + length;
  }

  injectTranslateService(translate: TranslateService) {
    this.translate = translate;
    this.translate.onLangChange.subscribe(() => {
      this.translateLabels();
    });
    this.translateLabels();
  }

  translateLabels() {
    super.itemsPerPageLabel = this.translate?.instant('PAGINATOR.ITEMS_PER_PAGE');
    super.nextPageLabel = this.translate?.instant('PAGINATOR.NEXT_PAGE');
    super.previousPageLabel = this.translate?.instant('PAGINATOR.PREVIOUS_PAGE');
    this.changes.next();
  }

}
