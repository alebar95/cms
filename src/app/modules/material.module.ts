import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  exports: [
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
  ],
})
export class MaterialModule {}
