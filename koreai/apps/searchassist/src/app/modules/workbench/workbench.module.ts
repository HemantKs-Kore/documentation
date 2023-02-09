import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkbenchRoutingModule } from './workbench-routing.module';
import { WorkbenchComponent } from './workbench.component';
import { KrModalModule } from '@kore.apps/shared/kr-modal/kr-modal.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FindlySharedModule } from '../findly-shared/findly-shared.module';
import { EmptyScreenModule } from '../empty-screen/empty-screen.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { UseronboardingJourneyModule } from '@kore.apps/helpers/components/useronboarding-journey/useronboarding-journey.module';
import { MatDialogModule } from '@angular/material/dialog';
import { PlanUpgradeModule } from '../pricing/shared/plan-upgrade/plan-upgrade.module';

@NgModule({
  declarations: [WorkbenchComponent],
  imports: [
    CommonModule,
    WorkbenchRoutingModule,
    CommonModule,
    PlanUpgradeModule,
    KrModalModule,
    TranslateModule.forChild(),
    MatProgressSpinnerModule,
    FormsModule,
    PerfectScrollbarModule,
    CodemirrorModule,
    NgbTooltipModule,
    SharedPipesModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
    FindlySharedModule,
    EmptyScreenModule,
    DragDropModule,
    MatFormFieldModule,
    MatInputModule,
    UseronboardingJourneyModule,
    NgbTooltipModule,
    MatDialogModule,
  ],
})
export class WorkbenchModule { }
