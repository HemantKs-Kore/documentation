import { EmptyScreenModule } from './../../../empty-screen/empty-screen.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SynonymsRoutingModule } from './synonyms-routing.module';
import { SynonymsComponent } from './synonyms.component';
import { FindlySharedModule } from '../../../findly-shared/findly-shared.module';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [SynonymsComponent],
  imports: [
    CommonModule,
    SynonymsRoutingModule,
    FindlySharedModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    EmptyScreenModule
  ]
})
export class SynonymsModule { }
