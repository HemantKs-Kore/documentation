import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';

@Component({
  selector: 'app-search-interface',
  templateUrl: './search-interface.component.html',
  styleUrls: ['./search-interface.component.scss']
})
export class SearchInterfaceComponent implements OnInit {
  customModalRef:any;
  previewModalRef:any;
  list : any = ['Actions','FAQs','Pages','Structured Data']
  showDescription: boolean = true;
  showImage : boolean = false;
  customizeTemplateObj : customizeTemplate = new customizeTemplate();
  @ViewChild('customModal') customModal: KRModalComponent;
  @ViewChild('previewModal') previewModal: KRModalComponent;
  constructor() { }

  ngOnInit(): void {
    this.customizeTemplateObj.template.type = "list";
    this.customizeTemplateObj.template.searchResultlayout.layout = "titleWithText";
    this.customizeTemplateObj.template.searchResultlayout.clickable = true;
    this.customizeTemplateObj.template.searchResultlayout.behaviour  ="webpage";
  }
  template(type){
    this.customizeTemplateObj.template.type = type;
  }
  resultLayoutChange(layout){
    this.customizeTemplateObj.template.searchResultlayout = new searchResultlayout();
    this.customizeTemplateObj.template.resultMapping = new resultMapping();
    this.customizeTemplateObj.template.searchResultlayout.layout = layout;
    if(layout == 'titleWithHeader'){
      this.showDescription = false;
    }else{
      this.showDescription = true;
    }
    if(layout == 'titleWithHeader' || layout == 'titleWithText'){
      this.showImage = false;
    }else{
      this.showImage = true;
    }
  }
  clickableChange(event){
    if(event){
      this.customizeTemplateObj.template.searchResultlayout.clickable = event.target.checked;
    }
  }
  openCustomModal() {
    this.customModalRef = this.customModal.open();
  }
  closeCustomModal(){
    if (this.customModalRef && this.customModalRef.close){
      this.customModalRef.close();
    }
  }
  openPreviewModal() {
    this.previewModalRef = this.previewModal.open();
  }
  closePreviewModal(){
    if (this.previewModalRef && this.previewModalRef.close){
      this.previewModalRef.close();
    }
  }
  drop(event: CdkDragDrop<string[]>,list) {
    moveItemInArray(list, event.previousIndex, event.currentIndex);
  }
}

class customizeTemplate{ 
    template : template = new template();
}
class template {
  type : string = '';                    // list1  list 2 or card or carousel
  searchResultlayout : searchResultlayout = new searchResultlayout();
  resultMapping :resultMapping = new resultMapping();
  preview : string = '';                 // collapsable / clickable
}
class searchResultlayout{
  layout :string = '';                // title with text / image / Centered Content
    clickable : boolean = true;
    behaviour : string = '';          // 'webpage' or 'postback'
    url : string = '';
}
class resultMapping{
  heading : string = '';
  Description : string = '';
  image : string = '';
}