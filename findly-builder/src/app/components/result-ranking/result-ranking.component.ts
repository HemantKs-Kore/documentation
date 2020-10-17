import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-result-ranking',
  templateUrl: './result-ranking.component.html',
  styleUrls: ['./result-ranking.component.scss']
})
export class ResultRankingComponent implements OnInit {
  actionLogData : any = [];
  iconIndex;
  actionIndex;
  icontoggle : boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.actionLogData = [{
      "header" : "Can I make credit card payament via savings account", // and get notifiaction once done?
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "New",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },{
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "help",
      "status": "Boosted",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },
    {
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "bot",
      "status": "Hidden",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },
    {
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },
    {
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },{
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },
    {
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },{
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },
    {
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },{
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    },{
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago",
      "selected" : false,
      "drop":false
    }
  ]
  }
  toggle(icontoggle,index,selected){
    let previousIndex = this.iconIndex
    //previousIndex == index ? this.icontoggle = !icontoggle : this.icontoggle = icontoggle;
    this.icontoggle = !icontoggle; 
    this.iconIndex  = index;
    this.actionLogData[index].selected = !selected;
  }
  toggleAction(actiontoggle,index,selected){
   //this.actionToggle = !actiontoggle;
    this.actionIndex = index;
    this.actionLogData[index].drop = !selected;
  }
}
