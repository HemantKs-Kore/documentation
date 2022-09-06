import { Directive, AfterViewInit,ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appEllipsisActive]'
})
export class EllipsisActiveDirective{
 @HostListener('mouseover',[])
 onMouseOver(){
  setTimeout(()=>{
    const element = this.elementRef.nativeElement;
    if(element.offsetWidth<element.scrollWidth){
      element.title = element.innerHTML;
    }
    },500)
 }
  constructor(private elementRef:ElementRef) { }
}
