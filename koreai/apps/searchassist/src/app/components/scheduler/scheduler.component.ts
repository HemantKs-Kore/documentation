import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { scheduleOpts, InterVal, Time, IntervalValue, EndsOn } from 'src/app/helpers/models/Crwal-advance.model';
import { NotificationService } from '@kore.services/notification.service';
import {  PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
declare const $: any;

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
  
})
export class SchedulerComponent implements OnInit {
  schedualarDataModelPopRef:any;
  istStratDate: any;
  startDate: any;
  endDate: any;
  occurence = '';
  endsNever = true;
  endsOn = false;
  endsAt = false;
  dateOrdinal = '';
  custFreq = 'Week';
  weeKDay = 'SUN';
  stz = 'Time Zone';
  rstz = 'Does not repeat';
  meridiem = 'AM';
  cronExpression = "* * * * * ?"
  timeHH = '';
  timeMM: any = '';
  repeatEvery = '1';
  day = '';
  date = '';
  selectedDate:any = {
    value:'',
  };
  month = '';
  year = '';
  endsOnSelected = '';
  minDate;
  recurringFrequency:boolean = false;
  isCustom: boolean = false;
  timeZoneArray:Array<String>=['IST','EST','UTC'];
  recurringFrequencyArray:Array<Object>=[{key:'Does not repeat',value:'Does not repeat'},{key:'Daily',value:'Daily'},{key:'Weekly',value:'Weekly'},{key:'Monthly',value:'Monthly'},{key:'Annually',value:'Annually'},{key:'Every weekday(Monday to Friday)',value:'Every weekday'},{key:'Custom...',value:'Custom'}];
  repeatEveryArray:Array<String>=['Day','Week','Month','Year'];
  scheduledData:Object={};
  @Input() crwalObject: any;
  @Input() schedule: any;
  @Input() schedulerType: String='horizantalSchedular';
  @Output() scheduleData = new EventEmitter();
  @Output() cronExpress = new EventEmitter();
  @ViewChild('schedualarDataModelPop') schedualarDataModelPop: KRModalComponent;
  @ViewChild('perfectScroll') perfectScroll: PerfectScrollbarComponent;
  constructor(private notificationService: NotificationService) {
    var date = new Date;
    this.day = date.toString().split(" ")[0].toLocaleUpperCase();
    this.weeKDay = this.day || 'SUN';
    this.month = date.toString().split(" ")[1].toLocaleUpperCase();
    this.date = date.toString().split(" ")[2];
    this.year = date.toString().split(" ")[3];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    this.minDate = new Date(currentYear, currentMonth, currentDay);
  }

  ngOnInit(): void {
    this.endsFreq('never');
    if (this.crwalObject) {
      this.istStratDate = this.crwalObject?.date;
      this.startDate = this.crwalObject?.date;
      if (this.crwalObject?.time) {
        this.timeHH = this.crwalObject?.time?.hour;
        this.timeMM = this.crwalObject?.time?.minute;
        this.meridiem = this.crwalObject?.time?.timeOpt;
        this.stz = this.crwalObject?.time?.timezone || 'Time Zone';
      }
      this.rstz = this.crwalObject?.interval?.intervalType || 'Does not repeat';
      if (this.crwalObject?.interval?.intervalValue) {
        this.endsFreq(this.crwalObject?.interval?.intervalValue?.endsOn?.endType, 'set');
        this.repeatEvery = this.crwalObject?.interval?.intervalValue?.every ? this.crwalObject?.interval?.intervalValue?.every : this.repeatEvery;
        this.custFreq = this.crwalObject?.interval?.intervalValue?.schedulePeriod ? this.crwalObject?.interval?.intervalValue?.schedulePeriod : this.custFreq;
        this.weeKDay = this.crwalObject?.interval?.intervalValue?.repeatOn ? this.crwalObject?.interval?.intervalValue?.repeatOn : this.weeKDay;
        this.endDate = this.crwalObject?.interval?.intervalValue?.endsOn?.endDate ? this.crwalObject?.interval?.intervalValue?.endsOn?.endDate : this.endDate;
        this.occurence = this.crwalObject?.interval?.intervalValue?.endsOn?.occurrences ? this.crwalObject?.interval?.intervalValue?.endsOn?.occurrences : this.occurence;
      }
    }
  }
  ngOnChanges(changes) {
    if (!this.crwalObject?.date) {
      var emptyData = new scheduleOpts();
      this.scheduleData.emit(emptyData);
      this.istStratDate = '';
      this.startDate = '';
      this.timeHH = '';
      this.timeMM = '';
      this.meridiem = 'AM';
      this.stz = 'Time Zone';

      this.rstz = 'Does not repeat';
      this.repeatEvery = '1';
      this.custFreq = 'Week';
      this.weeKDay = this.day || 'SUN';
      this.endDate = '';
      this.occurence = '';
      this.endsFreq('never');
    }
  }
  modelChangeFn(event, time) {
    if (time != 'repeatEvery') {
      if (event > 12 && time == 'HH') {
        this.timeHH = '12';
        this.changeMeridiem('PM');
      } else if (event == 0 && time == 'HH') {
        this.timeHH = '0';
        this.changeMeridiem('AM');
      } else {
        this.calculateCronExpression()
      }
    } else {
      this.custFrequency(this.custFreq)
    }
  }

