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

  @Output() public onLeftNav = new EventEmitter<null>();
  @Output() public onLeftSecondaryNav = new EventEmitter<null>();
  @Output() public onRightNav = new EventEmitter<null>();
  @Output() public onRightSecondaryNav = new EventEmitter<null>();
  @Output() public onLabelClick = new EventEmitter<null>();
  @Output() public onGoToCurrent = new EventEmitter<null>();

  protected leftNavClicked() {
    this.onLeftNav.emit();
  }

  protected leftSecondaryNavClicked() {
    this.onLeftSecondaryNav.emit();
  }

  protected rightNavClicked() {
    this.onRightNav.emit();
  }

  protected rightSecondaryNavClicked() {
    this.onRightSecondaryNav.emit();
  }

  protected labelClicked() {
    this.onLabelClick.emit();
  }
}
