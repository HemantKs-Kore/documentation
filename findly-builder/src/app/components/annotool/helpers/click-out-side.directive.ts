import {
    Directive,
    ElementRef,
    Output,
    EventEmitter,
    HostListener,
    OnInit
} from "@angular/core";
import { fromEvent } from "rxjs";
import { take } from "rxjs/operators";
/* Click out side Directive  */
/* Syntax: .html file => In element add (clickOutside)="overRectange =null;"  */
/* 
    Created on : 22 Sep, 2020
    Author     : Pradeep muniganti
*/
@Directive({
    selector: "[clickOutside]"
})
export class ClickOutSideDirective implements OnInit {
    @Output() clickOutside = new EventEmitter();

    captured = false;

    constructor(private elRef: ElementRef) { }

    @HostListener("document:click", ["$event.target"])
    onClick(target) {
        if (!this.captured) {
            return;
        }

        if (!this.elRef.nativeElement.contains(target)) {
            this.clickOutside.emit();
        }
    }

    ngOnInit() {
        fromEvent(document, "click", { capture: true })
            .pipe(take(1))
            .subscribe(() => (this.captured = true));
    }
    ngOnDestroy() {
        window.removeEventListener("click", this.onClick, false);
    }
}
