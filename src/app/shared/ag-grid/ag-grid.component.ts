import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ag-grid',
  standalone: false,
  templateUrl: './ag-grid.component.html',
  styleUrl: './ag-grid.component.scss'
})
export class AgGridComponent {
  @Input() rowData: any[] = []; // Receives rowData from parent
  @Input() colName: any[] = []; // Receives columnDefs from parent
}
