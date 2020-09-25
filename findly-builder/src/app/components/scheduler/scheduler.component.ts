import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
declare const $: any;

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  //allowUrl : AllowUrl = new AllowUrl();
 // blockUrl : BlockUrl = new BlockUrl();
  customRecurrenceRef : any = [];
  @Input() crwalObject : any;
  @Input() schedule : any;
  @ViewChild('customRecurrence') customRecurrence: KRModalComponent;
  constructor() { }

  ngOnInit(): void {
    if(this.schedule == 'get'){
      $('.mat-datepicker-toggle').addClass('mat-date-icon');
    }else{
      $('.mat-datepicker-toggle').removeClass('mat-date-icon');
    }
    
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(`${type}: ${event.value}`);
  }
  openCustomRecModal(){
    this.customRecurrenceRef = this.customRecurrence.open();
  }
  closeCustomRecModal(){
    if (this.customRecurrenceRef &&  this.customRecurrenceRef.close) {
      this.customRecurrenceRef.close();
    }
  }
}
