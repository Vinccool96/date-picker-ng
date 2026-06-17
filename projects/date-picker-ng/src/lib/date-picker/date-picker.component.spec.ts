import { DatePickerComponent } from './date-picker.component';
import { CalendarMode } from '../common/types/calendar-mode';
import { By } from '@angular/platform-browser';
import { OverlayModule } from '@angular/cdk/overlay';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

describe('Component: DatePickerComponent', () => {
  let spectator: Spectator<DatePickerComponent>;
  let component: DatePickerComponent;

  const createComponent = createComponentFactory({
    component: DatePickerComponent,
    imports: [OverlayModule],
  });

  function setComponentMode(mode: CalendarMode) {
    spectator.setInput('mode', mode);
    component.init();
  }

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event goToCurrent when day calendar emit', () => {
    setComponentMode('day');
    component.showCalendars();
    spectator.detectChanges();

    spyOn(component.onGoToCurrent, 'emit');
    component.dayCalendarRef()?.onGoToCurrent.emit();
    expect(component.onGoToCurrent.emit).toHaveBeenCalledWith();
  });

  it('should emit event goToCurrent when month calendar emit', () => {
    setComponentMode('month');
    component.showCalendars();
    spectator.detectChanges();

    spyOn(component.onGoToCurrent, 'emit');
    component.monthCalendarRef()?.onGoToCurrent.emit();
    expect(component.onGoToCurrent.emit).toHaveBeenCalledWith();
  });

  it('should emit event goToCurrent when daytime calendar emit', () => {
    setComponentMode('daytime');
    component.showCalendars();
    spectator.detectChanges();

    spyOn(component.onGoToCurrent, 'emit');
    component.dayTimeCalendarRef()?.onGoToCurrent.emit();
    expect(component.onGoToCurrent.emit).toHaveBeenCalledWith();
  });

  it('should call onTouched when input is blurred', () => {
    setComponentMode('day');
    spyOn(component, 'onTouchedCallback');
    component.registerOnTouched(component.onTouchedCallback);

    const inputElement = spectator.debugElement.query(By.css('.dp-picker-input'));
    inputElement.triggerEventHandler('blur', {});

    expect(component.onTouchedCallback).toHaveBeenCalledWith();
  });
});
