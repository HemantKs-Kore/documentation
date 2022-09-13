import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
declare const $:any;
@Directive({
  selector: '[appSelectText]'
})
export class SelectTextDirective {
  @Output() selectedIndex=new EventEmitter();
  @HostListener('mouseup',['$event'])
  onMouseUp(e){
    setTimeout(()=>{
      this.handleContextMenu(e);
      e.preventDefault();
    },500);
  }
  constructor(private el:ElementRef) { }

  handleContextMenu = (event) => {
          var _selectedText = this.getSelectedText();
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
    var mainDiv = this.el.nativeElement;
    var sel = this.getSelectionCharOffsetsWithin(mainDiv);
    return sel;
  }

  getSelectionCharOffsetsWithin(element) {
    var start = 0, end = 0;
    var sel, range, priorRange,text;
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
