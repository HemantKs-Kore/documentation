import { Component, ChangeDetectionStrategy, OnInit, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { LazyLoadService } from '@kore.libs/shared/src';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { Observable } from 'rxjs';
import { ConvertMDtoHTML } from '../../../helpers/lib/convertHTML';
declare const $: any;
@Component({
  selector: 'app-simulate',
  templateUrl: './simulate.component.html',
  styleUrls: ['./simulate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulateComponent implements OnInit{
  codeMirrorOptions: any = {
    theme: 'idea',
    mode: "application/ld+json",
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    readOnly: true
  };
  showSummaryView = true;
  summaryViewObj: any = new SummaryViewObjSchema();
  private _array = Array;
  @Input() config: any;
  @Output() closeSlider = new EventEmitter();
  constructor(private service: ServiceInvokerService, private notificationService: NotificationService, public convertMDtoHTML: ConvertMDtoHTML, private cd: ChangeDetectorRef, private lazyLoadService: LazyLoadService) { }

  ngOnInit(): void {
    this.lazyLoadCodeMirror();
  }

  //close slider event
  closeSimulator() {
    this.closeSlider.emit();
    this.showSummaryView = true;
    this.summaryViewObj = new SummaryViewObjSchema();
  }

  //click enter using keydown event
  enterSimulateTest(event) {
    if (event?.keyCode === 13) this.simulateTest();
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
    this.service.invoke('post.simulateTest', quaryparms, payload).subscribe(
      (res) => {
        if (res) {
          this.summaryViewObj.isLoading = false;
          const snippetArray = res?.graph_answer?.payload;
          const Data = [];
          for (const item of snippetArray) {
            Data.push(item?.center_panel.data[0])
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
          this.cd.detectChanges();
        }
      },
      (errRes) => {
        this.summaryViewObj.isLoading = false;
        this.errorToaster(errRes, 'Simulate API Failed');
      }
    );
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