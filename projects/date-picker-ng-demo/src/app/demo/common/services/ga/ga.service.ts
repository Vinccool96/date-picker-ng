import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';

declare const gtag: (arg1: string, arg2: string, arg3: Record<string, string | number | null>) => void;

@Injectable({
  providedIn: 'root',
})
export class GaService {
  public emitEvent(eventCategory: string, eventLabel: string, eventValue: number | null = null): void {
    if (environment.production && window['gtag']) {
      gtag('event', 'send', {
        event_category: eventCategory,
        event_label: eventLabel,
        value: eventValue,
      });
    }
  }
}
