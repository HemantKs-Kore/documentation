import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PdfAnnotationComponent } from './components/pdf-annotation/pdf-annotation.component';
import { AnnotoolComponent } from './annotool.component';

const routes: Routes = [
  {
    path: "", 
    component: AnnotoolComponent,
    children: [
      {path: '', component: PdfAnnotationComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnotoolRoutingModule { }
