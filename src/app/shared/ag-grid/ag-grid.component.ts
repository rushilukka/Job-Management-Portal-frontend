import { Component, Input } from '@angular/core';
 import { ColDef, GridOptions, GridApi, Column, GridReadyEvent } from 'ag-grid-community';
import { AgButtonComponent } from '../../admin/components/ag-button/ag-button.component';

@Component({
  selector: 'app-ag-grid',
  standalone: false,
  templateUrl: './ag-grid.component.html',
  styleUrl: './ag-grid.component.scss'
})
export class AgGridComponent {
 
  @Input() rowData: Record<string, any>[] = []; // Accepts array of objects with unknown keys
  @Input() colName: ColDef[] = []; // Column definitions for AG Grid

  gridApi!: GridApi; // AG Grid API
  gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 10,
    rowHeight: 50, // Set a fixed row height for even spacing
    domLayout: 'autoHeight', // Adjusts row height dynamically
    defaultColDef: {
      flex: 1, // Ensures columns take equal width
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true
    }
  };
  
  // Called when grid is ready
  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  frameworkComponents = {
    agButtonRenderer: AgButtonComponent, // Register framework component
  };

  // Quick Filter Function
  onQuickFilterChanged(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', inputElement.value); // Works in the latest AG Grid versions
    }
  }
  
  // Export CSV Function
  exportToCSV(): void {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv();
    }
  }

}
