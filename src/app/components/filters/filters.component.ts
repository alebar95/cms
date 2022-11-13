import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { FilterItem } from 'src/app/models/filter-item';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  @Input() filterList?: FilterItem[];
  @Output() filterChanged = new EventEmitter<boolean>();

  get activeFilters() : FilterItem[]{
    return this.filterList?.filter((filter) => filter.active) ?? [];
  }

  getControl(control: AbstractControl): FormControl{
    return control as FormControl;
 }

  constructor() { }

  ngOnInit(): void {
  }

  onSelectionClosed(filterItem: FilterItem) {
    // se è stato selezionato almeno un valore per i filtri di tipo select
    if (filterItem.control) {
      filterItem.active = filterItem.control?.value.length  ? true : false;
    }
    // se sono stati selezionati almeno uno tra start date ed end date nel date picker
    else if (filterItem.controlsGroup && filterItem.controlsGroup.controls) {
      filterItem.active = Object.keys(filterItem.controlsGroup.controls).filter((key) => filterItem.controlsGroup!.controls[key].value).length >= 1 ? true : false;
    }
    this.filterChanged.emit(true);
  }
  reset() {
    this.filterList?.forEach((filter) => {
      filter.active = false;
      filter.control?.reset();
      filter.controlsGroup?.reset();
    });
    this.filterChanged.emit(true);
  }

}
