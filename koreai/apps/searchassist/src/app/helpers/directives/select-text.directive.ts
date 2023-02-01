import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
declare const $:any;
@Directive({
  selector: '[appSelectText]'
})
export class SelectTextDirective {
  @Output() selectedIndex=new EventEmitter();
  // @Output() selectedCursorIndex=new EventEmitter();
  @HostListener('mouseup',['$event'])
  onMouseUp(e){
    setTimeout(()=>{
      this.handleContextMenu(e);
      e.preventDefault();
    },500);
  }
  // @HostListener("focus",['$event'])
  // onFocus(e) {
  //           console.log("event",e)
  // }
  constructor(private el:ElementRef) { }

  handleContextMenu = (event) => {
          let _selectedText = this.getSelectedText();
          if(_selectedText){
            _selectedText =  _selectedText.trim();
          }          
  }

  getSelectedText = () => {
    let text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
      if(text){
        this.getTextStartEndIndex();
      }
      
    } 
    return text;
  }

  getTextStartEndIndex = () => {
    const mainDiv = this.el.nativeElement;
    const sel = this.getSelectionCharOffsetsWithin(mainDiv);
    return sel;
  }

  getSelectionCharOffsetsWithin(element) {
    let start = 0, end = 0;
    let sel, range, priorRange,text;
    if (typeof window.getSelection != "undefined") {
      range = window.getSelection().getRangeAt(0);
      priorRange = range.cloneRange();
      priorRange.selectNodeContents(element);
      priorRange.setEnd(range.startContainer, range.startOffset);
      start = priorRange.toString().length;
      end = start + range.toString().length;
      text = window.getSelection().toString().trim();
    } else if (typeof document.getSelection() != "undefined" &&
      (sel = document.getSelection()).type != "Control") {
      range = sel.createRange();
      priorRange = document.createRange();
      priorRange.moveToElementText(element);
      priorRange.setEndPoint("EndToStart", range);
      start = priorRange.text.length;
      end = start + range.text.length;
    }
    this.selectedIndex.emit({start:start,end:end,text:text});
  }
}
