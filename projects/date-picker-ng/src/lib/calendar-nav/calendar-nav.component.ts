import { ChangeDetectionStrategy, Component, EventEmitter, input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'dp-calendar-nav',
  templateUrl: './calendar-nav.component.html',
  styleUrls: ['./calendar-nav.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'theme()',
  },
})
export class CalendarNavComponent {
  public readonly label = input.required<string>();
  public readonly isLabelClickable = input(false);
  public readonly showLeftNav = input(true);
  public readonly showLeftSecondaryNav = input(false);
  public readonly showRightNav = input(true);
  public readonly showRightSecondaryNav = input(false);
  public readonly leftNavDisabled = input(false);
  public readonly leftSecondaryNavDisabled = input(false);
  public readonly rightNavDisabled = input(false);
  public readonly rightSecondaryNavDisabled = input(false);
  public readonly showGoToCurrent = input(true);
  public readonly theme = input('');

  @Output() onLeftNav = new EventEmitter<null>();
  @Output() onLeftSecondaryNav = new EventEmitter<null>();
  @Output() onRightNav = new EventEmitter<null>();
  @Output() onRightSecondaryNav = new EventEmitter<null>();
  @Output() onLabelClick = new EventEmitter<null>();
  @Output() onGoToCurrent = new EventEmitter<null>();

  leftNavClicked() {
    this.onLeftNav.emit();
  }

  leftSecondaryNavClicked() {
    this.onLeftSecondaryNav.emit();
  }

  rightNavClicked() {
    this.onRightNav.emit();
  }

  rightSecondaryNavClicked() {
    this.onRightSecondaryNav.emit();
  }

  labelClicked() {
    this.onLabelClick.emit();
  }
}
