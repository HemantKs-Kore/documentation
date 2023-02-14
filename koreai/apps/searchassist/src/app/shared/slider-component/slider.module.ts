import { SliderComponentComponent } from './slider-component.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [SliderComponentComponent],
    imports: [CommonModule],
    exports: [SliderComponentComponent],
    providers: [NgbActiveModal],
})
export class SliderModule { }
