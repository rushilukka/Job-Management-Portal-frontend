import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridComponent } from './ag-grid/ag-grid.component';
import { AllCommunityModule, ModuleRegistry, type ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component


ModuleRegistry.registerModules([AllCommunityModule]);

@NgModule({
  declarations: [
    AgGridComponent
  ],
  imports: [ 
    AgGridAngular,
    CommonModule
  ],
  exports:[AgGridComponent]
})
export class SharedModule { }
