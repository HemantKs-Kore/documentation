import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
declare const $: any;
@Component({
  selector: 'kr-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss']
})
export class MarkdownEditorComponent implements OnInit {

  constructor() { }
  @Input() container;
  @Input() contentEditableElement;
  @Output() toggleShortCutsDiv = new EventEmitter <any>();
  @Output() saveText = new EventEmitter <any>();
  ngOnInit() {
  }
  getMessage() {
  let text = '';
  if (this.contentEditableElement) {
    text = $(this.container)[0].innerText;
  } else {
    text = $(this.container).val();
  }
  return text;
  }
  getRange() {
    const startIndex = $(this.container)[0].selectionStart;
    const endIndex = $(this.container)[0].selectionEnd;
    const selectedText = this.getMessage().substring(startIndex, endIndex);
    const stringMarkInfo = {
      startIndex,
      endIndex,
      text: selectedText
    };
    return stringMarkInfo;
  }
  getSelectionCharOffsetsWithin(element) {
    element = element[0];
    let  start = 0;
    let  end = 0;
    let  range;
    let  priorRange;
    if (typeof window.getSelection !== undefined) {
      range = window.getSelection().getRangeAt(0);
      priorRange = range.cloneRange();
      priorRange.selectNodeContents(element);
      priorRange.setEnd(range.startContainer, range.startOffset);
      start = priorRange.toString().length;
      end = start + range.toString().length;
      const selectedText = this.getMessage().substring(start, end);
      return {
        startIndex: start,
        endIndex: end,
        text: selectedText
      };
    }
  }

  getTextStartEndIndex() {
    const mainDiv = $($(this.container)[0]);
    const sel = this.getSelectionCharOffsetsWithin(mainDiv);
    return sel;
  }
  onSelected(type) {
    if (type === 'keyboardShortCut') {
     this.toggleShortCutsDiv.emit('toggle');
    } else {
      const _self: any = this;
      let range: any = {
        startIndex: 0,
          endIndex: 0,
          text: ''
      };
      if (this.contentEditableElement) {
        range = this.getTextStartEndIndex();
      } else {
        range = this.getRange();
      }
      _self[type](range.text, range);
    }
 }
 replaceAt(range, replacement , mainText) {
    if (range.startIndex >= mainText.length) {
      return mainText + replacement;
    }
    return mainText.substring(0, range.startIndex) + replacement + mainText.substring(range.endIndex);
}
 handleToolBarAction(text, range) {
    const replaceValue = this.getMessage() || '';
    const replacedValue = this.replaceAt(range, text, replaceValue);
    const newMessage = replacedValue;
    if (this.contentEditableElement) {
      const event = {
        action: 'save',
        text: newMessage
      };
      this.saveText.emit(event);
      $(this.container)[0].innerText = newMessage;
    } else {
      const _event = {
        action: 'save',
        text: newMessage
      };
      $(this.container).val(newMessage);
      this.saveText.emit(_event);
      $(this.container).focus();
    }
  }

  bold(text, range) {
    const verifyForUndo = (tex) => {

        let chunk;

        chunk = tex.replace(/\*/g, '');

        return ('*' + chunk + '*') === tex;

    };
    if (verifyForUndo(text)) {
        text = text.replace(/\*/g, '');
        this.handleToolBarAction(text, range);
        return;
    }

    text = '*' + text + '*';
    this.handleToolBarAction(text, range);
 }
 italic(text , range) {
  const verifyForUndo = (tex) => {
    let chunk;

    chunk = tex.replace(/~/g, '');

    return ('_' + chunk + '_') === tex;
    };
  if (verifyForUndo(text)) {
        text = text.replace(/_/g, '');
        this.handleToolBarAction(text, range);
        return;
    }
  text = '_' + text + '_';
  this.handleToolBarAction(text , range);
}
ordered(text, range) {
  text = text.split('\n');
  text = text.map((chunk, i) => {
      // tslint:disable-next-line:triple-equals
      if (chunk.search(/^([0-9]+?\.\s)/) != -1) {
          // tslint:disable-next-line:whitespace
          return chunk.replace(/^([0-9]+?\.\s)/,'');
      } else {
          return (i + 1) + '. ' + chunk;
      }
  });
  text = text.join('\n');
  this.handleToolBarAction(text, range);
}

unordered(text, range) {
  text = text.split('\n');
  text = text.map((chunk, i) => {
      // tslint:disable-next-line:triple-equals
      if (chunk.search(/\*\s/) != -1) {
          // tslint:disable-next-line:whitespace
          return chunk.replace(/\*\s/,'');
      } else {
          return '* ' + chunk;
      }
  });
  text = text.join('\n');
  this.handleToolBarAction(text, range);
}
indentLeft(text, range) {
  const verifyForUndo = (txt) => {
    let chunk;
    chunk = txt.replace(/^>>/, '');
    return ('>>' + chunk) === txt;
};
  if (verifyForUndo(text)) {
      text = text.replace(/^>>/, '');
      this.handleToolBarAction(text, range);
      return;
  }

  text = '>>' + text;
  this.handleToolBarAction(text, range);
}
indentRight(text, range) {
  const verifyForUndo = (txt) => {
    let chunk;
    chunk = txt.replace(/^<</, '');
    return ('<<' + chunk) === txt;
};
  if (verifyForUndo(text)) {
      text = text.replace(/^<</, '');
      this.handleToolBarAction(text, range);
      return;
  }

  text = '<<' + text;
  this.handleToolBarAction(text, range);
}
line(text, range) {
  text = text + '\n___';
  this.handleToolBarAction(text, range);
}
}
