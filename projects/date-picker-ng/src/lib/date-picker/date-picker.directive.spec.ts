import { UtilsService } from '../common/services/utils/utils.service';
import { DatePickerDirective } from './date-picker.directive';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';

describe('DatePickerDirective', () => {
  let spectator: SpectatorDirective<DatePickerDirective>;
  let directive: DatePickerDirective;

  const createDirective = createDirectiveFactory({
    directive: DatePickerDirective,
  });

  beforeEach(() => {
    spectator = createDirective(`
<div id="top">
  <span class="wrapper">
    <input [dpDayPicker]="{}" theme=""  type="text" />
  </span>
</div>
    `);
    directive = spectator.directive;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should check UtilsService.closestParent', () => {
    const service = spectator.inject(UtilsService);
    const inputElement = spectator.query('input') as HTMLInputElement;

    const wrapperElement = service.closestParent(inputElement, '.wrapper');
    expect(wrapperElement?.tagName).toBe('SPAN');
    expect(wrapperElement?.className).toBe('wrapper');

    const topElement = service.closestParent(inputElement, '#top');
    expect(topElement?.tagName).toBe('DIV');
    expect(topElement?.id).toBe('top');

    const notFoundElement = service.closestParent(inputElement, '.notFound');
    expect(notFoundElement).toBeUndefined();
  });
});
