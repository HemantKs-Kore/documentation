import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-onboarding-component',
  templateUrl: './onboarding-component.component.html',
  styleUrls: ['./onboarding-component.component.scss']
})
export class OnboardingComponentComponent implements OnInit {
  @Output() closeSlid = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
    console.log("slider check")
  }
  closeSupport(){
    this.closeSlid.emit();
  }

}
