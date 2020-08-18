import { Component, OnInit, Inject } from '@angular/core';
import {MatSnackBar, MatSnackBarVerticalPosition} from '@angular/material/';
//import { DataService } from "@kore.services/data.service";
import { Router }  from '@angular/router';
//import {trigger,state,style,animate,transition } from '@angular/animations';

import {ServiceInvokerService} from "@kore.services/service-invoker.service";
import { HttpClient } from '@angular/common/http';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  currentUtterances: [];
}
export interface ConversationData {
  utterConversation: [];
}

@Component({
  selector: 'app-intent-preview',
  templateUrl: './intent-preview.component.html',
  styleUrls: ['./intent-preview.component.scss']
})
export class IntentPreviewComponent implements OnInit {

  constructor(
    private service: ServiceInvokerService,
    private http:HttpClient,
    private router: Router,
    public dialog: MatDialog
  ) { }
  
  noQuery = false;
  previewLoad = true;
  searchIntent = "";
  queryavailable = true;
  searchText = "";
  totalConversation = null;
  totalIntents = null;
  converseNoIntent = null;
  topIntentCount = [];
  bottomIntentCount= [];
  topIntentUtterance = [];
  bottomIntentUtterance = [];
  allIntentsCount = [];
  currLimit = 10;
  currClient = "verizon";
  selectedIntentName = "";
  selectedbtIntentName = "";
  selectedAllIntentName = "";
  selectedUtterance = "";
  currentUtterances = [];
  currentbtUtterances = [];
  currentbAllUtterances = [];
  utteranceConverse = [];
  helpMenuOpen: string;
  animal: string;
  name: string;
  waitToLoad = false;
  waitTopInt = false;
  waitConverse = false;
  waitInt = false;
  waitAllIntUtter = false;
  waitnoIntent = false;
  waitbottomInt = false;
  waitTopUtter = false;
  waitBottomUtter = false;
  waittopIntUtter = false;
  waitBottomIntUtter = false;
  waitallIntUtter = false;
  allScore = 0.5;

  openDialog1(): void {
    const dialogRef = this.dialog.open(UtteranceOverviewDialog, {
      width: '1100px',
      data: {currentUtterances: this.currentUtterances}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openDialog2(): void {
    const dialogRef = this.dialog.open(UtteranceOverviewDialog, {
      width: '1100px',
      data: {currentUtterances: this.currentbtUtterances}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDialog3(): void {
    const dialogRef = this.dialog.open(UtteranceOverviewDialog, {
      width: '1100px',
      data: {currentUtterances: this.currentbAllUtterances}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  refreshWithScore(): void {
    this.waitConverse = false;
    this.waitInt = false;
    this.waitnoIntent = false;
    this.waitTopInt = false;
    this.waitbottomInt = false;
    this.waittopIntUtter = false;
    this.waitBottomIntUtter = false;
    this.waitallIntUtter = false;
    this.ngOnInit();
  }

  openConverseDialog1(utterancesConvo): void {
    const dialogRef = this.dialog.open(conversationOverviewDialog, {
      width: '1100px',
      data: {utterConversation: utterancesConvo}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  viewTopUtterances(intentName:string): void {
    this.selectedIntentName = intentName;
    this.service.invoke('stats.utterOfIntent', {}, {intent: this.selectedIntentName,client: this.currClient,score: +this.allScore}).subscribe(
      res => {
          this.waitTopUtter = true;
          this.currentUtterances = res.data;
      },
      errRes => {
      }
    );

}
viewBottomUtterances(intentName:string): void {
  this.selectedbtIntentName = intentName;
  this.service.invoke('stats.utterOfIntent', {}, {intent: this.selectedbtIntentName,client: this.currClient,score: +this.allScore}).subscribe(
    res => {
        this.waitBottomUtter = true;
        this.currentbtUtterances = res.data;
    },
    errRes => {
    }
  );

}
viewAllIntUtterances(intentName:string): void {
  this.selectedAllIntentName = intentName;
  this.service.invoke('stats.utterOfIntent', {}, {intent: this.selectedAllIntentName,client: this.currClient,score: +this.allScore}).subscribe(
    res => {
        this.waitAllIntUtter = true;
        this.currentbAllUtterances = res.data;
    },
    errRes => {
    }
  );

}

viewUtteranceConvers(UtteranceId:string): void {
  this.selectedUtterance = UtteranceId;
  this.service.invoke('stats.utterance.conversation', {}, {id: this.selectedUtterance,client: this.currClient}).subscribe(
    res => {
        this.waitToLoad = true;
        this.utteranceConverse = res.data;
        this.openConverseDialog1(this.utteranceConverse);
    },
    errRes => {
    }
  );
}

  ngOnInit() {

    this.queryavailable = true;
    this.previewLoad = false;
    //this.helpMenuOpen = 'out';

    //To get count of conversations in the corpus
    this.getAllCounts();

    setTimeout(() => {
        this.getTopBottomInt();
    }, 5000);

    setTimeout(() => {
        this.getTopBottomIntUtter();
    }, 10000);

  }
  public getAllCounts(): void {
    this.service.invoke('stats.totalConvers', {}, {client: this.currClient, score: +this.allScore}).subscribe(
      res => {
          this.waitConverse = true;
          this.totalConversation = res.count;                    
      },
      errRes => {
      }
    );

    this.service.invoke('stats.totalIntents', {}, {client: this.currClient, score: +this.allScore}).subscribe(
      res => {
          this.waitInt = true;
          this.totalIntents = res.count;
                    
      },
      errRes => {
      }
    );
    this.service.invoke('stats.converseNoIntents', {}, {client: this.currClient, score: +this.allScore}).subscribe(
      res => {
          this.waitnoIntent = true;
          this.converseNoIntent = res.count;
                    
      },
      errRes => {
      }
    );

  }
  public getTopBottomInt() : void {
    this.service.invoke('stats.topIntentsCount', {}, {limit: this.currLimit,client: this.currClient, score: +this.allScore }).subscribe(
      res => {
          this.waitTopInt = true;
          this.topIntentCount = res.data;
      },
      errRes => {
      }
    );
    this.service.invoke('stats.bottomIntentsCount', {}, {limit: this.currLimit,client: this.currClient, score: +this.allScore}).subscribe(
      res => {
          this.waitbottomInt =true;
          this.bottomIntentCount = res.data;
      },
      errRes => {
      }
    );  

  }

  public getTopBottomIntUtter() : void {
    this.service.invoke('stats.topIntentsCount', {}, {limit: this.currLimit,client: this.currClient, score: +this.allScore}).subscribe(
      res => {
          this.waittopIntUtter = true;
          this.topIntentUtterance = res.data;
      },
      errRes => {
      }
    );
    this.service.invoke('stats.bottomIntentsCount', {}, {limit: this.currLimit,client: this.currClient, score: +this.allScore}).subscribe(
      res => {
          this.waitBottomIntUtter = true;
          this.bottomIntentUtterance = res.data;
      },
      errRes => {
      }
    );
    this.service.invoke('stats.allIntentsCount', {}, {client: this.currClient, score: +this.allScore}).subscribe(
      res => {
          this.waitallIntUtter = true;
          this.allIntentsCount = res.data;
                    
      },
      errRes => {
      }
    );
  }

}
@Component({
  selector: 'utterance-overview-dialog',
  templateUrl: 'utterance-overview-dialog.html',
  styleUrls: ['utterances-overview-dialog.scss']
})
export class UtteranceOverviewDialog {

  constructor(
    public dialogRef: MatDialogRef<UtteranceOverviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'conversation-overview-dialog',
  templateUrl: 'conversation-overview-dialog.html',
  styleUrls: ['conversation-overview-dialog.scss']
})
export class conversationOverviewDialog {

  constructor(
    public dialogRef: MatDialogRef<conversationOverviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ConversationData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}