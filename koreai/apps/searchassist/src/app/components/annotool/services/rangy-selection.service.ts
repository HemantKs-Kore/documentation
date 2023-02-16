import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import * as rangy from 'rangy';

// declare let rangy;

@Injectable({
  providedIn: 'root',
})
export class RangySelectionService {
  private removalTextLoader = new Subject<boolean>();
  private polling = new Subject<boolean>();
  constructor() {
    // console.log(rangy);
    rangy.init();
    rangy.allowSerialization; // allowing serializatoin
    if (rangy.features.implementsControlRange) {
      // console.log("supprts feature rangecontrol",rangy.features);
    }
    const serializerModule = rangy.modules.Serializer;
    if (rangy.supported && serializerModule && serializerModule.supported) {
      // console.log("supprts feature rangecontrol2", serializerModule);
    }
  }
  // Range Selection viewportRectangle
  viewportRectangle() {
    const selection = document.getSelection();
    const range = selection.getRangeAt(0);
    const viewportRectangle = range.getBoundingClientRect();
    return viewportRectangle || null;
  }
  // Range Selection Text
  rangeSelectionText() {
    let text = rangy.getSelection().trim().toString();
    text = text.trim();
    return text;
  }
  // Range selection html
  rangeSelectionHtml() {
    return rangy.getSelection().toHtml();
  }
  // Text highlightion
  getTextHighlighter(className) {
    let highlighter = null;
    if (!className) {
      className = ''; //no-highlight
    }
    const classApplierModule = rangy.modules.ClassApplier;
    if (rangy.supported && classApplierModule && classApplierModule.supported) {
      if (className) {
        highlighter = rangy.createHighlighter();
        highlighter.addClassApplier(rangy.createClassApplier(className), {
          ignoreWhiteSpace: true,
          tagNames: ['span'],
          elementTagName: 'a',
          elementProperties: {
            href: '#',
            onclick: function () {
              const highlight = highlighter.getHighlightForElement(this);
              // console.log("Hightlight" + highlight);
              if (
                window.confirm('Delete this note (ID ' + highlight.id + ')?')
              ) {
                highlighter.removeHighlights([highlight]);
              }
              return false;
            },
          },
        });
        highlighter.highlightSelection(className);
        rangy.getSelection().removeAllRanges();
      }
    } else {
      // console.log("Class applier not supports");
    }
    return highlighter;
  }
  // Remove text highlighter
  removeTextHighlighter(highlighter) {
    if (highlighter && highlighter.highlights) {
      highlighter.removeHighlights(highlighter.highlights); // specific highlight
    } else {
      // console.log("No highlighter found");
    }
  }
  // remove classes
  removeClasses(className) {
    // console.log(this)
    const query = document.querySelectorAll(className);
    query.forEach((item, index) => {
      item.remove(className);
    });
  }
  // Seriliation
  getSerilization() {
    const selObj = rangy.getSelection();
    const coordVal = rangy.serializeSelection(selObj, true);
    return coordVal;
  }
  // Deserilization
  deserialization(serializeRangeAr: any) {
    try {
      if (serializeRangeAr.length) {
        // deserialize with related serialized coords only
        this.setRmvLoader(true);
        serializeRangeAr.forEach((highlighterval: any, index) => {
          if (highlighterval && Object.keys(highlighterval).length) {
            if (rangy.canDeserializeSelection(highlighterval.coords)) {
              let loop;
              try {
                loop = rangy.deserializeSelection(highlighterval.coords);
              } catch (ex) {
                // console.log('ERROR: failed deserialization');
              }
              if (loop) {
                const applier = rangy.createClassApplier(
                  highlighterval.className || 'no-title'
                );
                applier.toggleSelection();
                rangy.getSelection().removeAllRanges();
              }
            } else if (rangy.canDeserializeRange(highlighterval.coords)) {
              rangy.deserializeRange(highlighterval.coords);
              const applier = rangy.createClassApplier(
                highlighterval.className || 'no-title'
              );
              applier.toggleSelection();
              rangy.getSelection().removeAllRanges();
            } else {
              // console.log("Deserilization not rendered ");
              // console.log(rangy.canDeserializeSelection(highlighterval.coords));
            }
          }
        });
        this.setRmvLoader(false);
      }
    } catch (ex) {
      // console.log(ex);
      setTimeout(() => {
        this.failedDeserilization(serializeRangeAr);
      }, 1000);
      this.setRmvLoader(false);
    }
  }
  // failedDeserilization
  failedDeserilization(serializeRangeAr) {
    try {
      if (serializeRangeAr.length) {
        // deserialize with related serialized coords only
        serializeRangeAr.forEach((highlighterval) => {
          if (highlighterval && Object.keys(highlighterval).length) {
            if (rangy.canDeserializeSelection(highlighterval.coords)) {
              rangy.deserializeSelection(highlighterval.coords, null, window);
              const applier = rangy.createClassApplier(
                highlighterval.className || 'no-title'
              );
              applier.toggleSelection();
              rangy.getSelection().removeAllRanges();
            } else {
              // console.log("Deserilization not rendered ");
              // console.log(rangy.canDeserializeSelection(highlighterval.coords));
            }
          }
        });
      }
    } catch (ex) {
      this.setRmvLoader(false);
    }
  }
  // Loader service
  getRmvLoader() {
    return this.removalTextLoader.asObservable();
  }
  setRmvLoader(flag) {
    this.removalTextLoader.next(flag);
  }
  // Call poling service to check status api
  getPolling() {
    return this.polling.asObservable();
  }
  setPolling(flag) {
    this.polling.next(flag);
  }
  // Single Deserialization
  singleDeserialization(serializeRange) {
    if (rangy.canDeserializeSelection(serializeRange.coords)) {
      const applier = rangy.createClassApplier(
        serializeRange.className || 'no-title'
      );
      rangy.deserializeSelection(serializeRange.coords);
      applier.toggleSelection();
      rangy.getSelection().removeAllRanges();
    } else {
      // console.log(rangy.canDeserializeSelection(serializeRange.coords));
    }
  }
  // Save selection
  saveSelection() {
    const savedSel = rangy.saveSelection();
    return savedSel;
  }
  // Restore selection
  restoreSelection(savedSel) {
    rangy.restoreSelection(savedSel);
  }
  // FirstRange
  getFirstRange() {
    const sel = rangy.getSelection();
    return sel.rangeCount ? sel.getRangeAt(0) : null;
  }
  // Delete Node range
  deleteRange() {
    const range = this.getFirstRange();
    if (range) {
      range.deleteContents();
    }
  }
  // Surround element
  surroundRange() {
    const range = this.getFirstRange();
    if (range) {
      const el = document.createElement('span');
      el.id = 'id1';
      // el.style.backgroundColor = "pink";
      if (range.canSurroundContents(el)) {
        range.surroundContents(el);
      } else {
        alert(
          'Unable to surround range because range partially selects a non-text node. See DOM4 spec for more information.'
        );
      }
    }
  }
}
