import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SynonymsRoutingModule } from './synonyms-routing.module';
import { SynonymsComponent } from './synonyms.component';
import { FindlySharedModule } from 'src/app/modules/findly-shared/findly-shared.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [SynonymsComponent],
  imports: [
    CommonModule,
    SynonymsRoutingModule,
    FindlySharedModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule
  ]
})
export class SynonymsModule { }
