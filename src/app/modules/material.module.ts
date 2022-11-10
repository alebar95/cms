import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule} from '@angular/material/table';
import {MatMenuModule} from '@angular/material/menu';




@NgModule({
  exports: [MatInputModule, MatFormFieldModule,MatTableModule, MatMenuModule],
})
export class MaterialModule {}
