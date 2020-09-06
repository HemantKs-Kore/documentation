import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-results-rules',
  templateUrl: './results-rules.component.html',
  styleUrls: ['./results-rules.component.scss']
})
export class ResultsRulesComponent implements OnInit {
  validationRules:any={
    condition:'OR',
    rules:[]
  }
  validationOperators:any ={
    operatorsObj:{
       equalTo: {operator:'==',type:'equalTo',valueTypes:['value','field','currentDate'],inputType:'text'},
       notEqualTo: {operator:'!=',type:'notEqualTo',valueTypes:['value','field','currentDate'],inputType:'text'},
       contains: {operator:'contains',type:'contains',valueTypes:['value','field','valueType'],inputType:'text'},
       doesNotContain: {operator:'doesNotContains',type:'doesNotContain',valueTypes:['value','field','valueType'],inputType:'text'},
       greaterThan: {operator:'>',type:'greaterThan',valueTypes:['value','field','currentDate'],inputType:'number'},
       lessThan: {operator:'<',type:'lessThan',valueTypes:['value','field','currentDate'],inputType:'number'},
       greaterThanOrEqualTo: {operator:'>=',type:'greaterThanOrEqualTo',valueTypes:['value','field','currentDate']
                               ,inputType:'number'},
       lessThanOrEqualTo: {operator:'<=',type:'lessThanOrEqualTo',valueTypes:['value','field','currentDate']
                               ,inputType:'number'},
       // regex: {operator:'regex',type:'regex',valueTypes:['value'],inputType:'text'},
       // noOfDecimals: {operator:'noOfDecimals',type:'noOfDecimals',valueTypes:['value'],inputType:'text'},
       partOf: {operator:'partOf',type:'partOf',valueTypes:['value','field'],inputType:'text'},
       notPartof: {operator:'notPartof',type:'notPartof',valueTypes:['value','field'],inputType:'text'},
       minLength: {operator:'minLength',type:'minLength',valueTypes:['value'],inputType:'number'},
       maxLength: {operator:'maxLength',type:'maxLength',valueTypes:['value'],inputType:'number'},
       futureDates: {operator:'futureDates',type:'futureDates',valueTypes:['value'],inputType:'text'},
       pastDates: {operator:'pastDates',type:'pastDates',valueTypes:['value'],inputType:'text'},
      },
   valueTypes:[
       {operator:'onlyNumbers',type:'onlyNumbers',valueTypes:[],inputType:'number'},
       {operator:'onlyAlphaNumeric',type:'onlyAlphaNumeric',valueTypes:[],inputType:'text'},
       {operator:'onlyAlphabet',type:'onlyAlphabet',valueTypes:[],inputType:'text'},
   ],
   ruleObj:{
       operator:'',
       valueType:'',
       value:'',
     },
   ruleConditionOr:{
       condition:'OR',
       rules:[]
     },
   ruleConditionAnd:{
       condition:'AND',
       rules:[]
   }
}
  constructor() { }
 
  ngOnInit(): void {
    this.addNewSimpleRuleSet();
  }
  addSimpleRule(ruleSet,type){
    const rule = JSON.parse(JSON.stringify(this.validationOperators.ruleObj));
    ruleSet.rules.push(rule);
  }
  removeSimpleRule(ruleSet,index,type){
  if(index>-1 && ruleSet && ruleSet.rules && ruleSet.rules.length){
    ruleSet.rules.splice(index,1);
  }
  }
  addRuleToRuleSet(ruleSet){
    const rule = JSON.parse(JSON.stringify(this.validationOperators.ruleObj));
    ruleSet.rules.push(rule);
  }
  addRuleSetToRuleSet(ruleSet){
    const tempRuleSet = JSON.parse(JSON.stringify(this.validationOperators.ruleConditionAnd));
    const rule = JSON.parse(JSON.stringify(this.validationOperators.ruleObj));
    tempRuleSet.rules.push(rule);
    ruleSet.rules.push(tempRuleSet);
  }
  addNewSimpleRuleSet(){
    const tempObj = JSON.parse(JSON.stringify(this.validationOperators.ruleConditionOr));
    const tempRuleSet = JSON.parse(JSON.stringify(this.validationOperators.ruleConditionAnd))
    const rule = JSON.parse(JSON.stringify(this.validationOperators.ruleObj));
    tempRuleSet.rules.push(rule);
    if(!(this.validationRules.rules && this.validationRules.rules.length)){
      tempObj.rules.push(tempRuleSet);
      this.validationRules = tempObj
     } else if(this.validationRules.rules && this.validationRules.condition){
      this.validationRules.rules.push(tempRuleSet);
     }
  }

}