   verticalDatepicker(event){
    this.selectedDate.value = event; 
  }
  timeZone(stz) {
    this.stz = stz;
    this.calculateCronExpression()
  }
  repeatTimeZone(rstz) {
    this.rstz = rstz;
    this.calculateCronExpression()
    this.isCustom = false;
  }
  changeMeridiem(meridiem) {
      if (Number(this.timeHH) >= 12) {
        meridiem = 'PM';
      } else if (Number(this.timeHH) == 0) {
        meridiem = 'AM';
      }
      this.meridiem = meridiem;
      this.calculateCronExpression()
  }
  addEventCustom(type: string, event: MatDatepickerInputEvent<Date>, rstz: string) {
    this.endDate = event.value;
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>, rstz: string) {
    if (rstz == 'regular') {
      this.day = event.value.toString().split(" ")[0].toLocaleUpperCase();
      this.month = event.value.toString().split(" ")[1].toLocaleUpperCase();
      this.date = event.value.toString().split(" ")[2];
      this.dateOrdinal = this.ordinal_nth(Number(this.date));
      this.year = event.value.toString().split(" ")[3];
      this.istStratDate = event.value;
      this.startDate = event.value;
    }
    this.calculateCronExpression()
  }
  calculateCronExpression() {
    let timeHH = this.timeHH;
    // Check for AM -PM conversion 12-24;
    if (this.meridiem == 'PM' && timeHH != '' && (Number(timeHH) > 0) && Number(timeHH) <= 24) {
      timeHH = this.timeHH + 12;
      if (Number(timeHH) == 24) {
        timeHH = (Number(this.timeHH)).toLocaleString();
      }
    }
    else if (this.meridiem == 'AM' && Number(timeHH) == 12) {
      timeHH = '0'
    }
    if (this.meridiem == 'PM' && Number(timeHH) == 12) {
      timeHH = '12'
    }
    !this.timeMM ? this.timeMM = 0 : this.timeMM = this.timeMM;
    if (Number(this.timeMM) > 59 && this.timeMM.toString().length == 2) {
      this.timeMM = '59';
      $('#scheduleMn').val('59');
    } else if (Number(this.timeMM) > 59 && this.timeMM.toString().length > 2) {
      let mins = this.timeMM.toString();
      mins = mins.substring(0, 2);
      this.timeMM = mins;
      $('#scheduleMn').val(mins);
    } else if (Number(this.timeMM) < 0) {
      this.timeMM = '0';
      $('#scheduleMn').val('0');
    }
    timeHH == '' ? timeHH = '0' : timeHH = timeHH;
    if (this.rstz == 'Does not repeat') {
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' ' + this.date + ' ' + this.month + ' ? ' + this.year;
      //this.cronExpression = this.timeMM + ' '+ timeHH + ' ' + this.date + ' ' + this.month + ' ' + this.year;
      this.cronExpression = '';
    } else if (this.rstz == 'Daily') {
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' * ' + '*';
      this.cronExpression = this.timeMM + ' ' + timeHH + ' * ' + '* ' + '*';
    } else if (this.rstz == 'Weekly') {
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH +  ' ? ' + '* ' + this.day +' *';
      this.cronExpression = this.timeMM + ' ' + timeHH + ' * ' + '* ' + this.day;
    } else if (this.rstz == 'Monthly') {
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' '+  this.date + ' * ' + '?';
      this.cronExpression = this.timeMM + ' ' + timeHH + ' ' + this.date + ' ' + '*' + ' ' + '*';
    } else if (this.rstz == 'Annually') {
      //this.cronExpression = '0' + this.timeMM + ' '+ this.timeHH + ' '+  this.date + ' '+ this.month + '? ' + this.year + ' ' +'-2099';
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH  + ' ' +  this.date + ' '+ this.month + ' ? ' + '*';
      this.cronExpression = this.timeMM + ' ' + timeHH + ' ' + this.date + ' ' + this.month + ' ' + '*';
    } else if (this.rstz == 'Every weekday') {
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH +  ' ?' + ' * ' + 'MON-FRI ' + '*';
      this.cronExpression = this.timeMM + ' ' + timeHH + ' *' + ' * ' + ' MON,TUE,WED,THU,FRI';
    } else if (this.rstz == 'Custom') {
      this.customFrequency(timeHH);
    }
    // console.log(this.cronExpression);
    this.scheduleEmittFunc();
  }
  customFrequency(timeHH) {
    if (!this.repeatEvery) {
      this.repeatEvery = '1';
    }
    if (this.custFreq == 'Days' || this.custFreq == 'Day' || this.custFreq == 'days') {
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' */'+this.repeatEvery + ' *';
      this.cronExpression = this.timeMM + ' ' + timeHH + ' */' + this.repeatEvery + ' * ' + '*';
      this.cronExpression = this.repeatEvery + ' days';
    } else if (this.custFreq == 'Weeks' || this.custFreq == 'Week' || this.custFreq == 'weeks') {
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' ?' + ' * ' + this.dateConverter(this.weeKDay)+ '#' + this.repeatEvery; 
      this.cronExpression = this.repeatEvery + ' weeks';
    } else if (this.custFreq == 'Months' || this.custFreq == 'Month' || this.custFreq == 'months') {
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' ' + this.date + ' */'+this.repeatEvery + ' ?';
      //this.cronExpression = this.timeMM + ' '+ timeHH + ' ' + this.date + ' */'+this.repeatEvery + ' *';
      this.cronExpression = this.repeatEvery + ' months';
    } else if (this.custFreq == 'Years' || this.custFreq == 'Year' || this.custFreq == 'years') {
      //this.cronExpression = '0 ' + this.timeMM + ' '+ timeHH + ' ' + this.date + ' '+ this.month + ' ' + '?' + ' */'+this.repeatEvery;
      this.cronExpression = this.repeatEvery + ' years';
    }
  }
  dateConverter(weeKDay) {
    var day;
    switch (weeKDay) {
      case 'SUN':
        day = "1";
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
  dateFormatConverter(date) {
    if (date && typeof (date) == "object") {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let dayStr = String(day);
      let monthStr = String(month);
      if (day < 10) {
        dayStr = '0' + day;
      }
      if (month < 10) {
        monthStr = '0' + month;
      }
      return year + '-' + monthStr + '-' + dayStr;
    } else if (date && typeof (date) == "string") {
      return date;
    } else {
      return null;
    }
  }
  scheduleEmittFunc() {
    let scheduledObject: scheduleOpts = new scheduleOpts();
    let time: Time = new Time();
    let interVal: InterVal = new InterVal();
    let intervalValue: IntervalValue = new IntervalValue();
    let endsOn: EndsOn = new EndsOn();
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
    interVal.intervalType = this.rstz;
    interVal.intervalValue = intervalValue;
    /** interVal Data */
    /** IntervalValue Data */
    intervalValue.every = Number(this.repeatEvery);
    intervalValue.schedulePeriod = this.lower(this.custFreq).charAt(this.lower(this.custFreq).length - 1) == 's' ? this.lower(this.custFreq) : this.lower(this.custFreq + 's');
    intervalValue.repeatOn = this.custFreq == "Weeks" || this.custFreq == "Week" || this.custFreq == "weeks" ? this.weeKDay : '';
    intervalValue.endsOn = endsOn || new EndsOn();
    /** IntervalValue Data */
    /**  EndsOn data */
    endsOn.endType = this.endsOnSelected;
    endsOn.endDate = this.dateFormatConverter(this.endDate);
    endsOn.occurrences = Number(this.occurence) > 0 ? Number(this.occurence) : null;
    this.scheduledData = scheduledObject;
    // this.scheduleData.emit(scheduledObject);
    // this.cronExpress.emit(this.cronExpression)
  }
  proccedWithCrwal() {
    if (this.endsOnSelected == 'on' && this.endDate == '') {
      this.notificationService.notify('Please fill Date field', 'error');
    } else if (this.endsOnSelected == 'after' && this.occurence == '') {
      this.notificationService.notify('Please fill occurence field', 'error');
    } else {
      this.calculateCronExpression();
    }
  }
  cancelCustomRecModal() {
    this.repeatEvery = '1';
    this.custFreq = 'Week';
    this.weeKDay = this.day || 'SUN';
    this.endDate = '';
    this.occurence = '';
    this.endsFreq('never');
    this.rstz = 'Does not repeat';
  }
  endsFreq(freq, type?) {
    if (!type) {
      this.endDate = '';
      this.occurence = '';
    }

    if (freq == 'never') {
      this.endsNever = true;
      this.endsOn = false;
      this.endsAt = false;
      this.endsOnSelected = freq;

    } else if (freq == 'on') {
      this.endsNever = false;
      this.endsOn = true;
      this.endsAt = false;
      this.endsOnSelected = freq;
    } else if (freq == 'after') {
      this.endsNever = false;
      this.endsOn = false;
      this.endsAt = true;
      this.endsOnSelected = freq;
    }

  }
  //
  ordinal_nth(d) {
    if (d > 3 && d < 21) return d + 'th';
    switch (d % 10) {
      case 1: return d + "st";
      case 2: return d + "nd";
      case 3: return d + "rd";
      default: return d + "th";
    }
  }
  validateMin(timeMM) {
    if (timeMM !== null && timeMM == '00') {
      timeMM = 0;
    }

  }
  /** Custom- modal Function */
  custFrequency(freq) {
    this.custFreq = freq;
    this.dateOrdinal = this.ordinal_nth(Number(this.date));
    if (Number(this.repeatEvery) == 1) {
      if (freq.search("s") > -1) {
        freq = freq.substring(0, freq.length - 1);
      }
      this.custFreq = freq;
    } else if (Number(this.repeatEvery) > 1) {
      if (freq.charAt(freq.length - 1) == 's') {
        this.custFreq = freq;
      } else {
        this.custFreq = freq + 's';
      }
    }
    //this.calculateCronExpression();
  }
  custweeKday(wd) {
    this.weeKDay = wd;
    //this.calculateCronExpression();
  }
  openCustomRecModal(rstz) {
    this.rstz = rstz;
    this.isCustom = true
    this.perfectScroll.directiveRef.scrollToTop();
  }

  //open or close schedular popup
  openCloseSchedular(type){
    if(type==='open'){
      this.schedualarDataModelPopRef = this.schedualarDataModelPop.open();
    } else if(type==='close'){
      this.isCustom = false;
      if(this.schedualarDataModelPopRef?.close) this.schedualarDataModelPopRef.close();
    }
  }

  //save schedule data
  sendScheduleData(){
    this.scheduleData.emit(this.scheduledData);
    this.cronExpress.emit(this.cronExpression);
    this.scheduledData = {};
    this.openCloseSchedular('close');
  }

  //back to home page
  gotoPreviousPage(){
    this.isCustom = false;
  }
}

