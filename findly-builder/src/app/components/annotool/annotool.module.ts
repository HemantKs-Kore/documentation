import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SimplebarAngularModule } from 'simplebar-angular';

import { AnnotoolRoutingModule } from './annotool-routing.module';
import { AnnotoolComponent } from './annotool.component';
import { PdfAnnotationComponent } from './components/pdf-annotation/pdf-annotation.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { SummaryModalComponent } from './components/summary-modal/summary-modal.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';
import { TruncatePipe } from './helpers/truncate.pipe';
import { UserGuideComponent } from './components/user-guide/user-guide.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClickOutSideDirective } from './helpers/click-out-side.directive';
import { SearchPipe } from "./helpers/search.pipe";
@NgModule({
  declarations: [
    AnnotoolComponent, 
    PdfAnnotationComponent, 
    TruncatePipe,
    UserGuideComponent,
    ClickOutSideDirective,
    ConfirmationComponent,
    SummaryModalComponent,
    SearchPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PdfViewerModule,
    PerfectScrollbarModule,
    MatDialogModule,
    MatProgressBarModule,
    MatExpansionModule,
    SharedModule,
    NgbModule,
    MatProgressSpinnerModule,
    SimplebarAngularModule,
    AnnotoolRoutingModule,  
  ],
  exports: [
    AnnotoolComponent, 
    PdfAnnotationComponent, 
    TruncatePipe, 
    UserGuideComponent,
    ClickOutSideDirective,
    ConfirmationComponent,
    SummaryModalComponent
  ],
  entryComponents: [
    PdfAnnotationComponent,
    UserGuideComponent,
    ConfirmationComponent,
    SummaryModalComponent
  ],
})
export class AnnotoolModule { }
