import { Component, ChangeDetectionStrategy, OnInit, Output, Input, EventEmitter, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { LazyLoadService } from '@kore.libs/shared/src';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { delay, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ConvertMDtoHTML } from '../../../helpers/lib/convertHTML';
declare const $: any;
@Component({
  selector: 'app-simulate',
  templateUrl: './simulate.component.html',
  styleUrls: ['./simulate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulateComponent implements OnInit {
  codeMirrorOptions: any = {
    theme: 'neo',
    mode: "javascript",
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: false,
    indentUnit: 2
  };
  simulateApiCalls = new Subject();
  showSummaryView = true;
  summaryViewObj: any = new SummaryViewObjSchema();
  private _array = Array;
  isReadMore: Boolean = true;
  isShowReadMore: Boolean = false;
  simulateService = {
    debounceSimulate: () => of({}).pipe(delay(400)),
  };
  @ViewChild("readMoreText") readMoreText: ElementRef<any>;
  @Input() config: any;
  @Output() closeSlider = new EventEmitter();
  constructor(private service: ServiceInvokerService, private notificationService: NotificationService, public convertMDtoHTML: ConvertMDtoHTML, private cd: ChangeDetectorRef, private lazyLoadService: LazyLoadService) { }

  ngOnInit(): void {
    this.lazyLoadCodeMirror();
  }

  //close slider event
  closeSimulator() {
    this.simulateApiCalls.next(false);
    this.closeSlider.emit();
    this.showSummaryView = true;
    this.isShowReadMore = false;
    this.isReadMore = true;
    this.summaryViewObj = new SummaryViewObjSchema();
  }

  //click enter using keydown event
  enterSimulateTest(event) {
    if (event?.keyCode === 13 && this.summaryViewObj.query.length > 0) this.simulateTest();
  }

  //simulateTest click button event
  simulateTest() {
    this.summaryViewObj.isLoading = true;
    const quaryparms: any = {
      sidx: this.config?.searchIndexId,
      indexPipelineId: this.config?.indexPipelineId,
      queryPipelineId: this.config?.queryPipelineId
    };
    const payload = { "query": this.summaryViewObj.query };
    this.simulateService.debounceSimulate().pipe(
      takeUntil(this.simulateApiCalls),
      switchMap(res => this.getSimulateData(quaryparms, payload))
    ).subscribe(
      (res) => {
        if (res) {
          this.summaryViewObj.isLoading = false;
          const snippetArray = res?.graph_answer?.payload;
          const Data = [];
          for (const item of snippetArray) {
            if (item?.center_panel?.data?.length) {
              item.center_panel.data[0].snippet_title = (item.center_panel.data[0].snippet_title === '**' || item.center_panel.data[0].snippet_title === "*®*") ? '' : item.center_panel.data[0].snippet_title;
            }
            Data.push({ ...item?.center_panel.data[0], type: item?.center_panel?.type })
          }
          if (Data.length < 2) {
            let emptyObj = [];
            if (Data.length === 1) {
              emptyObj = this.summaryViewObj.data?.filter(item => item?.snippet_type !== Data[0].snippet_type);
            }
            else {
              emptyObj = this.summaryViewObj.data;
            }
            for (const item of emptyObj) {
              item.isNoAnswer = true;
              item.message = 'No Answer';
              delete item?.snippet_content;
              Data.push(item);
            }
          }
          this.summaryViewObj.dynamicQuery = res?.query;
          this.summaryViewObj.data = Data;
          this.summaryViewObj.jsonData = JSON.stringify(res?.graph_answer, null, "\t");
          this.summaryViewObj.isCopyBtnShow = false;
          setTimeout(() => {
            this.isShowReadMore = this.readMoreText?.nativeElement?.scrollHeight > 143 ? true : false;
          }, 200)
          this.cd.detectChanges();
        }
      },
      (errRes) => {
        this.summaryViewObj.isLoading = false;
        this.errorToaster(errRes, 'Simulate API Failed');
      }
    );
  }

  //get simulate Data using simulate
  getSimulateData(quaryparms, payload) {
    return this.service.invoke('post.simulateTest', quaryparms, payload).pipe(
      takeUntil(this.simulateApiCalls),
    )
  }

  //show more or less using isShowReadMore Flag
  showLessMore() {
    this.readMoreText.nativeElement.style.webkitLineClamp = this.isReadMore ? 'initial' : '8';
    this.isReadMore = !this.isReadMore;
  }

  //common for toast messages
  errorToaster(errRes, message) {
    let text: string;
    if (errRes?.error?.errors?.length && errRes?.error?.errors[0]?.msg) {
      text = errRes.error.errors[0].msg;
    } else if (message) {
      text = message;
      this.notificationService.notify(message, 'error');
    } else {
      text = 'Somthing went worng';
    }
    this.notificationService.notify(text, 'error');
  }

  //copy snippet JSON
  copySnippetJSON() {
    const jsonBox: any = document.createElement('textarea');
    jsonBox.innerText = JSON.stringify(this.summaryViewObj.data);
    jsonBox.setAttribute('readonly', '');
    jsonBox.style.position = 'absolute';
    document.body.appendChild(jsonBox);
    jsonBox.focus();
    jsonBox.select();
    document.execCommand('copy')
    document.body.removeChild(jsonBox);
    this.notificationService.notify('Copied to clipboard', 'success')
  }

  //enable or disbale Dark mode for Code-mirror
  enableDarkMode() {
    this.summaryViewObj.jsonDarkTheme = !this.summaryViewObj.jsonDarkTheme;
    const color = this.summaryViewObj.jsonDarkTheme ? 'white' : 'black';
    const background = this.summaryViewObj.jsonDarkTheme ? 'black' : 'white';
    $('.CodeMirror-code').css({ 'color': color, 'background': background });
  }

  //lazyload code-mirror package css
  lazyLoadCodeMirror(): Observable<any[]> {
    return this.lazyLoadService.loadStyle('codemirror.min.css');
  }

  //open reference link in seperate tab
  openReferenceLink(link) {
    window.open(link, '_blank');
  }

  ngOnDestroy() {
    this.simulateApiCalls.next(false);
  }

}


class SummaryViewObjSchema {
  isLoading = false;
  query = '';
  jsonData = JSON.stringify({});
  jsonDarkTheme = false;
  isCopyBtnShow = true;
  dynamicQuery = '';
  data = [{ timeTaken: 'NA ms', "snippet_type": "extractive_model", message: 'No Question Yet', snippet_content: 'No Answer' }, { timeTaken: 'NA ms', "snippet_type": "generative_model", message: 'No Question Yet', snippet_content: 'No Answer' }];
}