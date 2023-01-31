import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamManagementRoutingModule } from './team-management-routing.module';
import { TeamManagementComponent } from './team-management.component';
import { KrModalModule } from '../../shared/kr-modal/kr-modal.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatChipsModule } from '@angular/material/chips';
import { SharedPipesModule } from '@kore.apps/helpers/filters/shared-pipes.module';

@NgModule({
  declarations: [TeamManagementComponent],
  imports: [
    CommonModule,
    TeamManagementRoutingModule,
    KrModalModule,
    TranslateModule,
    MatFormFieldModule,
    FormsModule,
    NgbTypeaheadModule,
    FormsModule,
    MatFormFieldModule,
    PerfectScrollbarModule,
    MatChipsModule,
    ReactiveFormsModule,
    SharedPipesModule,
  ],
})
export class TeamManagementModule {}
