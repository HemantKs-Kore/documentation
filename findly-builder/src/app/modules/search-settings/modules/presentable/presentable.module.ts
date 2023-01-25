import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresentableRoutingModule } from './presentable-routing.module';
import { PresentableComponent } from './presentable.component';
import { FindlySharedModule } from 'src/app/modules/findly-shared/findly-shared.module';
// import { TranslateService } from '@ngx-translate/core';

@NgModule({
  declarations: [PresentableComponent],
  imports: [CommonModule, PresentableRoutingModule, FindlySharedModule],
})
export class PresentableModule {
  // constructor(private translate: TranslateService) {}
}
