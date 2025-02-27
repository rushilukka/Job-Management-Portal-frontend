import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterComponent } from './shared/Toaster/toaster.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'job-management-fend';
}
