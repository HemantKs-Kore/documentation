import { Injectable, OnInit, OnDestroy } from '@angular/core';

declare var rangy;

@Injectable({
  providedIn: 'root'
})
export class RangySelectionService implements OnInit, OnDestroy {

  constructor() {
    // console.log(rangy);
    rangy.init();
    rangy.allowSerialization; // allowing serializatoin
    if (rangy.features.implementsControlRange) {
      // console.log("supprts feature rangecontrol",rangy.features);
    }
    var serializerModule = rangy.modules.Serializer;
    if (rangy.supported && serializerModule && serializerModule.supported) {
      // console.log("supprts feature rangecontrol2", serializerModule);
    }
  }
  // Range Selection viewportRectangle
  viewportRectangle() {
    var selection = document.getSelection();
    var range = selection.getRangeAt(0);
    var viewportRectangle = range.getBoundingClientRect();
    return viewportRectangle || null;
  }
  // Range Selection Text
  rangeSelectionText() {
    var text = (rangy.getSelection().trim()).toString();
    text = text.trim();
    return text;
  }
  // Range selection html
  rangeSelectionHtml() {
    return rangy.getSelection().toHtml();
  }
  // Text highlightion
  getTextHighlighter(className) {
    var highlighter = null;
    if (!className) {
      className = ''; //no-highlight
    }
    var classApplierModule = rangy.modules.ClassApplier;
    if (rangy.supported && classApplierModule && classApplierModule.supported) {
      if (className) {
        highlighter = rangy.createHighlighter();
        highlighter.addClassApplier(rangy.createClassApplier(className), {
          ignoreWhiteSpace: true,
          tagNames: ["span"],
          elementTagName: "a",
          elementProperties: {
              href: "#",
              onclick: function() {
                  var highlight = highlighter.getHighlightForElement(this);
                  console.log("Hightlight" + highlight);
                  if (window.confirm("Delete this note (ID " + highlight.id + ")?")) {
                      highlighter.removeHighlights( [highlight] );
                  }
                  return false;
              }
          }

        });
      //   highlighter.addClassApplier(rangy.createClassApplier("highlight", {
      //     ignoreWhiteSpace: true,
      //     tagNames: ["span", "a"]
      // }));

      //   highlighter.addClassApplier(rangy.createClassApplier("note", {
      //     ignoreWhiteSpace: true,
      //     elementTagName: "a",
      //     elementProperties: {
      //         href: "#",
      //         onclick: function() {
      //             var highlight = highlighter.getHighlightForElement(this);
      //             if (window.confirm("Delete this note (ID " + highlight.id + ")?")) {
      //                 highlighter.removeHighlights( [highlight] );
      //             }
      //             return false;
      //         }
      //     }
      // }));

        highlighter.highlightSelection(className);
        rangy.getSelection().removeAllRanges();
      }
    } else {
      console.log("Class applier not supports");
    }
    return highlighter;
  }
  // Remove text highlighter
  removeTextHighlighter(highlighter) {
    if (highlighter && highlighter.highlights) {
      // console.log(highlighter.highlights);
      // if(highlighter.highlights[0] && highlighter.highlights[0].classApplier.className) {
      //   let className = highlighter.highlights[0].classApplier.className;
      //   this.removeClasses('.' + className);
      // }
      highlighter.removeHighlights(highlighter.highlights); // specific highlight
      // highlighter.removeAllHighlights(); // All ranges
      // highlighter.unhighlightSelection();
    } else {
      console.log("No highlighter found");
    }
  }
  // remove classes 
  removeClasses(className) {
    console.log(this)
    let query = document.querySelectorAll(className);
    query.forEach((item, index) => {
      item.remove(className);
    });
  }
  // Seriliation 
  getSerilization() {
    // var getRangeFirst = this.getFirstRange();
    // console.log(getRangeFirst);
    // var coordVal = rangy.serializeSelection(getRangeFirst, true);
    var selObj = rangy.getSelection();
    var coordVal = rangy.serializeSelection(selObj, true);
    return coordVal;
  }
  // Deserilization
  deserialization(serializeRangeAr) {
    try {
      if (serializeRangeAr.length) {
        // filter pageno == currpage(IMP)
        // var filteredRes = serializeRangeAr.filter((val, index) => {
        //     return val.curr_page == '__CURRENT_PAGE';
        // });
        // deserialize with related serialized coords only
        serializeRangeAr.forEach(highlighterval => {
          if (highlighterval && Object.keys(highlighterval).length) {
            if (rangy.canDeserializeSelection(highlighterval.coords)) {
              rangy.deserializeSelection(highlighterval.coords);
              let applier = rangy.createClassApplier(highlighterval.className || 'no-title');
              applier.toggleSelection();
              rangy.getSelection().removeAllRanges();
            } else if(rangy.canDeserializeRange(highlighterval.coords)) {
              rangy.deserializeRange(highlighterval.coords);
              let applier = rangy.createClassApplier(highlighterval.className || 'no-title');
              applier.toggleSelection();
              rangy.getSelection().removeAllRanges();
            } else {
              console.log("Deserilization not rendered ");
              console.log(rangy.canDeserializeSelection(highlighterval.coords));
            }
          }
        });
      }
    } catch(ex) {
      console.log(ex);
    }
  }
  // Single Deserialization
  singleDeserialization(serializeRange) {
    if (rangy.canDeserializeSelection(serializeRange.coords)) {
      var applier = rangy.createClassApplier(serializeRange.className || 'no-title');
      rangy.deserializeSelection(serializeRange.coords);
      applier.toggleSelection();
      rangy.getSelection().removeAllRanges();
    } else {
      console.log(rangy.canDeserializeSelection(serializeRange.coords));
    }
  }
  // Save selection
  saveSelection() {
    var savedSel = rangy.saveSelection();
    return savedSel;
  }
  // Restore selection
  restoreSelection(savedSel) {
    rangy.restoreSelection(savedSel);
  }
  // FirstRange
  getFirstRange() {
    var sel = rangy.getSelection();
    return sel.rangeCount ? sel.getRangeAt(0) : null;
  }
  // Delete Node range
  deleteRange() {
    var range = this.getFirstRange();
    if (range) {
      range.deleteContents();
    }
  }
  // Surround element
  surroundRange() {
    var range = this.getFirstRange();
    if (range) {
        var el = document.createElement("span");
        el.id = "id1";
        // el.style.backgroundColor = "pink";
        if (range.canSurroundContents(el)) {
            range.surroundContents(el);
        } else {
            alert("Unable to surround range because range partially selects a non-text node. See DOM4 spec for more information.");
        }
    }
}
  // Insert Node/Element
  // insertNodeAtRange() {
  //   var range = this.getFirstRange();
  //   if (range) {
  //     var el = document.createElement("img");
  //     el.src = "/analytics/assets/images/closeCross.png";
  //     el.className = "text-close-icon";
  //     // el.style.backgroundColor = "lightblue";
  //     // el.style.color = "red";
  //     // el.style.fontWeight = "bold";
  //     // el.appendChild(document.createTextNode("**INSERTED NODE**"));
  //     range.insertNode(el);
  //     rangy.getSelection().setSingleRange(range);
  //   }
  // }
    // test
  // hight light text
  // highlighter;
  // createHighlighter() {
  //   this.highlighter = rangy.createHighlighter();

  //   this.highlighter.addClassApplier(rangy.createClassApplier("highlight", {
  //       ignoreWhiteSpace: true,
  //       tagNames: ["span", "a"]
  //   }));
  //   this.highlighter.highlightSelection("highlight");
  //   // return this.highlighter;
  // }
  // // remove selection hightlights 
  // unhighlightSelection(highlighter) {
  //   this.highlighter.unhighlightSelection();
  // }
  ngOnInit() {

  }
  ngOnDestroy() {

  }
}
