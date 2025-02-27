import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToasterService } from './toaster.service';

@Component({
  selector: 'app-toaster',
  standalone: true, //   Make it standalone
  imports: [CommonModule], //   Ensure required modules are included
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasterService.toasts" class="toast {{ toast.type }}">
      <p>{{ toast.message }}</p>
        <strong>{{ toast.title }}</strong>
      </div>
    </div>
  `,
  styleUrls: ['./toaster.component.scss'],
})
export class ToasterComponent {
  constructor(public toasterService: ToasterService) {}
}
