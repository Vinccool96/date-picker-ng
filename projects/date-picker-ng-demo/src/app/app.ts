import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'dp-app',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {}
