import { SourcesModule } from './../sources/sources.module';
import { UpgradePlanModule } from './../../helpers/components/upgrade-plan/upgrade-plan.module';
import { StructuredDataModule } from './../structured-data/structured-data.module';
import { FormsModule } from '@angular/forms';
import { AddStructuredDataModule } from './../../components/add-structured-data/add-structured-data.module';
import { KrModalModule } from './../../shared/kr-modal/kr-modal.module';
import { FindlySharedModule } from '../../modules/findly-shared/findly-shared.module';
import { EmptyScreenModule } from './../empty-screen/empty-screen.module';
import { NgbTooltipModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SchedulerModule } from './../../components/scheduler/scheduler.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content.component';


@NgModule({
  declarations: [ContentComponent],
  imports: [
    CommonModule,
    ContentRoutingModule,
    SchedulerModule,
    TranslateModule,
    NgbTooltipModule,
    EmptyScreenModule,
    FindlySharedModule,
    KrModalModule,
    AddStructuredDataModule,
    FormsModule,
    NgbDropdownModule,
    KrModalModule,
    StructuredDataModule,
    UpgradePlanModule,
    SourcesModule
  ]
})
export class ContentModule { }
