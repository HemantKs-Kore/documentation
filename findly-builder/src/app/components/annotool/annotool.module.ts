import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AnnotoolRoutingModule } from './annotool-routing.module';
import { AnnotoolComponent } from './annotool.component';
import { PdfAnnotationComponent } from './components/pdf-annotation/pdf-annotation.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';
import { TruncatePipe } from './helpers/truncate.pipe';
import { UserGuideComponent } from './components/user-guide/user-guide.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClickOutSideDirective } from './helpers/click-out-side.directive';

@NgModule({
  declarations: [
    AnnotoolComponent, 
    PdfAnnotationComponent, 
    TruncatePipe,
    UserGuideComponent,
    ClickOutSideDirective
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
    AnnotoolRoutingModule,  
  ],
  exports: [
    AnnotoolComponent, 
    PdfAnnotationComponent, 
    TruncatePipe, 
    UserGuideComponent,
    ClickOutSideDirective
  ],
  entryComponents: [
    PdfAnnotationComponent,
    UserGuideComponent
  ],
})
export class AnnotoolModule { }
