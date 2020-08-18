import { Component, OnInit } from '@angular/core';
import { ServiceInvokerService } from "@kore.services/service-invoker.service";
import { workflowService } from '@kore.services/workflow.service'
import { SideBarService } from '@kore.services/header.service';
import { AuthService } from '@kore.services/auth.service';
import * as moment from 'moment-timezone';
import { MatDialog } from '@angular/material';
import { ChatHistoryComponent } from "../chat-history/chat-history.component";
import { CallLogsComponent } from "../call-logs/call-logs.component";
import * as d3 from 'd3';
declare const $: any;

interface ChartData {
  date: number,
  close: number
} 

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent {
  realTimeUsers: any;
  realTimeInProgress: any;
  realTimeAutomation: any;
  realTimeChannels: any;
  realTimeSessions: any;
  realTimeAgentSessions: any;
  realTimeChatAutomation: any;
  realTimeVoiceAutomation: any;
  realTimeDigitalFormInputs: any;
  startDate: any = moment().subtract({ days: 7 });
  endDate: any = moment();
  defaultSelectedDay = 7;
  showDateRange: boolean = false;
  toshowCallFlow: boolean;
  constructor(
    private service: ServiceInvokerService,
    public workflowService: workflowService,
    private headerService: SideBarService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
    this.setInterval()
  }

  realTime: any = moment().format('HH:mm:ss');;
  realTimeZone: any = moment.tz(moment.tz.guess()).format('z');
  realTimeDashboardInterval: any = [10000, 30000, 60000, 120000, 300000, 600000];
  maintainTimeInterval: any = parseInt(localStorage.getItem("dashboardRefreshInterval")) || 30000;
  dashboardRefreshIntervalTimer: any;
  toolTipForPhoneNumber: any = "deflection voice +<br>+ message played and +<br>+ SMS sent"
  showDetVal: boolean = true;
  summaryDetails: any = {};
  summaryDetailsHead = [{
    key: 'App Name',
    val: 'Sample App',
    id: 'appName',
    edit: false,
    saved: false
  }, {
    key: 'App Status',
    val: 'Active',
    id: 'active',
    edit: false,
    saved: false
  }, {
    key: 'Language',
    val: 'English',
    id: 'english',
    edit: false,
    saved: false
  }];

  // checkKey(e, details) {
  //   let code = e.keyCode || e.which;
  //   if(code == 13) {
  //     details.edit = false;
  //     details.saved = true;
  //     setTimeout(function(){
  //       details.saved = false;
  //     }, 2000);
  //   }
  // }

  ngOnInit() {
    let toogleObj = {
      "title": "Dashboard",
      "toShowWidgetNavigation": this.workflowService.showAppCreationHeader()
    }
    this.headerService.toggle(toogleObj);
    this.realTimeDashboardData();
    this.callFlowJourneyData();
    // this.getSummary();
    this.blLineChart();
  }

  setInterval() {
    this.dashboardRefreshIntervalTimer = setInterval(() => {
      this.realTimeDashboardData();
      this.realTime = moment().format('HH:mm:ss');
      this.realTimeZone = moment.tz(moment.tz.guess()).format('z');
    }, this.maintainTimeInterval);
  }

  ngOnDestroy() {
    clearInterval(this.dashboardRefreshIntervalTimer);
  }

  getSummary() {
    let _params = {
      "appId": this.workflowService.deflectApps()._id || this.workflowService.deflectApps()[0]._id
    }
    this.service.invoke('get.summary', _params).subscribe(
      res => {
        console.log(res);
        this.summaryDetailsHead[0].val = res.appName;
        this.summaryDetails.activeIntegration = res.activeIntegration;
        try {
          if (this.summaryDetails.activeIntegration == "sipDomainTransfer") {
            this.summaryDetails.sipDomain = res.ivrIntegrationInfo.sipConfigDetails.sipDomainName;
          }
          else if (this.summaryDetails.activeIntegration == "phoneNumberTransfer") {
            this.summaryDetails.phoneNumber = res.ivrIntegrationInfo.phoneNumberConfigDetails.phoneNumber;
          }
        }
        catch (e) {
          if (this.summaryDetails.activeIntegration == "sipDomainTransfer") {
            this.summaryDetails.sipDomain = "-NA-";
          }
          else if (this.summaryDetails.activeIntegration == "phoneNumberTransfer") {
            this.summaryDetails.phoneNumber = "-NA-";
          }
        }

      },
      err => {
        console.log(err);
      }
    )
  }



  blLineChart() {
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 160 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    var svg = d3.select("#bl-line-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    let dataArr = [{date: 0,close: 2}, {date: 2, close: 14}, {date: 4, close: 8}];
    var valueline = d3.line<ChartData>()
    .x(function(d:ChartData) { return x(d.date); })
    .y(function(d:ChartData) { return y(d.close); })
    .curve(d3.curveMonotoneX);

    var area = d3.area<ChartData>()
    .x(function(d:ChartData) { return x(d.date); })
    .y0(height)
    .y1(function(d:ChartData) { return y(d.close); }).curve(d3.curveMonotoneX);

    var lg = svg.append("defs").append("linearGradient")
    .attr("id", "mygrad")
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("y1", "0%")
    .attr("y2", "100%")
    ;
    lg.append("stop")
    .attr("offset", "0%")
    .style("stop-color", "#D1EDF0")
    .style("stop-opacity", 1)
    
    lg.append("stop")
    .attr("offset", "100%")
    .style("stop-color", "white")
    .style("stop-opacity", 1)

    function make_x_gridlines() {		
    return d3.axisBottom(x)
        .ticks(5)
    }

    function make_y_gridlines() {		
    return d3.axisLeft(y)
        .ticks(5)
    }

    x.domain([0, d3.max(dataArr, function(d) { return d.date; })]);
    y.domain([0, d3.max(dataArr, function(d) { return d.close; })]);

    svg.append("path")
      .data([dataArr])
      // .attr("class", "line")
      .attr("d",area).style("fill", "url(#mygrad)");

    svg.append("path")
      .data([dataArr])
      .attr("class", "line")
      .attr("d",valueline)

    // add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // add the Y Axis
    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("g")			
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
          .tickSize(-height)
          // .tickFormat("")
      )

    // add the Y gridlines
    svg.append("g")			
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          // .tickFormat("")
      )

  }

  realTimeDashboardData() {
    let _params = {
      "userId": this.authService.getUserId(),
      "orgId": this.authService.getOrgId(),
      "streamId": this.workflowService.deflectApps()._id || this.workflowService.deflectApps()[0]._id
    }
    this.service.invoke('real.time.dashboardData', _params).subscribe(
      res => {
        this.realTimeUsers = res.nUsers;
        this.realTimeChannels = res.aChannels;
        this.realTimeSessions = res.nSessions;
        this.realTimeAgentSessions = res.nAgentSessions;
        this.realTimeInProgress = res.inProgress;
        this.realTimeAutomation = res.automationCount;
        this.realTimeChatAutomation = res.chatAutomationCount;
        this.realTimeVoiceAutomation = res.voiceAutomationCount;
        this.realTimeDigitalFormInputs = res.digitalFormInputCount;
      },
      err => {
        console.log(err);
      }
    )
  }

  refreshRealTimeData = function () {
    this.realTimeDashboardData();
    this.realTime = moment().format('HH:mm:ss');
    this.realTimeZone = moment.tz(moment.tz.guess()).format('z');
  };

  coversionOfTime = function (time) {
    var timeInterval;
    if (time === 10000) {
      timeInterval = "10 Seconds";
    } else if (time === 30000) {
      timeInterval = "30 Seconds";
    } else if (time === 60000) {
      timeInterval = "1 Minute";
    } else if (time === 120000) {
      timeInterval = "2 Minutes";
    } else if (time === 300000) {
      timeInterval = "5 Minutes";
    } else if (time === 600000) {
      timeInterval = "10 Minutes";
    }
    return timeInterval;
  };

  updateTimeInterval(time, e) {
    this.maintainTimeInterval = time;
    clearInterval(this.dashboardRefreshIntervalTimer);
    this.setInterval();
    localStorage.setItem('dashboardRefreshInterval', this.maintainTimeInterval);
  };

  getDateRange(range) {
    this.defaultSelectedDay = range;
    if (range === -1) {
      this.showDateRange = true;
    } else if (range === 7) {
      this.startDate = moment().subtract({ days: 6 });
      this.endDate = moment();
      this.callFlowJourneyData();
      this.showDateRange = false;
    } else if (range === 1) {
      this.startDate = moment().subtract({ hours: 23 });
      this.endDate = moment();
      this.callFlowJourneyData();
      this.showDateRange = false;
    }
  }

  receiveMessage($event) {
    var rangeSelect = $event;
    this.showDateRange = false;
    if (rangeSelect !== "close") {
      var fromD = new Date(rangeSelect.d1.year, rangeSelect.d1.month - 1, rangeSelect.d1.day, 0, 0, 0);
      var toD = new Date(rangeSelect.d2.year, rangeSelect.d2.month - 1, rangeSelect.d2.day, 0, 0, 0);
      this.startDate = moment(fromD);
      this.endDate = moment(toD).endOf('day');
      this.callFlowJourneyData();
    }
  }

  openCallLogs(clickEv) {
    if ($('#Group-17-Copy').length) {
      $('#Group-17-Copy').tooltip('hide');
    }
    let obj = {
      "startDate": this.startDate.toISOString(),
      "endDate": this.endDate.toISOString(),
      "nodeId": clickEv
    }
    const dialogRef = this.dialog.open(CallLogsComponent, {
      width: '60%',
      height: "100%",
      panelClass: "modal-new-call-logs",
      disableClose: true,
      data: obj
    });
  }


  callFlowJourneyData() {
    this.toshowCallFlow = false;
    let _params = {
      "startDate": this.startDate.toISOString(),
      "endDate": this.endDate.toISOString(),
      "appId": this.workflowService.deflectApps()._id || this.workflowService.deflectApps()[0]._id
    }
    this.service.invoke('get.journey.flow', _params).subscribe(
      res => {
        setTimeout(() => {
          this.toshowCallFlow = true;
        }, 350);
        setTimeout(() => {
          let sum = res.phoneNumber.displayFields['Total Deflected Calls'] + res.phoneNumber.displayFields['SMS Messages Delivered'] + res.phoneNumber.displayFields['Calls Dropped off'];
          let totDefPer = parseFloat(((res.phoneNumber.displayFields['Total Deflected Calls']/sum)*100).toFixed(1));
          let totSms = parseFloat(((res.phoneNumber.displayFields['SMS Messages Delivered']/sum)*100).toFixed(1));
          let totCalls = parseFloat(((res.phoneNumber.displayFields['Calls Dropped off']/sum)*100).toFixed(1));
          if(sum == 0) {
            totDefPer = 0;
            totSms = 0;
            totCalls = 0;
          }

          $('[data-toggle="tooltip"]').tooltip();
          // Start of deflect
          $("#Group-13-Copy-17 tspan").text(res.deflect.percents["incoming"] + "%");

          if (res.deflect.percents["dropOff"] === 0) {
            $("#Group-13-Copy-26").hide();
          } else {
            $("#Group-13-Copy-26 tspan").text(res.deflect.percents["dropOff"] + "%");
          }

          $('#Rectangle-3-Copy-6').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.deflect.displayFields['Total Incoming Calls'] + ' </span>Total Incoming Calls</div><div class="child"><span>' + res.deflect.displayFields['Calls Dropped off'] + ' </span>Calls Dropped off</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          $('#Powered-by-Copy').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.deflect.displayFields['Total Incoming Calls'] + ' </span>Total Incoming Calls</div><div class="child"><span>' + res.deflect.displayFields['Calls Dropped off'] + ' </span>Calls Dropped off</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          // End of delflect

          // Start of Voice Automation
          $("#Group-13 tspan").text(res.deflect.percents["voiceAutomation"] + "%");
          $('#Rectangle-3-Copy-20').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.voiceAutomation.displayFields['Total Answered Calls'] + ' </span>Total Answered Calls</div><div class="child"><span>' + res.voiceAutomation.displayFields['Fulfilled via Voice Automation'] + ' </span>Fulfilled via Voice Automation</div><div class="child"><span>' + res.voiceAutomation.displayFields['Deflected'] + ' </span>Deflected</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          $('#Voice-Automation').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.voiceAutomation.displayFields['Total Answered Calls'] + ' </span>Total Answered Calls</div><div class="child"><span>' + res.voiceAutomation.displayFields['Fulfilled via Voice Automation'] + ' </span>Fulfilled via Voice Automation</div><div class="child"><span>' + res.voiceAutomation.displayFields['Deflected'] + ' </span>Deflected</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          // End of Voice Automation

          // Start of phone Number
          if (res.phoneNumber.percents["dropOff"] === 0) {
            $("#Group-25-Copy").hide();
          } else {
            $("#Group-25-Copy tspan").text(totCalls + "%");
          }


          //commented oval-copy-15-copy-x to avoid double tooltips

          // $('#Oval-Copy-15-Copy-x').tooltip({
          //   title: '<div class="headerBG">Deflection voice message played and SMS sent</div><div class="parent-div"><div class="child">Total Deflected Calls<span class="countSpan"><span class="count">' + res.phoneNumber.displayFields['Total Deflected Calls'] +' </span><span class="percentage">90%</span></span></div><div class="child">SMS Delivered<span class="countSpan"><span class="count">' + res.phoneNumber.displayFields['SMS Messages Delivered'] + ' </span><span class="percentage sms">90%</span></span></div><div class="child dropOff">Drop-offs <span class="countSpan"><span class="count">'+ res.phoneNumber.displayFields['Calls Dropped off'] + ' </span><span class="percentage">90%</span></span></div></div>',
          //   html: true,
          //   placement: 'top',
          //   container: 'body'
          // });

          // End of phone Number

          // Start of SMS
          $("#Group-13-Copy-24 tspan").text(res.phoneNumber.percents["smsNode"] + "%");

          if (res.sms.percents["dropOff"] === 0) {
            $("#Group-26-Copy").hide();
          } else {
            $("#Group-13-Copy-5 tspan").text(res.sms.percents["dropOff"] + "%");
          }

          $('#Rectangle-3-Copy-29').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.sms.displayFields['Total SMS Messages Delivered'] + ' </span>Total SMS Messages Delivered</div><div class="child"><span>' + res.sms.displayFields['Total Chats Initaited'] + ' </span>Total Chats Initiated</div><div class="child"><span>' + res.sms.displayFields['Chats Not Initiated'] + ' </span>Chats Not Initiated</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          $('#SMS').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.sms.displayFields['Total SMS Messages Delivered'] + ' </span>Total SMS Messages Delivered</div><div class="child"><span>' + res.sms.displayFields['Total Chats Initaited'] + ' </span>Total Chats Initiated</div><div class="child"><span>' + res.sms.displayFields['Chats Not Initiated'] + ' </span>Chats Not Initiated</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          $('#Chat-Copy').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.sms.displayFields['Total SMS Messages Delivered'] + ' </span>Total SMS Messages Delivered</div><div class="child"><span>' + res.sms.displayFields['Total Chats Initaited'] + ' </span>Total Chats Initiated</div><div class="child"><span>' + res.sms.displayFields['Chats Not Initiated'] + ' </span>Chats Not Initiated</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          // End of SMS

          // Start of welcome message
          $("#Group-13-Copy-3 tspan").text(res.sms.percents["welcomeMessageRTM"] + "%");

          if (res.welcomeMessageRTM.percents["dropOff"] === 0) {
            $("#Group-26").hide();
          } else {
            $("#Group-13-Copy-27 tspan").text(res.welcomeMessageRTM.percents["dropOff"] + "%");
          }

          $('#Rectangle-3-Copy-24').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.welcomeMessageRTM.displayFields['Total Chats Initaited'] + ' </span>Total Chats Initiated</div><div class="child"><span>' + res.welcomeMessageRTM.displayFields['Continued with Chat Automation'] + ' </span>Continued with Chat Automation</div><div class="child"><span>' + res.welcomeMessageRTM.displayFields['Continued with Digital Forms'] + ' </span>Continued with Digital Forms</div><div class="child"><span>' + res.welcomeMessageRTM.displayFields['Forwarded to Live Agent'] + ' </span>Forwarded to Live Agent</div><div class="child"><span>' + res.welcomeMessageRTM.displayFields['No User Input'] + ' </span>No User Input</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          $('#Bitmap').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.welcomeMessageRTM.displayFields['Total Chats Initaited'] + ' </span>Total Chats Initiated</div><div class="child"><span>' + res.welcomeMessageRTM.displayFields['Continued with Chat Automation'] + ' </span>Continued with Chat Automation</div><div class="child"><span>' + res.welcomeMessageRTM.displayFields['Continued with Digital Forms'] + ' </span>Continued with Digital Forms</div><div class="child"><span>' + res.welcomeMessageRTM.displayFields['Forwarded to Live Agent'] + ' </span>Forwarded to Live Agent</div><div class="child"><span>' + res.welcomeMessageRTM.displayFields['No User Input'] + ' </span>No User Input</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          // End of welcome message

          // Start of live Agent Path
          $("#Group-13-Copy-6 tspan").text(res.welcomeMessageRTM.percents["liveAgentPath"] + "%");
          $('#Rectangle-3-Copy-26').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.liveAgentPath.liveAgent.displayFields['Users Forwarded to Live Agent'] + ' </span>Users Forwarded to Live Agent</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          $('#Live-Agent').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.liveAgentPath.liveAgent.displayFields['Users Forwarded to Live Agent'] + ' </span>Users Forwarded to Live Agent</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          $('#Group-4').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.liveAgentPath.liveAgent.displayFields['Users Forwarded to Live Agent'] + ' </span>Users Forwarded to Live Agent</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          // End of live Agent Path

          // Start of chat Automation Path
          $("#Group-13-Copy-7 tspan").text(res.welcomeMessageRTM.percents["chatAutomationPath"] + "%");
          $("#Group-13-Copy-21 tspan").text(res.chatAutomationPath.chatAutomation.percents["digitalForm"] + "%");
          $("#Group-13-Copy-13 tspan").text(res.chatAutomationPath.chatAutomation.percents["liveAgent"] + "%");

          if (res.chatAutomationPath.digitalForm.percents["dropOff"] === 0) {
            $("#Group-13-Copy-18").hide();
            $('#Path-6-Copy-10').hide()
          } else {
            $("#Group-13-Copy-18 tspan").text(res.chatAutomationPath.digitalForm.percents["dropOff"] + "%");
          }

          $("#Group-13-Copy-2 tspan").text(res.chatAutomationPath.digitalForm.percents["handOff"] + "%");
          $('#Rectangle-3-Copy-25').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.chatAutomationPath.chatAutomation.displayFields['Forwarded for Chat Automation'] + ' </span>Forwarded for Chat Automation</div><div class="child"><span>' + res.chatAutomationPath.chatAutomation.displayFields['Forwarded to Digital Forms'] + ' </span>Forwarded to Digital Forms</div><div class="child"><span>' + res.chatAutomationPath.chatAutomation.displayFields['Forwarded to Live Agent'] + ' </span>Forwarded to Live Agent</div><div class="child"><span>' + res.chatAutomationPath.chatAutomation.displayFields['Fullfilled via Chat Automation'] + ' </span>Fulfilled via Chat Automation</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          $('#Virtual-Agent').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.chatAutomationPath.chatAutomation.displayFields['Forwarded for Chat Automation'] + ' </span>Forwarded for Chat Automation</div><div class="child"><span>' + res.chatAutomationPath.chatAutomation.displayFields['Forwarded to Digital Forms'] + ' </span>Forwarded to Digital Forms</div><div class="child"><span>' + res.chatAutomationPath.chatAutomation.displayFields['Forwarded to Live Agent'] + ' </span>Forwarded to Live Agent</div><div class="child"><span>' + res.chatAutomationPath.chatAutomation.displayFields['Fullfilled via Chat Automation'] + ' </span>Fulfilled via Chat Automation</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          $('#Rectangle-3-Copy-28').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.chatAutomationPath.digitalForm.displayFields['Users Forwarded to Digital Forms'] + ' </span>Users Forwarded to Digital Forms</div><div class="child"><span>' + res.chatAutomationPath.digitalForm.displayFields['Form Input Collected'] + ' </span>Form Input Collected</div><div class="child"><span>' + res.chatAutomationPath.digitalForm.displayFields['Forms Not Submitted'] + ' </span>Forms Not Submitted</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          $('#Digital-Form').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.chatAutomationPath.digitalForm.displayFields['Users Forwarded to Digital Forms'] + ' </span>Users Forwarded to Digital Forms</div><div class="child"><span>' + res.chatAutomationPath.digitalForm.displayFields['Form Input Collected'] + ' </span>Form Input Collected</div><div class="child"><span>' + res.chatAutomationPath.digitalForm.displayFields['Forms Not Submitted'] + ' </span>Forms Not Submitted</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          $('#Rectangle-3-Copy-21').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.chatAutomationPath.handOff.displayFields['Hand Off'] + ' </span>Handoff</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          $('#Handoff').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.chatAutomationPath.handOff.displayFields['Hand Off'] + ' </span>Handoff</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          // End of chat Automation Path

          // Start of digital From Path
          $("#Group-13-Copy-8 tspan").text(res.welcomeMessageRTM.percents["digitalFormPath"] + "%");

          if (res.digitalFromPath.digitalForm.percents["dropOff"] === 0) {
            $("#Group-13-Copy-9").hide();
            $('#Path-6-Copy-3').hide()
          } else {
            $("#Group-13-Copy-9 tspan").text(res.digitalFromPath.digitalForm.percents["dropOff"] + "%");
          }

          $("#Group-13-Copy-28 tspan").text(res.digitalFromPath.digitalForm.percents["handOff"] + "%");

          $('#Rectangle-3-Copy-27').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.digitalFromPath.digitalForm.displayFields['Forwarded to Digital Forms'] + ' </span>Forwarded to Digital Forms</div><div class="child"><span>' + res.digitalFromPath.digitalForm.displayFields['Form Input Collected'] + ' </span>Form Input Collected</div><div class="child"><span>' + res.digitalFromPath.digitalForm.displayFields['Forms Not Submitted'] + ' </span>Forms Not Submitted</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          $('#Digital-Form-x').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.digitalFromPath.digitalForm.displayFields['Forwarded to Digital Forms'] + ' </span>Forwarded to Digital Forms</div><div class="child"><span>' + res.digitalFromPath.digitalForm.displayFields['Form Input Collected'] + ' </span>Form Input Collected</div><div class="child"><span>' + res.digitalFromPath.digitalForm.displayFields['Forms Not Submitted'] + ' </span>Forms Not Submitted</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          $('#Rectangle-3-Copy-30').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.digitalFromPath.handOff.displayFields['Hand Off'] + ' </span>Handoff</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          $('#Handoff-x').tooltip({
            title: '<div class="parent-div"><div class="child"><span>' + res.digitalFromPath.handOff.displayFields['Hand Off'] + ' </span>Handoff</div></div>',
            html: true,
            placement: 'top',
            container: 'body'
          });
          $('#Group-17-Copy').tooltip({
            title: '<div class="headerBG">Deflection voice message played and SMS sent</div><div class="parent-div"><div class="child pointer">Total Deflected Calls<span class="countSpan"><span class="count">' + res.phoneNumber.displayFields['Total Deflected Calls'] + ' </span><span class="percentage">'+ totDefPer +'%</span></span></div><div class="child pointer">SMS Delivered<span class="countSpan"><span class="count">' + res.phoneNumber.displayFields['SMS Messages Delivered'] + ' </span><span class="percentage sms">'+ totSms +'%</span></span></div><div class="child pointer dropOff">Drop-offs <span class="countSpan"><span class="count">' + res.phoneNumber.displayFields['Calls Dropped off'] + ' </span><span class="percentage">'+ totCalls +'%</span></span></div></div>',
            html: true,
            placement: 'top',
            container: 'body',
            delay: { hide: 2000 }
          });

          $('#Voice-Automation, #SMS, #Chat-Copy, #Rectangle-3-Copy-24, #Bitmap, #Rectangle-3-Copy-26, #Live-Agent, #Group-4, #Rectangle-3-Copy-25, #Virtual-Agent, #Rectangle-3-Copy-28, #Digital-Form, #Rectangle-3-Copy-21, #Handoff, #Rectangle-3-Copy-27, #Digital-Form-x, #Rectangle-3-Copy-30, #Handoff-x').on('shown.bs.tooltip', () => {
            if ($('#Group-17-Copy').length) {
              $('#Group-17-Copy').tooltip('hide');
            }
          });

          $('#Group-17-Copy').on('shown.bs.tooltip', () => {
            $('.tooltip-inner .parent-div .child').off('click');
            $('.tooltip-inner .parent-div .child').click((event) => {
              let clickEv = '';
              if (event.target.innerText.toLowerCase().indexOf('sms') == 0) {
                clickEv = 'smsNodeEnd';
              }
              else if (event.target.innerText.toLowerCase().indexOf('total') == 0) {
                clickEv = 'phoneNumberStart';
              }
              else if (event.target.innerText.toLowerCase().indexOf('drop') == 0) {
                clickEv = 'phoneNumberDropOff';
              }
              this.openCallLogs(clickEv);
            });
          });
          // $('#path-3').tooltip({
          //   title: '<div class="parent-div"><div class="child"><span>' + res.digitalFromPath.handOff.displayFields['Hand Off'] +' </span>Handoff</div></div>',
          //   html: true,
          //   placement: 'top',
          //   container: 'body'
          // });
          // End of digital From Path
        }, 350);
      },
      err => {
        this.toshowCallFlow = true;
        console.log(err);
      }
    )
  }

  callFlowExpand(e) {
    let callFlowExpandObj = {
      "title": "Call Flow",
    }
    $(".dashboardContainer").addClass("callFlowExpand");
    this.headerService.fromDashboard(callFlowExpandObj);
  }
}
