import { FormControl, FormGroup } from "@angular/forms";

export interface FilterItem {
  name: string;
  type: string;
  options?: Array<{id: number, name: string}>;
  control?: FormControl;
  controlsGroup?: FormGroup;
  active: boolean;
}
