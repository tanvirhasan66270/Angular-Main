import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { Header } from "./component/layout/header/header";
// import { Footer } from "./component/layout/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('jee_angular2_69');
}
