import { ValidationErrors } from '@angular/forms';

import { CalendarValue } from './calendar-value';

export type DateValidator = (inputValue: CalendarValue) => ValidationErrors | null;
