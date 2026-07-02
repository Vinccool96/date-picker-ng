import { CalendarValue } from './calendar-value';
import { ValidationErrors } from '@angular/forms';

export type DateValidator = (inputValue: CalendarValue) => ValidationErrors | null;
