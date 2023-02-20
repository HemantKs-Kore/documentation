import { Directive, ElementRef, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appOutsideClicked]',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class OutsideClickedDirective {
  @Output()
  clickedOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  onClick(event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.clickedOutside.emit();
    }
  }
}
