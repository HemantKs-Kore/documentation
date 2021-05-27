import { Component, OnInit, OnChanges, ViewEncapsulation, ViewChild, HostListener, Inject } from '@angular/core';
import { PdfViewerComponent, PDFProgressData } from 'ng2-pdf-viewer';
import * as $ from 'jquery';
import SimpleBar from 'simplebar/dist/simplebar-core.esm';
import { Platform } from '@angular/cdk/platform';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServiceInvokerService } from '../../../../services/service-invoker.service';
import { RangySelectionService } from '../../services/rangy-selection.service';

import { UserGuideComponent } from '../user-guide/user-guide.component';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { NotificationService } from '../../../../services/notification.service';
import { WorkflowService } from '../../../../services/workflow.service';
import { SummaryModalComponent } from '../summary-modal/summary-modal.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';


@Component({
  selector: 'kr-pdf-annotation',
  templateUrl: './pdf-annotation.component.html',
  styleUrls: ['./pdf-annotation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PdfAnnotationComponent implements OnInit, OnChanges {
  @ViewChild(PdfViewerComponent)
  private pdfComponent: PdfViewerComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;
  options = {
    autoHide: true,
    scrollbarMinSize: 100,
    classNames: {
      content: 'simplebar-content',
      scrollContent: 'simplebar-scroll-content',
      scrollbar: 'simplebar-scrollbar',
      track: 'simplebar-track'
    },
    direction: 'rtl'
  };
  pdfConfig = {
    rotate: 0,
    zoom: 1.03,
    renderTextMode: 2,
    currentPage: 1,
    totalPages: 0,
    renderText: true,
    originalSize: false,
    autoResize: true,
    showAll: false,
    fitToPage: false,
    pdfUrl: ""
  };
  loaderFlag: boolean = false;
  public hostRectangle: SelectionRectangle | null;
  public overRectange: SelectionRectangle | null;
  private selectedText: string;
  pdfForm: FormGroup;
  rangyHightlights: any = null;
  rangySerialization: Object = null;
  rangySaveSelection: Object = null;
  pdfPayload = {
    "pdfsize": [
    ],
    "parentCanvas": {
      "width": 0,
      "height": 0
    },
    "title": [],
    "header": [],
    "footer": [],
    "ignoreText": [],
    "title_pageno": [],
    "header_pageno": [],
    "footer_pageno": [],
    "ignoreTextPageno": [],
    "ignorePages": [],
    "serialization": [],
    "streamId": null,
    "pdfUrl": ""
  };
  extractionLoader: boolean = false;
  streamId: string = null;
  pdfSize: string = "0 KB";
  fileId: string = null;
  fileName: string = null;
  togglePage: boolean = false;
  removeAnnotationFlag: boolean = false;
  saveSelection: any;
  restoreSelection: any;
  removalText: string = "";
  overStateEvent: any = null;
  removeClassName: string = '';
  pdfProgressPerc: number = 0;
  form: FormGroup;
  private themeWrapper = document.querySelector('body');
  removeProgressBar: boolean = false;
  selectedApp: any= {};
  searchIndexId: string = "";

  constructor(private _formBuilder: FormBuilder,
    public workflowService: WorkflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private rangeService: RangySelectionService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PdfAnnotationComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public platform: Platform
  ) {
    this.createForm();
    this.initPdfViewer();
  }

  ngOnInit() {
    // this.userGuide();
    this.getSavedAnnotatedDataForStream();
    this.formUpdatation();
    this.createThemeForm();
    this.applyTheme(this.form.value); // Make sure apply default colors
    const simpleBar = new SimpleBar(document.getElementById('simpleBar'));
    simpleBar.getScrollElement().addEventListener('scroll', this.onScrollEvent);
  }
  ngAfterViewInit() {
    console.log(this.pdfComponent);
  }
  ngOnChanges() {

  }
  ngOnDestroy() {
    window.removeEventListener('mouseup', this.textLayerMouseup, false);
    window.removeEventListener('mouseover', this.onMouse, false);
    window.removeEventListener('scroll', this.onScrollEvent, true);
    this.pdfComponent.clear();
  }
  closeModal() {
    this.dialogRef.close();
  }
  // Init data for pdf-viwer
  initPdfViewer() {
    this.selectedApp = this.workflowService.selectedApp();
    this.searchIndexId = this.selectedApp.searchIndexes[0]._id;
    this.pdfPayload.streamId = this.selectedApp._id;
    this.streamId = this.selectedApp._id;
    if(this.dialogData && this.dialogData.type && this.dialogData.type === 'reannotate' && this.dialogData.source) {
      this.reAnnotateDocument(this.dialogData.source);
    } else {
      if (this.dialogData.pdfResponse) {
        this.fileId = this.dialogData.pdfResponse.fileId;
        this.fileName = this.dialogData.pdfResponse.sourceTitle;
      }
      this.getAttachmentFile(this.fileId);
    }

  }
  // User Guilde - How to annotate
  userGuide() {
    setTimeout(() => {
      let payload = {
        header: "How to Annotate",
        body: {},
        footer: "Learn more",
        backToSource: false
      };
      const dialogRef = this.dialog.open(UserGuideComponent, {
        data: { pdfResponse: payload },
        panelClass: 'kr-create-app-panel',
        disableClose: true,
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(res => {
        console.log(payload);
        if(payload && payload.backToSource) {
          this.closeModal();          
        }
      });
    }, 1000);
  }

  confirmText() {
    let getRmvTxt = getAllElements(this.overStateEvent, this.removeClassName, this.pdfPayload);
    if ((getRmvTxt === this.removalText) && this.cancelData(this.removalText)) {
      removeTextClass(this.removeClassName, this.overStateEvent); // remove sibling classes
      this.cancelData(this.removalText); // Pass text to delete from original Payload
      this.removeProgressBar = true;
      $('.pdf-viewer').css('width', $('.pdf-viewer').width() + 1);
      this.pdfComponent.updateSize();
      this.pdfConfig.zoom = this.pdfConfig.zoom;
      setTimeout(() => {
        this.removeProgressBar = false;
      }, 150);
    } else {
      this.removeConfirmDialog();
    }

    this.removalText = "";
    this.removeAnnotationFlag = false;
    this.overRectange = null;
    this.overStateEvent = null;
    this.removeClassName = '';
  }
  cancelText() {
    this.removalText = "";
    this.overRectange = null;
    this.removeAnnotationFlag = false;
    this.overStateEvent = null;
    this.removeClassName = '';
  }
  // OnHover of highlighted text
  @HostListener('mouseover', ['$event']) onMouse($event) {
    if (this.hostRectangle) {
      return false;
    }
    $event.preventDefault();
    $event.stopPropagation();
    $(".remove-indicator").show();
    if ($event.target.className === ClassTypes.heading) { // Heading
      this.removeAnnotationFlag = false;
      let boundry = $event.target.getBoundingClientRect();
      this.overRectange = { left: boundry.left, top: boundry.top, width: boundry.width, height: boundry.height };
      this.removalText = getAllElements($event.target, ClassTypes.heading, this.pdfPayload); // Sum prev, current & next string
      this.overStateEvent = $event.target;
      this.removeClassName = $event.target.className;
    } else if ($event.target.className === ClassTypes.header) { // Header
      this.removeAnnotationFlag = false;
      let boundry = $event.target.getBoundingClientRect();
      this.overRectange = { left: boundry.left, top: boundry.top, width: boundry.width, height: boundry.height };
      this.removalText = getAllElements($event.target, ClassTypes.header, this.pdfPayload); // Sum prev, current & next string
      this.overStateEvent = $event.target;
      this.removeClassName = $event.target.className;
    } else if ($event.target.className === ClassTypes.exclude) { // Ignore text
      this.removeAnnotationFlag = false;
      let boundry = $event.target.getBoundingClientRect();
      this.overRectange = { left: boundry.left, top: boundry.top, width: boundry.width, height: boundry.height };
      this.removalText = getAllElements($event.target, ClassTypes.exclude, this.pdfPayload); // Sum prev, current & next string
      this.overStateEvent = $event.target;
      this.removeClassName = $event.target.className;
    } else if ($event.target.className === ClassTypes.footer) { // Footer
      this.removeAnnotationFlag = false;
      let boundry = $event.target.getBoundingClientRect();
      this.overRectange = { left: boundry.left, top: boundry.top, width: boundry.width, height: boundry.height };
      this.removalText = getAllElements($event.target, ClassTypes.footer, this.pdfPayload); // Sum prev, current & next string
      this.overStateEvent = $event.target;
      this.removeClassName = $event.target.className;
    }
  }
  // On scroll evnt
  onScrollEvent($event) {
    $(".remove-indicator").hide();
    this.overRectange = null;
    this.removeAnnotationFlag = false;
  }
  scrollHandler(event) {
    let x: any = this.perfectScroll.directiveRef.position(true).x || 0;
    let y: any = this.perfectScroll.directiveRef.position(true).y || 0;
    this.perfectScroll.directiveRef.update(); //for update scroll
    this.perfectScroll.directiveRef.scrollTo(0, 0, 100);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.overRectange = null;
    this.removeAnnotationFlag = false;
    document.getSelection().removeAllRanges(); // Clear selection range
    this.hostRectangle = null;
  }

  // Create form
  createForm() {
    this.pdfForm = this._formBuilder.group({
      inputValue: [null, [Validators.required]],
      className: [null],
      currentPage: [1],
      totalPages: [null],
      ignorePages: [null],
      pdfSize: [null],
      pdfHeight: [null],
      pdfWidth: [null],
      titleObj: this._formBuilder.array([]),
      subTitleObj: this._formBuilder.array([]),
      headerObj: this._formBuilder.array([])
    });
  }
  // Form reset 
  formReset() {
    this.pdfForm.reset();
    this.pdfPayload = {
      "pdfsize": [
      ],
      "parentCanvas": {
        "width": 0,
        "height": 0
      },
      "title": [
      ],
      "header": [],
      "footer": [],
      "ignoreText": [],
      "title_pageno": [],
      "header_pageno": [],
      "footer_pageno": [],
      "ignoreTextPageno": [],
      "ignorePages": [],
      "serialization": [],
      "streamId": this.streamId,
      "pdfUrl": this.pdfConfig.pdfUrl
    };
  }
  // FormUpdatation
  formUpdatation() {
    this.pdfForm.get("inputValue").valueChanges.subscribe(res => {
      if (res) {
        switch (res) {
          case "1":
            this.pdfForm.get("className").setValue(ClassTypes.heading);
            break;
          case "2":
            this.pdfForm.get("className").setValue(ClassTypes.header);
            break;
          case "3":
            this.pdfForm.get("className").setValue(ClassTypes.exclude);
            break;
          case "4":
            this.pdfForm.get("className").setValue(ClassTypes.footer);
            break;
          default:
            this.pdfForm.get("className").setValue("no-found");
            break;
        }
        // setTimeout(() => {
        // this.rangyHightlights = this.rangeService.getTextHighlighter(this.pdfForm.get("className").value);
        // }, 500);
        // console.log(this.rangyHightlights);
      }
    });
  }

  pageRendered(event: any) {
    console.log(event);
    this.pdfForm.get("pdfHeight").setValue(event.source.viewport.height || 0);
    this.pdfForm.get("pdfWidth").setValue(event.source.viewport.width || 0);
    // this.pdfConfig.currentPage = event.pageNumber;
    this.updateIgnorePages();
    // setTimeout(() => {
    this.deserializeObj(); // reform highlighted text      
    // }, 1000);
  }

  // Page changing
  pagechanging(e: any) {
    this.pdfConfig.currentPage = e.pageNumber; // the page variable
  }
  // PDF error handling
  onError(error: any) {
    console.log(error);
    this.notificationService.notify("Something went wrong with pdf", "error");
  }
  // Onprogress pdf percentage
  onProgress(progressData: PDFProgressData) {
    this.pdfProgressPerc = ((progressData.loaded / progressData.total) * 100) || 0;
  }
  // Get file from server
  getAttachmentFile(fileId) {
    this.formReset();
    this.loaderFlag = true;
    this.service.invoke(
      'attachment.file',
      { fileId: fileId },
      {}
    ).subscribe((res: any) => {
      this.pdfConfig.pdfUrl = res.fileUrl;
    }, (error: any) => {
      this.loaderFlag = false;
      this.notificationService.notify(error.error.errors[0].msg, "error");
    });
  }
  // text layer render - rewriting span's with div elements
  textLayerRendered(e: CustomEvent) {
    // console.log(e);
    var divs = document.querySelectorAll(".textLayer > span"); 
    for (var i = 0; i < divs.length; i++) { 
      var s: any = document.createElement("div");
      s.style = divs[i].getAttribute("style"); 
      s.innerHTML = divs[i].innerHTML;
       divs[i].outerHTML = s.outerHTML; 
      }
  }
  // After PDF load completes
  afterLoadComplete(pdfData: any) {
    console.log(pdfData);
    if (pdfData && pdfData.loadingTask && pdfData.loadingTask._transport && pdfData.loadingTask._transport._lastProgress) {
      let _size = pdfData.loadingTask._transport._lastProgress.total;
      let fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),
        i = 0; while (_size > 900) { _size /= 1024; i++; };
      let exactSize: string = (Math.round(_size * 100) / 100).toFixed() + '' + fSExt[i];
      this.pdfSize = exactSize;
    }
    this.pdfForm.get('totalPages').setValue(pdfData.numPages);
    this.pdfConfig.totalPages = pdfData.numPages;
    setTimeout(() => {
      this.loaderFlag = false;
      this.deserializeObj();
    }, 200);
  }

  nextPage() {
    this.pdfConfig.currentPage++;
    this.pdfForm.get('currentPage').setValue(this.pdfConfig.currentPage);
    this.updateIgnorePages();
    this.deserializeObj();
  }
  prevPage() {
    this.pdfConfig.currentPage--;
    this.pdfForm.get('currentPage').setValue(this.pdfConfig.currentPage);
    this.updateIgnorePages();
    this.deserializeObj();
  }
  zoom() {
    this.pdfConfig.zoom += 0.1;
  }
  zoomOut() {
    this.pdfConfig.zoom -= 0.1;
  }
  rotateClock() {
    this.pdfConfig.rotate += 90;
  }
  rotateAntiClock() {
    this.pdfConfig.rotate -= 90;
  }
  // test hightlight text
  optionSelection(classTypes, value, $event) {
    // $event.stopPropagation();
    this.pdfForm.get("inputValue").setValue(value);
    this.pdfForm.get("className").setValue(classTypes);
    this.rangyHightlights = this.rangeService.getTextHighlighter(classTypes);
    // if(this.rangySerialization) {
    //   console.log(this.rangyHightlights, this.rangySerialization);
    //   this.rangeService.singleDeserialization({ coords: this.rangySerialization, className: this.pdfForm.get("className").value, currentPage: this.pdfConfig.currentPage }) // DOM selection removed, then do deserilization
    // }
    if (this.selectedText) {
      this.updatePayload(); // payload construction
      this.hostRectangle = null;
      this.selectedText = "";
    }
    document.getSelection().removeAllRanges(); // Clear selection range
    this.pdfForm.get('inputValue').reset();
    this.pdfForm.get("className").reset();
  }
  // Cancel Data / Delete data from highlighted text 
  cancelData(selectedText) {
    if (selectedText) {
      if (this.pdfPayload.title.includes(selectedText)) {
        let index = this.pdfPayload.title.indexOf(selectedText);
        this.pdfPayload.title.splice(index, 1);
        this.pdfPayload.title_pageno.splice(index, 1);
        this.cancelSerializationData(selectedText);
      } else if (this.pdfPayload.header.includes(selectedText)) {
        let index = this.pdfPayload.header.indexOf(selectedText);
        this.pdfPayload.header.splice(index, 1);
        this.pdfPayload.header_pageno.splice(index, 1);
        this.cancelSerializationData(selectedText);
      } else if (this.pdfPayload.footer.includes(selectedText)) {
        let index = this.pdfPayload.footer.indexOf(selectedText);
        this.pdfPayload.footer.splice(index, 1);
        this.pdfPayload.footer_pageno.splice(index, 1);
        this.cancelSerializationData(selectedText);
      } else if (this.pdfPayload.ignoreText.includes(selectedText)) {
        let index = this.pdfPayload.ignoreText.indexOf(selectedText);
        this.pdfPayload.ignoreText.splice(index, 1);
        this.pdfPayload.ignoreTextPageno.splice(index, 1);
        this.cancelSerializationData(selectedText);
      } else {
        console.log("No selected text found with Orginal data");
        return false;
      }
      this.autoSaveAnno(); // Autosave annotation
      return true;
    }
  }
  // Update Payload 
  updatePayload() {
    if (this.selectedText && this.pdfForm.get("inputValue").value) {
      this.pdfPayload["parentCanvas"].height = this.pdfForm.get("pdfHeight").value;
      this.pdfPayload["parentCanvas"].width = this.pdfForm.get("pdfWidth").value;
      if (this.pdfForm.get("inputValue").value === "1") {
        this.pdfPayload.title.push(this.selectedText);
        this.pdfPayload.title_pageno.push(this.pdfConfig.currentPage);
      } else if (this.pdfForm.get("inputValue").value === "2") {
        this.pdfPayload.header.push(this.selectedText);
        this.pdfPayload.header_pageno.push(this.pdfConfig.currentPage);
      } else if (this.pdfForm.get("inputValue").value === "3") {
        this.pdfPayload.footer.push(this.selectedText);
        this.pdfPayload.footer_pageno.push(this.pdfConfig.currentPage);
      } else if (this.pdfForm.get("inputValue").value === "4") {
        this.pdfPayload.ignoreText.push(this.selectedText);
        this.pdfPayload.ignoreTextPageno.push(this.pdfConfig.currentPage);
      }
      // Update serilization coords
      if (this.rangySerialization) {
        this.pdfPayload.serialization.push({ coords: this.rangySerialization, className: this.pdfForm.get("className").value, currentPage: this.pdfConfig.currentPage, selectedText: this.selectedText });
      }
      this.autoSaveAnno(); // Autosave annotation
    }
  }
  // canel serilization data
  cancelSerializationData(text: string) {
    if (text && this.pdfPayload.serialization && this.pdfPayload.serialization.length) {
      let index = this.pdfPayload.serialization.findIndex(res => res.selectedText === text);
      this.pdfPayload.serialization.splice(index, 1);
    }
  }

  // Re-Annotate document on-demand
  reAnnotateDocument(listData) {
    this.formReset();
    this.loaderFlag = true;
    this.service.invoke(
      'attachment.file',
      { fileId: listData.fileId },
      {}
    ).subscribe((res: any) => {
      this.pdfConfig.pdfUrl = res.fileUrl;
      this.service.invoke(
        'PdfAnno.get.reAnnotateData',
        { searchIndexId: this.searchIndexId, fileId: listData.fileId }
      ).subscribe((res: any) => {
        if (res && res.Response) {
          this.notificationService.notify(res.Response, "success");
        } else if (res.serialization) {
          let sPayload = {
            "title": res.title,
            "header": res.header,
            "footer": res.footer,
            "ignoreText": res.ignoreText,
            "title_pageno": res.titlePageno,
            "header_pageno": res.headerPageno,
            "footer_pageno": res.footerPageno,
            "ignoreTextPageno": res.ignoreTextPageno,
            "ignorePages": res.ignorePages,
            "serialization": res.serialization,
            "streamId": res.streamId,
            "fileId": res.fileId,
            "pdfUrl": this.pdfConfig.pdfUrl,
            "pdfsize": [this.pdfSize],
            "parentCanvas": {
              "width": this.pdfForm.get("pdfWidth").value,
              "height": this.pdfForm.get("pdfHeight").value
            },
          };
          this.pdfPayload = sPayload;
        }
      }, (error: any) => {
        if (error && error.data && error.data.errors && error.data.errors[0] && error.data.errors[0].msg) {
          this.notificationService.notify(error.error.errors[0].msg, "error");
        }
      });
    }, (error: any) => {
      this.loaderFlag = false;
      this.notificationService.notify(error.error.errors[0].msg, "error");
    });
    console.log(listData);
  }
  // Check user guide info from api
  getSavedAnnotatedDataForStream() {
    this.service.invoke(
      'PdfAnno.get.userguide',
      { streamId: this.pdfPayload.streamId }
    ).subscribe((res: any) => {
      if (res && !res.userHasAnnotated) {
        this.userGuide();
      }
    }, (error: any) => {
      if (error && error.data && error.data.errors && error.data.errors[0] && error.data.errors[0].msg) {
        this.notificationService.notify(error.error.errors[0].msg, "error");
      }
    });
  }
  // extract pdf
  extractPDF() {
    let payloadResponse = {
      "streamId": this.pdfPayload.streamId,
      "fileId": this.fileId,
      "title": this.pdfPayload.title,
      "header": this.pdfPayload.header,
      "footer": this.pdfPayload.footer,
      "ignoreText": this.pdfPayload.ignoreText,
      "titlePageno": this.pdfPayload.title_pageno,
      "headerPageno": this.pdfPayload.header_pageno,
      "footerPageno": this.pdfPayload.footer_pageno,
      "ignoreTextPageno": this.pdfPayload.ignoreTextPageno,
      "ignorePages": this.pdfPayload.ignorePages,
      'name': this.fileName,
      'extractionType': 'annotation'
    };
    this.extractionLoader = true;
    this.service.invoke(
      'PdfAnno.faq.annotate',
      { searchIndexId: this.searchIndexId, sourceType: "file" },
      payloadResponse
    ).subscribe((res: any) => {
      this.extractionLoader = false;
      this.dialogData.annotation.resourceId = res.resourceId;
      this.dialogData.annotation._id = res._id;
      this.dialogData.annotation.status = "Inprogress";
      this.dialogData.annotation.annotationType = true;
      this.closeModal();
      this.rangeService.setPolling(true); // status progress
    }, (error: any) => {
      this.extractionLoader = false;
      if (error && error.error && error.error.errors && error.error.errors[0] && error.error.errors[0].msg) {
        this.notificationService.notify(error.error.errors[0].msg, "error");
      }
    });
  }
  // check form is valid/In valid
  get isFormValid() {
    if (Object.keys(this.pdfPayload).length) {
      if (this.pdfPayload.title.length || this.pdfPayload.header.length || this.pdfPayload.footer.length || this.pdfPayload.ignoreText.length || this.pdfPayload.ignorePages.length) {
        return true;
      }
    } else {
      // NotificationService.notify("You can only review the questions once you have annotated and extracted", 'error');
      return false;
    }
  }
  // Auto Save Anntation
  autoSaveAnno() {
    if (!this.fileName) {
      console.log(this.fileName, 'File name not found');
    }
    let payloadResponse = {
      "streamId": this.pdfPayload.streamId,
      "fileId": this.fileId,
      "title": this.pdfPayload.title,
      "header": this.pdfPayload.header,
      "footer": this.pdfPayload.footer,
      "ignoreText": this.pdfPayload.ignoreText,
      "titlePageno": this.pdfPayload.title_pageno,
      "headerPageno": this.pdfPayload.header_pageno,
      "footerPageno": this.pdfPayload.footer_pageno,
      "ignoreTextPageno": this.pdfPayload.ignoreTextPageno,
      "ignorePages": this.pdfPayload.ignorePages,
      'name': this.fileName,
      'extractionType': 'annotation',
      "serialization": this.pdfPayload.serialization,
      "autoSave": true
    };
    this.service.invoke(
      'PdfAnno.faq.annotate',
      { searchIndexId: this.searchIndexId, sourceType: "file" },
      payloadResponse
    ).subscribe((res: any) => {
      // console.log(res);
    }, (error: any) => {
      if (error && error.error && error.error.errors && error.error.errors[0] && error.error.errors[0].msg) {
        this.notificationService.notify(error.error.errors[0].msg, "error");
      }
    });
  }
  // Confirmation dialog 
  removeConfirmDialog() {
    if (this.pdfPayload.title.length ||
      this.pdfPayload.header.length ||
      this.pdfPayload.footer.length ||
      this.pdfPayload.ignoreText.length
    ) {
      let obj = {
        title: "Confirmation",
        confirmationMsg: "Data miss matching with orginal data, please click try again to delete manually.",
        yes: "Try Again",
        no: "Close",
        type: "removeAnnotation"
      };
      const dialogRef = this.dialog.open(ConfirmationComponent, {
        data: { info: obj },
        panelClass: 'kr-confirmation-panel',
        disableClose: true,
        autoFocus: true
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.summaryDialog();
        }
      });
    } else {
      this.notificationService.notify("Please select an option", "error");
    }
  }
  // Save pdf info 
  summaryDialog() {
    if (this.pdfPayload.title.length ||
      this.pdfPayload.header.length ||
      this.pdfPayload.footer.length ||
      this.pdfPayload.ignoreText.length
    ) {
      const dialogRef = this.dialog.open(SummaryModalComponent, {
        data: { pdfResponse: this.pdfPayload },
        panelClass: 'kr-create-app-panel',
        disableClose: true,
        autoFocus: true
      });
      dialogRef.afterClosed().subscribe(res => {
        setTimeout(() => {
          $('.pdf-viewer').css('width', $('.pdf-viewer').width() + 1);
          this.pdfComponent.updateSize();
          this.pdfConfig.zoom = this.pdfConfig.zoom;
        }, 200);
      });
    } else {
      this.notificationService.notify("Please select an option", "error");
    }
  }
  // Ignoraged pages 
  ignorePages(event) {
    if (this.pdfForm.get("ignorePages").value) {
      this.pdfPayload.ignorePages.push(this.pdfConfig.currentPage);
      this.pdfConfig.renderTextMode = 0;
      this.ignorePageAnnotation();
    } else {
      let index = this.pdfPayload.ignorePages.indexOf(this.pdfConfig.currentPage);
      this.pdfPayload.ignorePages.splice(index, 1);
      this.pdfConfig.renderTextMode = 2;
    }
    this.autoSaveAnno(); // Autosave annotation
  }
  // update ignore pages
  updateIgnorePages() {
    let index = this.pdfPayload.ignorePages.indexOf(this.pdfConfig.currentPage);
    if (this.pdfPayload.ignorePages[index]) {
      this.pdfForm.get("ignorePages").setValue(true);
    } else {
      this.pdfForm.get("ignorePages").setValue(false);
    }
  }
  // Ignore pages need to remove annotation
  ignorePageAnnotation() {
    if (this.pdfPayload.serialization.length && this.pdfPayload.ignorePages.length) {
      let findPageNumber = this.pdfPayload.ignorePages.indexOf(this.pdfConfig.currentPage);
      if (findPageNumber !== -1) {
        let findObj = this.pdfPayload.serialization.filter((obj) => {
          return obj.currentPage === this.pdfConfig.currentPage;
        });
        if (findObj && findObj.length) {
          findObj.forEach((ser) => {
            this.cancelData(ser.selectedText);
          });
        }
        $('.pdf-viewer').css('width', $('.pdf-viewer').width() + 1);
        this.pdfComponent.updateSize();
        this.pdfConfig.zoom = this.pdfConfig.zoom;
      }
    }

  }
  // focusInput 
  focusInput() {
    this.togglePage = true;
    setTimeout(() => {
      $('#pageInput').focus();
    }, 50);
  }
  // Search page number
  searchPage(event) {
    this.togglePage = false;
    let number = Number(event.target.value) || this.pdfConfig.currentPage || 1;
      if (number <= this.pdfConfig.totalPages) {
        this.pdfConfig.currentPage = number;
        this.pdfConfig.totalPages = this.pdfConfig.totalPages;
        this.pdfComponent.page = number;
      } else {
        this.notificationService.notify("Please enter a valid page number", "error");
      }
  }
  // Search text in PDF component
  searchText(text) {
    this.pdfComponent.pdfFindController.executeCommand('find', {
      caseSensitive: false, findPrevious: undefined, highlightAll: true, phraseSearch: true, query: text
    });
  }
  // Mouse leave to remove range, popovers 
  mouseLeavePDF($event) {
    setTimeout(() => {
      this.hostRectangle = null;
      this.overRectange = null;
      this.removeAnnotationFlag = false;
      document.getSelection().removeAllRanges(); // Clear selection range
    }, 2500);
  }
  // text layer mouseup
  textLayerMouseup($event) {
    setTimeout(() => {
      this.selectedText = getSelectionText();
      if (this.platform.FIREFOX) { // Firfox special chars
        this.selectedText = this.selectedText.replace(/(\r\n|\n|\r)/gm, "");
      }
      let contentHtml = this.rangeService.rangeSelectionHtml();
      if (contentHtml && checkDuplicateClasses(contentHtml)) { // check duplicate selection
        console.log("It's already annotated!");
        this.hostRectangle = null;
        return false;
      } else if (!this.selectedText) {
        this.hostRectangle = null;
      } else {
        if (this.selectedText) {
          this.overRectange = null;
          this.hostRectangle = null;
          this.hostRectangle = this.rangeService.viewportRectangle();
          if (this.hostRectangle && Math.sign(this.hostRectangle.top) === -1) {
            let rectange: any = {};
            rectange.top = 100;
            rectange.left = this.hostRectangle.left;
            this.hostRectangle = null;
            this.hostRectangle = rectange;
          }
          this.updatePayload();
          this.rangySerialization = this.rangeService.getSerilization();
        } else {
        }
      }
    }, 50);
  }

  // Deserialize modal to rehightlight text after delay
  deserializeObj() {
    if (this.pdfPayload.serialization) {
      this.removeProgressBar = false;
      setTimeout(() => {
        var filteredRes = this.pdfPayload.serialization.filter((val, index) => {
          return val.currentPage == this.pdfConfig.currentPage;
        });
        if (filteredRes && filteredRes.length) {
          this.rangeService.deserialization(filteredRes);
        } else {
          // console.log("Nothing to deserilize:" + filteredRes);
        }
      }, 200);
    } else {
      // this.notificationService.notify("Nothing to deserilize", "warning");
    }
  }
  // Unique values filtering from array
  uniqueListFromArray(arr) {
    if (arr.length) {
      let finalArr: any[] = arr.filter((item, i, ar) => ar.indexOf(item) === i);
      if (this.pdfPayload.ignorePages.length) {
        this.pdfPayload.ignorePages.forEach((item) => {
          let index = finalArr.indexOf(item);
          if (index !== -1)
            finalArr.splice(index, 1);
        });
        if (Array.isArray(finalArr)) {
          finalArr.sort(function (a, b) {
            return a - b;
          });
        }
        return finalArr.toString();
      }
      if (finalArr.length > 20) {
        if (Array.isArray(finalArr)) {
          finalArr.sort(function (a, b) {
            return a - b;
          });
        }
        let firstArr = finalArr.slice(0, 20);
        let moreTxt = '...';
        let result = firstArr.concat(moreTxt);
        return join(result);
      }
      else {
        if (Array.isArray(finalArr)) {
          finalArr.sort(function (a, b) {
            return a - b;
          });
        }
        return finalArr.toString();
      }
    }
    return 0;
  }
  tooltipText(arr) {
    if (arr) {
      let finalArr: any[] = arr.filter((item, i, ar) => ar.indexOf(item) === i);
      if (this.pdfPayload.ignorePages.length) {
        this.pdfPayload.ignorePages.forEach((item) => {
          let index = finalArr.indexOf(item);
          if (index !== -1)
            finalArr.splice(index, 1);
        });
        if (Array.isArray(finalArr)) {
          finalArr.sort(function (a, b) {
            return a - b;
          });
        }
        return finalArr.toString();
      } else {
        if (Array.isArray(finalArr)) {
          finalArr.sort(function (a, b) {
            return a - b;
          });
        }
        return finalArr.toString();
      }
    } else {
      return 0;
    }
  }
  ignoredPages(arr) {
    arr.sort(function (a, b) {
      return a - b;
    });
    return arr || [];
  }
  // Color picker theme
  createThemeForm() {
    this.form = this._formBuilder.group({
      heading: ['#1372ff'],
      header: ['#f5a623'],
      footer: ['#09a624'],
      exclude: ['#ff5d5d']
    });
  }
  applyTheme(stylesheet) {
    // Option Styles
    if (stylesheet.heading) {
      this.themeWrapper.style.setProperty('--headingColor', stylesheet.heading);
    }
    if (stylesheet.header) {
      this.themeWrapper.style.setProperty('--headerColor', stylesheet.header);
    }
    if (stylesheet.footer) {
      this.themeWrapper.style.setProperty('--footerColor', stylesheet.footer);
    }
    if (stylesheet.exclude) {
      this.themeWrapper.style.setProperty('--excludeColor', stylesheet.exclude);
    }
  }

}

interface SelectionRectangle {
  left: number;
  top: number;
  width: number;
  height: number;
}
// ENUMS
enum ClassTypes {
  heading = "heading-highlight",
  header = "header-highlight",
  footer = "footer-highlight",
  exclude = "exclude-highlight"
}
function getSelectionText() {
  var document: any = window.document;
  if (window.getSelection) {
    try {
      var activeElement = document.activeElement;
      if (activeElement && activeElement.value) {
        return activeElement.value.substring(activeElement.selectionStart, activeElement.selectionEnd);
      } else {
        return window.getSelection().toString();
      }
    } catch (e) {
    }
  } else if (document.selection && document.selection.type != "Control") {
    return document.selection.createRange().text; // For IE
  }
}


// Get next, prev & curr Siblings text from current element
function getAllElements(element, className, payload) {
  // Current
  let resultText: string = element.textContent;
  if (findMatchedData(payload, '', resultText, '', className).isMatched) {
    let findMatchedObj: IFindMatched = findMatchedData(payload, '', resultText, '', className);
    if (findMatchedObj.isMatched && findMatchedObj.findText && findMatchedObj.option) {
      return findMatchedObj.findText || '';
    }
    return resultText;
  }
  // PREV
  let prevResultText = [];
  var lp = $("." + className).length;
  let prevEle = $(element).parent().prev().children();
  if ($(prevEle).hasClass(className)) {
    for (let i = 0; i < lp; i++) {
      for (let j = prevEle.length; j > 0; j--) {
        if (prevEle.length && $(prevEle).hasClass(className)) {
          let text = $(prevEle).text();
          prevResultText.push(text);
          if (findMatchedData(payload, prevResultText, resultText, nextResultText, className).isMatched) {
            prevEle = {};
            let findMatchedObj: IFindMatched = findMatchedData(payload, prevResultText, resultText, nextResultText, className);
            if (findMatchedObj.isMatched && findMatchedObj.findText && findMatchedObj.option) {
              return findMatchedObj.findText || '';
            }
          } else {
            prevEle = $(prevEle).parent().prev().children(); // set every div this ele
          }
        }
      }
    }
  }
  // NEXT
  var nextResultText = [];
  let nextEle = $(element).parent().next().children();
  if ($(nextEle).hasClass(className)) {
    for (let i = 0; i < lp; i++) {
      for (let j = 0; j < nextEle.length; j++) {
        if (nextEle.length && $(nextEle).hasClass(className)) {
          let text = $(nextEle).text();
          nextResultText.push(text);
          if (findMatchedData(payload, prevResultText, resultText, nextResultText, className).isMatched) {
            nextEle = {};
            let findMatchedObj: IFindMatched = findMatchedData(payload, prevResultText, resultText, nextResultText, className);
            if (findMatchedObj.isMatched && findMatchedObj.findText && findMatchedObj.option) {
              return findMatchedObj.findText || '';
            }
          } else {
            nextEle = $(nextEle).parent().next().children(); // set every div this element
          }
        }
      }
    }
  }

  let prvTxt = prevResultText.reverse().join('') || '';
  let nxtText = nextResultText.join('') || '';
  let finalText = prvTxt + resultText + nxtText;
  return finalText || '';
}
// Remove/Detach classes for Prev+ current + next elements span's
function removeTextClass(className, element) {
  // CURRENT
  if ($(element).prev().hasClass('rangySelectionBoundary')
    && $(element).next().hasClass('rangySelectionBoundary')) { // Check prev & next with rangyBoundry class
    $(element).prev('.rangySelectionBoundary').detach('.rangySelectionBoundary');
    $(element).next('.rangySelectionBoundary').detach('.rangySelectionBoundary');
  }
  $(element).removeClass(className);
  $(element).toggleClass('rangy');
  // PREV
  let lp = $("." + className).length;
  let prevEle = $(element).parent().prev().children();
  let nextEle = $(element).parent().next().children();
  if ($(prevEle).hasClass(className)) {
    for (let i = 0; i < lp; i++) {
      for (let j = prevEle.length; j > 0; j--) {
        if ($(prevEle).hasClass('rangySelectionBoundary')) {
          prevEle = $.each(prevEle, (index, ele) => {
            if (ele.className == 'rangySelectionBoundary') {
              $(ele).detach('.rangySelectionBoundary');
              $(ele).toggleClass('rangy');
            }
          });
        }
        if ($(prevEle).hasClass(className)) {
          $(prevEle).removeClass(className); // remove claas
          $(prevEle).toggleClass('rangy');
          prevEle = $(prevEle).parent().prev().children(); // set every div this ele
        }
        else if (!$(prevEle).hasClass(className) && $(prevEle).has('span').length) {
          $(prevEle).removeClass(className); // remove claas
          $(prevEle).toggleClass('rangy');
          prevEle = $(prevEle).parent().prev().children(); // set every div this ele
        }
      }
    }
  }
  // NEXT
  if ($(nextEle).hasClass(className)) {
    for (let i = 0; i < lp; i++) {
      for (let j = 0; j < nextEle.length; j++) {
        if ($(nextEle).hasClass('rangySelectionBoundary')) {
          nextEle = $.each(nextEle, (index, ele) => {
            if (ele.className == 'rangySelectionBoundary') {
              $(ele).detach('.rangySelectionBoundary');
            }
          });
        }
        if ($(nextEle).hasClass(className)) {
          $(nextEle).removeClass(className); // remove claas
          $(nextEle).toggleClass('rangy');
          nextEle = $(nextEle).parent().next().children(); // set every div this element
        }
        else if (!$(nextEle).hasClass(className) && $(nextEle).has('span').length) {
          $(nextEle).removeClass(className); // remove claas
          $(nextEle).toggleClass('rangy');
          nextEle = $(nextEle).parent().next().children(); // set every div this element
        }
      }
    }
  }

}
// join array
function join(arr, last?) {
  if (!Array.isArray(arr)) throw "Passed value is not of array type.";
  last = last || ' ';

  return arr.reduce(function (acc, value, index) {
    if (arr.length < 2) return arr.join();
    return acc + (index >= arr.length - 2 ? index > arr.length - 2 ? value : value + last : value + ",");
  }, "");
}
// find hasClass from multip divs
function checkDuplicateClasses(contentHtml: string) {
  try {
    if ((contentHtml.toLocaleLowerCase().indexOf(ClassTypes.heading) !== -1) ||
      (contentHtml.toLocaleLowerCase().indexOf(ClassTypes.header) !== -1) ||
      (contentHtml.toLocaleLowerCase().indexOf(ClassTypes.footer) !== -1) ||
      (contentHtml.toLocaleLowerCase().indexOf(ClassTypes.exclude) !== -1)) {
      return true;
    } else {
      return false;
    }
  } catch (ex) {

  }
}
// Find Matched Data from orignal payload
function findMatchedData(payload, prevText, currText, nextText, className): IFindMatched {
  let prvTxt = prevText && prevText.length ? prevText.reverse().join('') : '';
  let nxtText = nextText && nextText.length ? nextText.join('') : '';
  let finalText = prvTxt + currText + nxtText;
  let resultObj: IFindMatched = { isMatched: true, option: null, index: null, findText: '' };
  if (finalText) {
    if (payload.title.includes(finalText)) {
      return resultObj;
    } else if (payload.header.includes(finalText)) {
      return resultObj;
    } else if (payload.footer.includes(finalText)) {
      return resultObj;
    } else if (payload.ignoreText.includes(finalText)) {
      return resultObj;
    } else {
      resultObj.isMatched = false;
    }
    if (!resultObj.isMatched) {
      if (payload.title.length) {
        payload.title.forEach((item, index) => {
          let subStr = item.substr(finalText, finalText.length);
          if (subStr && payload.title.includes(subStr)) {
            resultObj = { isMatched: true, option: 'title', index: index, findText: subStr };
          }
        });
      } else if (payload.header.length) {
        payload.header.forEach((item, index) => {
          let subStr = item.substr(finalText, finalText.length);
          if (subStr && payload.header.includes(subStr)) {
            resultObj = { isMatched: true, option: 'header', index: index, findText: subStr };
          }
        });
      } else if (payload.footer.length) {
        payload.footer.forEach((item, index) => {
          let subStr = item.substr(finalText, finalText.length);
          if (subStr && payload.footer.includes(subStr)) {
            resultObj = { isMatched: true, option: 'footer', index: index, findText: subStr };
          }
        });
      } else if (payload.ignoreText.length) {
        payload.ignoreText.forEach((item, index) => {
          let subStr = item.substr(finalText, finalText.length);
          if (subStr && payload.ignoreText.includes(subStr)) {
            resultObj = { isMatched: true, option: 'ignoreText', index: index, findText: subStr };
          }
        });
      }
      return resultObj;
    }
  }
}
// Remove text match obj
interface IFindMatched {
  isMatched: boolean;
  option: string | null;
  index: number | null;
  findText: string | null;
}
