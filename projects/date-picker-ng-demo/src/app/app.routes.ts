/* eslint-disable unicorn/prefer-await */

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'daytimePicker',
  },
  {
    path: 'daytimePicker',
    loadComponent: () =>
      import('./demo/date-pickers/day-time/day-time-demo/day-time-demo.component').then(
        (component) => component.DayTimeDemoComponent,
      ),
  },
  {
    path: 'daytimeInline',
    loadComponent: () =>
      import('./demo/date-pickers/day-time/day-time-inline-demo/day-time-inline-demo.component').then(
        (component) => component.DayTimeInlineDemoComponent,
      ),
  },
  {
    path: 'daytimeDirective',
    loadComponent: () =>
      import('./demo/date-pickers/day-time/day-time-directive-demo/day-time-directive-demo.component').then(
        (component) => component.DayTimeDirectiveDemoComponent,
      ),
  },
  {
    path: 'dayPicker',
    loadComponent: () =>
      import('./demo/date-pickers/day/day-demo/day-demo.component').then((component) => component.DayDemoComponent),
  },
  {
    path: 'dayInline',
    loadComponent: () =>
      import('./demo/date-pickers/day/day-inline-demo/day-inline-demo.component').then(
        (component) => component.DayInlineDemoComponent,
      ),
  },
  {
    path: 'dayDirective',
    loadComponent: () =>
      import('./demo/date-pickers/day/day-directive-demo/day-directive-demo.component').then(
        (component) => component.DayDirectiveDemoComponent,
      ),
  },
  {
    path: 'monthPicker',
    loadComponent: () =>
      import('./demo/date-pickers/month/month-demo/month-demo.component').then(
        (component) => component.MonthDemoComponent,
      ),
  },
  {
    path: 'monthInline',
    loadComponent: () =>
      import('./demo/date-pickers/month/month-inline/month-inline-demo.component').then(
        (component) => component.MonthInlineDemoComponent,
      ),
  },
  {
    path: 'monthDirective',
    loadComponent: () =>
      import('./demo/date-pickers/month/month-directive-demo/month-directive-demo.component').then(
        (component) => component.MonthDirectiveDemoComponent,
      ),
  },
  {
    path: 'timePicker',
    loadComponent: () =>
      import('./demo/date-pickers/time/time-demo/time-demo.component').then((component) => component.TimeDemoComponent),
  },
  {
    path: 'timeInline',
    loadComponent: () =>
      import('./demo/date-pickers/time/time-inline-demo/time-inline-demo.component').then(
        (component) => component.TimeInlineDemoComponent,
      ),
  },
  {
    path: 'timeDirective',
    loadComponent: () =>
      import('./demo/date-pickers/time/time-directive-demo/time-directive-demo.component').then(
        (component) => component.TimeDirectiveDemoComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
