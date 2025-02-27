import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterComponent } from './shared/Toaster/toaster.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ToasterComponent],
  // imports: [ToasterComponent], //   Import the standalone component
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'job-management-fend';
}
