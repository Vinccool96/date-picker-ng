import { ChangeDetectionStrategy, Component, input, output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'dp-calendar-nav',
  templateUrl: './calendar-nav.component.html',
  styleUrls: ['./calendar-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'theme()',
  },
})
export class CalendarNavComponent {
  /*
   *****************************************************************************************************************
   * inputs
   *****************************************************************************************************************
   */

  public readonly isLabelClickable = input(false);
  public readonly label = input.required<string>();
  public readonly leftNavDisabled = input(false);
  public readonly leftSecondaryNavDisabled = input(false);
  public readonly rightNavDisabled = input(false);
  public readonly rightSecondaryNavDisabled = input(false);
  public readonly showGoToCurrent = input(true);
  public readonly showLeftNav = input(true);
  public readonly showLeftSecondaryNav = input(false);
  public readonly showRightNav = input(true);
  public readonly showRightSecondaryNav = input(false);
  public readonly theme = input('');

  /*
   *****************************************************************************************************************
   * outputs
   *****************************************************************************************************************
   */

  public readonly onGoToCurrent = output();
  public readonly onLabelClick = output();
  public readonly onLeftNav = output();
  public readonly onLeftSecondaryNav = output();
  public readonly onRightNav = output();
  public readonly onRightSecondaryNav = output();

  protected labelClicked(): void {
    this.onLabelClick.emit();
  }

  protected leftNavClicked(): void {
    this.onLeftNav.emit();
  }

  protected leftSecondaryNavClicked(): void {
    this.onLeftSecondaryNav.emit();
  }

  protected rightNavClicked(): void {
    this.onRightNav.emit();
  }

  protected rightSecondaryNavClicked(): void {
    this.onRightSecondaryNav.emit();
  }
}
