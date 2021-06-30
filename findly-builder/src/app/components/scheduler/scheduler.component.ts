import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { scheduleOpts ,InterVal , Time , IntervalValue, EndsOn} from 'src/app/helpers/models/Crwal-advance.model';
import { NotificationService } from '@kore.services/notification.service';
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
  istStratDate: any;
  startDate :any;
  endDate : any;
  occurence = '';
  endsNever = true;
  endsOn = false;
  endsAt = false;
  dateOrdinal= '';
  custFreq = 'Week';
  weeKDay = 'SUN';
  stz = 'Time Zone';
  rstz = 'Does not repeat';
  meridiem = 'AM';
  cronExpression = "* * * * * ?"
  timeHH = '';
  timeMM = '';
  repeatEvery = '1';
  day = '';
  date = '';
  month = '';
  year = '';
  endsOnSelected = '';
  minDate;
  schedulerFlag : boolean= false;
  //scheduleData : scheduleOpts = new scheduleOpts();
  @Input() scheduleFlag: any;
  @Input() crwalObject : any;
  @Input() schedule : any;
  @Output() scheduleData = new EventEmitter();
  @Output() cronExpress = new EventEmitter();
  @ViewChild('customRecurrence') customRecurrence: KRModalComponent;
  constructor(private notificationService: NotificationService) { 
    var date = new Date;
    this.day = date.toString().split(" ")[0].toLocaleUpperCase();
    this.weeKDay = this.day || 'SUN'; 
    this.month =  date.toString().split(" ")[1].toLocaleUpperCase();
    this.date =  date.toString().split(" ")[2];
    this.year =  date.toString().split(" ")[3];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    this.minDate = new Date(currentYear, currentMonth, currentDay);
  }

  ngOnInit(): void {
    // if(this.schedule == 'get'){
    //   if(this.crwalObject && this.crwalObject.advanceSettings && this.crwalObject.advanceSettings){
    //     this.startDate  = this.crwalObject.advanceSettings.date;
    //     this.timeHH = this.crwalObject.advanceSettings.hour;
    //     this.timeMM = this.crwalObject.advanceSettings.minute;
    //     this.meridiem = this.crwalObject.advanceSettings.timeOpt;
    //     this.stz = this.crwalObject.advanceSettings.timezone || 'Time Zone';
    //     this.rstz = this.crwalObject.advanceSettings.intervalType || 'Does not repeat';
    //       this.repeatEvery = this.crwalObject.advanceSettings.every;
    //       this.custFreq = this.crwalObject.advanceSettings.schedulePeriod;
    //       this.weeKDay = this.crwalObject.advanceSettings.repeatOn;
    //       this.endDate  = this.crwalObject.advanceSettings.endDate;
    //       this.occurence = this.crwalObject.advanceSettings.occurrences;
    //       this.endsFreq(this.crwalObject.advanceSettings.endType);
    //   } 
    // }else{
    //  if(this.crwalObject && this.crwalObject.advanceSettings && this.crwalObject.advanceSettings.scheduleOpts){
    //   this.startDate  = this.crwalObject.advanceSettings.scheduleOpts.date;
    //   this.timeHH = this.crwalObject.advanceSettings.scheduleOpts.time.hour;
    //   this.timeMM = this.crwalObject.advanceSettings.scheduleOpts.time.minute;
    //   this.meridiem = this.crwalObject.advanceSettings.scheduleOpts.time.timeOpt;
    //   this.stz = this.crwalObject.advanceSettings.scheduleOpts.time.timezone || 'Time Zone';
    //   this.rstz = this.crwalObject.advanceSettings.scheduleOpts.interval.intervalType || 'Does not repeat';
    //   if(this.crwalObject.advanceSettings.scheduleOpts.intervalValue){
    //     this.repeatEvery = this.crwalObject.advanceSettings.scheduleOpts.intervalValue.every;
    //     this.custFreq = this.crwalObject.advanceSettings.scheduleOpts.intervalValue.schedulePeriod;
    //     this.weeKDay = this.crwalObject.advanceSettings.scheduleOpts.intervalValue.repeatOn;
    //     this.endDate  = this.crwalObject.advanceSettings.scheduleOpts.intervalValue.endsOn.endDate;
    //     this.occurence = this.crwalObject.advanceSettings.scheduleOpts.intervalValue.endsOn.occurrences;
    //     this.endsFreq(this.crwalObject.advanceSettings.scheduleOpts.intervalValue.endsOn.endType);
    //   }
    // } 
    // }
    this.endsFreq('never');
    if(this.crwalObject && this.crwalObject.advanceSettings && this.crwalObject.advanceSettings.scheduleOpts){
      this.istStratDate = this.crwalObject.advanceSettings.scheduleOpts.date;
      this.startDate  = this.crwalObject.advanceSettings.scheduleOpts.date;
      if(this.crwalObject.advanceSettings.scheduleOpts.time){
        this.timeHH = this.crwalObject.advanceSettings.scheduleOpts.time.hour;
        this.timeMM = this.crwalObject.advanceSettings.scheduleOpts.time.minute;
        this.meridiem = this.crwalObject.advanceSettings.scheduleOpts.time.timeOpt;
        this.stz = this.crwalObject.advanceSettings.scheduleOpts.time.timezone || 'Time Zone';
      }
      this.rstz = this.crwalObject.advanceSettings.scheduleOpts.interval.intervalType || 'Does not repeat';
    //  if(this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue){
    //     this.repeatEvery = this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue.every;
    //     this.custFreq = this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue.schedulePeriod;
    //     this.weeKDay = this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue.repeatOn;
    //     this.endDate  = this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue.endsOn.endDate;
    //     this.occurence = this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue.endsOn.occurrences;
    //     this.endsFreq(this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue.endsOn.endType);
    //   } 
      if(this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue){
        this.endsFreq(this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue.endsOn.endType,'set');
        this.repeatEvery = this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue.every ? this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue.every : this.repeatEvery;
        this.custFreq = this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue.schedulePeriod ? this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue.schedulePeriod : this.custFreq;
        this.weeKDay = this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue.repeatOn ? this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue.repeatOn : this.weeKDay;
        //this.weeKDay = this.weeKDay.charAt(0).toUpperCase() + this.weeKDay.slice(1);
        this.endDate  = this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue.endsOn.endDate ? this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue.endsOn.endDate : this.endDate;
        this.occurence = this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue.endsOn.occurrences ? this.crwalObject.advanceSettings.scheduleOpts.interval.intervalValue.endsOn.occurrences : this.occurence;
        
      } 
    } 
    this.schedulerFlag = this.scheduleFlag;
    console.log(this.schedulerFlag);
    
    //console.log(this.dateConverter('SUN'))
    //console.log(this.crwalObject);
    
  }
  ngOnChanges(changes) {
    console.log("ngOnChanges", this.scheduleFlag);
    this.schedulerFlag = this.scheduleFlag;
    if(!this.scheduleFlag){
      var emptyData  = new scheduleOpts();
      this.scheduleData.emit(emptyData);
      this.istStratDate = '';
      this.startDate  = '';
        this.timeHH = '';
        this.timeMM = '';
        this.meridiem = 'AM';
        this.stz =  'Time Zone';
      
      this.rstz = 'Does not repeat';
        this.repeatEvery = '1';
        this.custFreq = 'Week';
        this.weeKDay = this.day || 'SUN';
        this.endDate  = '';
        this.occurence = '';
        this.endsFreq('never');
        
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
   }else{
    this.custFrequency(this.custFreq)
   }
    // if(time == 'MM'){
    //   this.calculateCronExpression()
    // }
    
  }
  timeZone(stz){
    this.stz = stz;
    // if(this.startDate){
    //   if(this.stz == 'IST'){
    //     this.startDate = this.istStratDate;
    //   }else if(this.stz == 'UTC'){
    //     this.startDate = new Date(this.startDate).toISOString();
    //   }else{
    //     var dt = new Date();
    //     var estDate = new Date(dt.getTime() + -300*60*1000);
    //     this.startDate = estDate.toString();
    //   } 
    // }
    this.calculateCronExpression()
  }
  repeatTimeZone(rstz){
    this.rstz = rstz;
    this.calculateCronExpression()
  }
  changeMeridiem(meridiem){
    if(this.scheduleFlag){
      if(Number(this.timeHH) >= 12 ){
        meridiem = 'PM' ;
      }else if(Number(this.timeHH) == 0){
        meridiem = 'AM' ;
      }
      this.meridiem = meridiem;
      this.calculateCronExpression()
    }
    
  }
  addEventCustom(type: string, event: MatDatepickerInputEvent<Date> , rstz : string){
    this.endDate = event.value;
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date> , rstz : string) {
    console.log(`${type}: ${event.value}`); 
    
    if(rstz == 'regular'){
      this.day = event.value.toString().split(" ")[0].toLocaleUpperCase();
      this.month =  event.value.toString().split(" ")[1].toLocaleUpperCase();
      this.date = event.value.toString().split(" ")[2];
      this.dateOrdinal= this.ordinal_nth(Number(this.date));
      this.year = event.value.toString().split(" ")[3];
      this.istStratDate = event.value;
      this.startDate = event.value;
    }else if(rstz ='custom'){
      
    }
    this.calculateCronExpression()
  }
  calculateCronExpression(){
    let timeHH = this.timeHH;
    // Check for AM -PM conversion 12-24;
    if(this.meridiem == 'PM' && timeHH != '' && (Number(timeHH) > 0) && Number(timeHH) <= 24){
        timeHH = this.timeHH + 12;
        if(Number(timeHH) == 24) {
          timeHH = (Number(this.timeHH) - 12).toLocaleString();
        }
    }
    this.timeMM == '' ? this.timeMM = '00' :  this.timeMM  = this.timeMM;
    timeHH == '' ? timeHH = '00' :  timeHH  = timeHH;
    if(this.rstz == 'Does not repeat'){
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' ' + this.date + ' ' + this.month + ' ? ' + this.year;
      //this.cronExpression = this.timeMM + ' '+ timeHH + ' ' + this.date + ' ' + this.month + ' ' + this.year;
      this.cronExpression =  '';
    }else if(this.rstz == 'Daily'){
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' * ' + '*';
      this.cronExpression =  this.timeMM + ' '+ timeHH + ' * ' + '* ' + '*';
    }else if(this.rstz == 'Weekly'){
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH +  ' ? ' + '* ' + this.day +' *';
      this.cronExpression = this.timeMM + ' '+ timeHH +  ' * ' + '* ' + this.day;
    }else if(this.rstz == 'Monthly'){
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' '+  this.date + ' * ' + '?';
      this.cronExpression = this.timeMM + ' '+ timeHH + ' '+  this.date + ' ' + '*' + ' '+ '*';
    }else if(this.rstz == 'Annually'){
      //this.cronExpression = '0' + this.timeMM + ' '+ this.timeHH + ' '+  this.date + ' '+ this.month + '? ' + this.year + ' ' +'-2099';
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH  + ' ' +  this.date + ' '+ this.month + ' ? ' + '*';
      this.cronExpression =  this.timeMM + ' '+ timeHH  + ' ' +  this.date + ' '+ this.month + ' ' + '*';
    }else if(this.rstz == 'Every weekday'){
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH +  ' ?' + ' * ' + 'MON-FRI ' + '*';
      this.cronExpression = this.timeMM + ' '+ timeHH +  ' *' + ' * ' + ' MON,TUE,WED,THU,FRI';
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
    if(this.custFreq == 'Days' || this.custFreq == 'Day' || this.custFreq == 'days'){
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' */'+this.repeatEvery + ' *';
      this.cronExpression = this.timeMM + ' '+ timeHH + ' */'+this.repeatEvery + ' * ' + '*';
      this.cronExpression = this.repeatEvery + ' days';
    }else if(this.custFreq == 'Weeks' || this.custFreq == 'Week' || this.custFreq == 'weeks'){
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' ?' + ' * ' + this.dateConverter(this.weeKDay)+ '#' + this.repeatEvery; 
      this.cronExpression = this.repeatEvery + ' weeks';
    }else if(this.custFreq == 'Months' || this.custFreq == 'Month' || this.custFreq == 'months'){
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' ' + this.date + ' */'+this.repeatEvery + ' ?';
      //this.cronExpression = this.timeMM + ' '+ timeHH + ' ' + this.date + ' */'+this.repeatEvery + ' *';
      this.cronExpression = this.repeatEvery + ' months';
    }else if(this.custFreq == 'Years' || this.custFreq == 'Year' || this.custFreq == 'years'){
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' ' + this.date + ' '+ this.month + ' ' + '?' + ' */'+this.repeatEvery;
      this.cronExpression = this.repeatEvery + ' years';
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
  lower(string) {
    return string.charAt(0).toLowerCase() + string.slice(1).toLowerCase();
  }
  dateFormatConverter(date){
    if(date && typeof(date) == "object"){
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let dayStr = String(day);
        let monthStr = String(month);
        if(day < 10) {
          dayStr = '0'+day;
        }
        if(month < 10) {
          monthStr = '0'+ month;
        }
        return year + '-' + monthStr + '-' + dayStr;
    }else if(date && typeof(date) == "string"){
      return date;
    }else{
      return null;
    }
  }
  scheduleEmittFunc(){
    let scheduledObject : scheduleOpts = new scheduleOpts();
    let time : Time = new Time();
    let interVal : InterVal = new InterVal();
    let intervalValue : IntervalValue = new IntervalValue(); 
    let endsOn : EndsOn = new EndsOn();
    /**Secheduled Data */
    
    scheduledObject.date = this.dateFormatConverter(this.startDate);
    scheduledObject.time = time;
    /** Time data */
    time.hour = String(this.timeHH);
    time.minute = this.timeMM;
    time.timeOpt = this.meridiem;
    time.timezone = this.stz;
    /** Time data */
    scheduledObject.interval = interVal;
    /** interVal Data */
    interVal.intervalType = this.rstz ;
    interVal.intervalValue = intervalValue;
    /** interVal Data */
    /** IntervalValue Data */
    intervalValue.every = Number(this.repeatEvery);
    intervalValue.schedulePeriod = this.lower(this.custFreq).charAt(this.lower(this.custFreq).length-1) == 's' ? this.lower(this.custFreq) : this.lower(this.custFreq + 's');
    intervalValue.repeatOn = this.custFreq == "Weeks" || this.custFreq == "Week" || this.custFreq == "weeks"?  this.weeKDay : ''; 
    intervalValue.endsOn = endsOn || new EndsOn();
    /** IntervalValue Data */
    /**  EndsOn data */
    endsOn.endType = this.endsOnSelected;
    endsOn.endDate = this.dateFormatConverter(this.endDate);
    endsOn.occurrences = Number(this.occurence) > 0 ? Number(this.occurence) : null;
    /**  EndsOn data */
    /**Secheduled Data */
    this.scheduleData.emit(scheduledObject);
    this.cronExpress.emit(this.cronExpression)
  }
  proccedWithCrwal(){
    if(this.endsOnSelected == 'on' && this.endDate == ''){
      this.notificationService.notify('Please fill Date field', 'error');
    }else if(this.endsOnSelected == 'after' && this.occurence == ''){
      this.notificationService.notify('Please fill occurence field', 'error');
    }else{
      this.calculateCronExpression();
      this.closeCustomRecModal();
    }
  }
  cancelCustomRecModal(){
    this.repeatEvery = '1';
    this.custFreq = 'Week';
    this.weeKDay = this.day || 'SUN';
    this.endDate  = '';
    this.occurence = '';
    this.endsFreq('never');
    this.rstz = 'Does not repeat';
    this.closeCustomRecModal();
  }
  endsFreq(freq, type?){
    if(!type){
      this.endDate  = '';
      this.occurence = '';
    }

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
    }else if(freq == 'after'){
      this.endsNever = false;
      this.endsOn = false;
      this.endsAt = true;
      this.endsOnSelected = freq;
    }
    
  }
  //
   ordinal_nth(d) {
    if (d > 3 && d < 21) return d +'th';
    switch (d % 10) {
      case 1:  return d +"st";
      case 2:  return d +"nd";
      case 3:  return d +"rd";
      default: return d +"th";
    }
  }
  /** Custom- modal Function */
  custFrequency(freq){
    this.custFreq = freq;
    this.dateOrdinal = this.ordinal_nth(Number(this.date));
    if(Number(this.repeatEvery) == 1){
      if(freq.search("s") > -1){
      freq = freq.substring(0, freq.length - 1);
    }
      this.custFreq = freq;
    }else if(Number(this.repeatEvery) > 1){
      if(freq.charAt(freq.length-1) == 's'){
        this.custFreq = freq;
      }else{
        this.custFreq = freq + 's';
      }
    }
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