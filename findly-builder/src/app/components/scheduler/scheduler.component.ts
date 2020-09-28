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
  stz = 'Time Zone';
  rstz = 'Does not repeat';
  meridiem = 'AM';
  cronExpression = "* * * * * ?"
  timeHH = '';
  timeMM = '';
  day = '';
  date = '';
  month = '';
  year = '';
  scheduleData : any = {};
  @Input() crwalObject : any;
  @Input() schedule : any;
  @ViewChild('customRecurrence') customRecurrence: KRModalComponent;
  constructor() { 
    var date = new Date;
    this.day = date.toString().split(" ")[0].toLocaleUpperCase();
    this.month =  date.toString().split(" ")[1].toLocaleUpperCase();
    this.date =  date.toString().split(" ")[2];
    this.year =  date.toString().split(" ")[3];
    ;
  }

  ngOnInit(): void {
    if(this.schedule == 'get'){
      $('.mat-datepicker-toggle').addClass('mat-date-icon');
    }else{
      $('.mat-datepicker-toggle').removeClass('mat-date-icon');
    }
    
  }
  modelChangeFn(event,time){
    if(event > 11 && time == 'HH'){
      this.timeHH = '11';
      this.changeMeridiem('PM');
    }else if(event == 0 && time == 'HH'){
      this.timeHH = '0';
      this.changeMeridiem('AM');
    }else{
      this.calculateCronExpression()
    }
    // if(time == 'MM'){
    //   this.calculateCronExpression()
    // }
    
  }
  timeZone(stz){
    this.stz = stz;
    this.calculateCronExpression()
  }
  repeatTimeZone(rstz){
    this.rstz = rstz;
    this.calculateCronExpression()
  }
  changeMeridiem(meridiem){
    if(Number(this.timeHH) > 11 ){
      meridiem = 'PM' ;
    }else if(Number(this.timeHH) == 0){
      meridiem = 'AM' ;
    }
    this.meridiem = meridiem;
    this.calculateCronExpression()
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date> , rstz : string) {
    console.log(`${type}: ${event.value}`);
    if(rstz == 'regular'){
      this.day = event.value.toString().split(" ")[0].toLocaleUpperCase();
      this.month =  event.value.toString().split(" ")[1].toLocaleUpperCase();
      this.date = event.value.toString().split(" ")[2];
      this.year = event.value.toString().split(" ")[3];
    }
  }
  calculateCronExpression(){
    let timeHH = this.timeHH;
    // Check for AM -PM conversion 12-24;
    if(this.meridiem == 'PM' && timeHH != '' && Number(timeHH) <= 24){
        timeHH = this.timeHH + 12;
        if(Number(timeHH) == 24) {
          timeHH = (Number(this.timeHH) - 12).toLocaleString();
        }
    }
    this.timeMM == '' ? this.timeMM = '00' :  this.timeMM  = this.timeMM;
    timeHH == '' ? timeHH = '00' :  timeHH  = timeHH;
    if(this.rstz == 'Does not repeat'){
      this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' ' + this.date + ' ' + this.month + ' ? ' + this.year;
    }else if(this.rstz == 'Daily'){
      this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' * ' + '*';
    }else if(this.rstz == 'Weekly'){
      this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH +  ' ? ' + '* ' + this.day +' *';
    }else if(this.rstz == 'Monthly'){
      this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' '+  this.date + ' * ' + '?';
    }else if(this.rstz == 'Anually'){
      //this.cronExpression = '0' + this.timeMM + ' '+ this.timeHH + ' '+  this.date + ' '+ this.month + '? ' + this.year + ' ' +'-2099';
      this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH  + ' ' +  this.date + ' '+ this.month + ' ? ' + '*';
    }else if(this.rstz == 'Every weekday(Monday to Friday)'){
      this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH +  ' ?' + ' * ' + 'MON-FRI ' + '*';
    }else if(this.rstz == 'Custom'){

    }
    console.log(this.cronExpression);
    this.scheduleData = {}
  }
  
  openCustomRecModal(rstz){
    this.rstz = rstz;
    this.customRecurrenceRef = this.customRecurrence.open();
  }
  closeCustomRecModal(){
    if (this.customRecurrenceRef &&  this.customRecurrenceRef.close) {
      this.customRecurrenceRef.close();
    }
  }
}
