import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'dp-app',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class App {}
