import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { scheduleOpts ,InterVal , Time , IntervalValue, EndsOn} from 'src/app/helpers/models/Crwal-advance.model';
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
  startDate = '';
  endDate = '';
  occurence = '';
  endsNever = true;
  endsOn = false;
  endsAt = false;
  custFreq = 'Weeks';
  weeKDay = 'SUN';
  stz = 'Time Zone';
  rstz = 'Does not repeat';
  meridiem = 'AM';
  cronExpression = "* * * * * ?"
  timeHH = '';
  timeMM = '';
  repeatEvery = '';
  day = '';
  date = '';
  month = '';
  year = '';
  endsOnSelected = '';
  //scheduleData : scheduleOpts = new scheduleOpts();
  @Input() crwalObject : any;
  @Input() schedule : any;
  @Output() scheduleData = new EventEmitter();
  @Output() cronExpress = new EventEmitter();
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
    this.endsFreq('endsNever');
    console.log(this.dateConverter('SUN'))
    console.log(this.crwalObject);
    if(this.crwalObject && this.crwalObject.advanceSettings && this.crwalObject.advanceSettings.scheduleOpts){
      this.startDate  = this.crwalObject.advanceSettings.scheduleOpts.date;
      this.timeHH = this.crwalObject.advanceSettings.scheduleOpts.time.hour;
      this.timeMM = this.crwalObject.advanceSettings.scheduleOpts.time.minute;
      this.meridiem = this.crwalObject.advanceSettings.scheduleOpts.time.timeOpt;
      this.stz = this.crwalObject.advanceSettings.scheduleOpts.time.timezone || 'Time Zone';
      this.rstz = this.crwalObject.advanceSettings.scheduleOpts.interval.intervalType || 'Does not repeat';
      if(this.crwalObject.advanceSettings.scheduleOpts.intervalValue){
        this.repeatEvery = this.crwalObject.advanceSettings.scheduleOpts.intervalValue.every;
        this.custFreq = this.crwalObject.advanceSettings.scheduleOpts.intervalValue.schedulePeriod;
        this.weeKDay = this.crwalObject.advanceSettings.scheduleOpts.intervalValue.repeatOn;
        this.endDate  = this.crwalObject.advanceSettings.scheduleOpts.intervalValue.endsOn.endDate;
        this.occurence = this.crwalObject.advanceSettings.scheduleOpts.intervalValue.endsOn.occurrences;
        this.endsFreq(this.crwalObject.advanceSettings.scheduleOpts.intervalValue.endsOn.endType);
      }
    } 
  }
  modelChangeFn(event,time){
   if(time !='repeatEvery'){
    if(event > 12 && time == 'HH'){
      this.timeHH = '12';
      this.changeMeridiem('PM');
    }else if(event == 0 && time == 'HH'){
      this.timeHH = '0';
      this.changeMeridiem('AM');
    }else{
      this.calculateCronExpression()
    }
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
    if(Number(this.timeHH) >= 12 ){
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
    if(this.meridiem == 'PM' && timeHH != '' && (Number(timeHH) > 12) && Number(timeHH) <= 24){
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
      this.customFrequency(timeHH);
    }
    console.log(this.cronExpression);
    this.scheduleEmittFunc();
  }
  customFrequency(timeHH){
    if(!this.repeatEvery){
      this.repeatEvery = '1';
    }
    if(this.custFreq == 'Days'){
      this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' */'+this.repeatEvery + ' *';
    }else if(this.custFreq == 'Weeks'){
      this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' ?' + ' * ' + this.dateConverter(this.weeKDay)+ '#' + this.repeatEvery; 
    }else if(this.custFreq == 'Months'){
      this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' ' + this.date + ' */'+this.repeatEvery + ' ?';
    }else if(this.custFreq == 'Years'){
      this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' ' + this.date + ' '+ this.month + ' ' + '?' + ' */'+this.repeatEvery;
    }
  }
  dateConverter(weeKDay){
   var day;
    switch(weeKDay) {
      case 'SUN':
        day =  "1";
        break;
      case 'MON':
        day = "2"
        break;
      case 'TUE':
        day = "3"
        break;
      case 'WED':
        day = "4";
        break;
      case 'THU':
        day = "5";
        break;
      case 'FRI':
        day = "6";
        break;
      case 'SAT':
        day = "7";
    }
    return day;
  }
  scheduleEmittFunc(){
    let scheduledObject : scheduleOpts = new scheduleOpts();
    let time : Time = new Time();
    let interVal : InterVal = new InterVal();
    let intervalValue : IntervalValue = new IntervalValue(); 
    let endsOn : EndsOn = new EndsOn();
    /**Secheduled Data */
    scheduledObject.date = this.startDate || '';
    scheduledObject.time = time;
    /** Time data */
    time.hour = this.timeHH;
    time.minute = this.timeMM;
    time.timeOpt = this.meridiem;
    time.timezone = this.stz;
    /** Time data */
    scheduledObject.interval = interVal;
    /** interVal Data */
    interVal.intervalType = this.rstz;
    interVal.intervalValue = intervalValue;
    /** interVal Data */
    /** IntervalValue Data */
    intervalValue.every = Number(this.repeatEvery);
    intervalValue.schedulePeriod = this.custFreq;
    intervalValue.repeatOn = this.custFreq == "Weeks" ? this.weeKDay : ''; 
    intervalValue.endsOn = endsOn || new EndsOn();
    /** IntervalValue Data */
    /**  EndsOn data */
    endsOn.endType = this.endsOnSelected;
    endsOn.endDate = this.endDate;
    endsOn.occurrences = Number(this.occurence);
    /**  EndsOn data */
    /**Secheduled Data */
    this.scheduleData.emit(scheduledObject);
    this.cronExpress.emit(this.cronExpression)
  }
  proccedWithCrwal(){
    this.calculateCronExpression();
    this.closeCustomRecModal();
  }
  cancelCustomRecModal(){
    this.repeatEvery = '';
    this.custFreq = 'Weeks';
    this.weeKDay = 'SUN';
    this.endDate  = '';
    this.occurence = '';
    this.endsFreq('endsNever');
    this.closeCustomRecModal();
  }
  endsFreq(freq){
    if(freq == 'never'){
      this.endsNever = true;
      this.endsOn = false;
      this.endsAt = false;
      this.endsOnSelected = freq;
    }else if(freq == 'on'){
      this.endsNever = false;
      this.endsOn = true;
      this.endsAt = false;
      this.endsOnSelected = freq;
    }else if(freq == 'at'){
      this.endsNever = false;
      this.endsOn = false;
      this.endsAt = true;
      this.endsOnSelected = freq;
    }
    
  }
  /** Custom- modal Function */
  custFrequency(freq){
    this.custFreq = freq;
    //this.calculateCronExpression();
  }
  custweeKday(wd){
    this.weeKDay = wd;
    //this.calculateCronExpression();
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


// export class InterVal {
//   intervalType:String ="";
//   intervalValue: IntervalValue = new IntervalValue();
// }
// export class Time{
//       hour:String ="";
//       minute:String ="";
//       timeOpt:String ="";
//       timezone:String ="";
// }

// export class IntervalValue {
//   every: number = null ;
//   schedulePeriod: String ="";
//   repeatOn: String ="";
//   endsOn: EndsOn = new EndsOn();
// }
// export class EndsOn {
//   endType:String ="";
//   endDate:String ="";
//   occurrences:number = null;

// }