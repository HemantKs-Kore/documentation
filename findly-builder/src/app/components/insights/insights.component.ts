import { Component, OnInit, Input } from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnInit {
  @Input() data : any;
  slider : any;
  actionLogData : any;
  constructor() { }

  ngOnInit(): void {
    $("#advanceContainer").delay(800).fadeIn();
    $('#advanceContainer').animate($('.dis').addClass('adv-opt-mode'), 500 );
    this.actionLogData = [{
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "New",
      "time" : "3h ago"
    },{
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "help",
      "status": "Boosted",
      "time" : "3h ago"
    },
    {
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "bot",
      "status": "Hidden",
      "time" : "3h ago"
    },
    {
      "header" : "Can I make credit card payament via savings account",
      "description" : "You can setup standard instruction to debit your credit card payement easily via phone or laptopas per your convienece",
      "option": "doc",
      "status": "Pinned",
      "time" : "3h ago"
    }
  ]
    console.log(this.data)
  }
  swapSlider(slide){
    this.slider = slide;
    if(this.slider == 0 && $('.tab-name').length){
      $('.tab-ana').addClass('active')
      $('.tab-act').removeClass('active')
    }else{
      $('.tab-act').addClass('active')
      $('.tab-ana').removeClass('active')
    }
    console.log('button clicked')
  }

}
