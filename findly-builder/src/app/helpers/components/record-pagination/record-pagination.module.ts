import { SharedPipesModule } from './../../filters/shared-pipes.module';
import { UseronboardingJourneyModule } from './../useronboarding-journey/useronboarding-journey.module';
import { FormsModule } from '@angular/forms';
import { RecordPaginationComponent } from './record-pagination.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [RecordPaginationComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [RecordPaginationComponent],
})
export class RecordPaginationModule {}
