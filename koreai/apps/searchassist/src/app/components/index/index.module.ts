import { EmptyScreenModule } from './../../modules/empty-screen/empty-screen.module';
import { FindlySharedModule } from '../../../findly-shared/findly-shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedPipesModule } from './../../helpers/filters/shared-pipes.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { KrModalModule } from './../../shared/kr-modal/kr-modal.module';
import { UpgradePlanModule } from './../../helpers/components/upgrade-plan/upgrade-plan.module';
import { IndexComponent } from './index.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    UpgradePlanModule,
    KrModalModule,
    TranslateModule,
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
    DragDropModule
  ],
  exports: [IndexComponent],
})
export class IndexModule {}
