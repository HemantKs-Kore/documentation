import { Component, OnInit } from '@angular/core';
import { AppSelectionService } from '@kore.apps/services/app.selection.service';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
})
export class GeneralSettingsComponent implements OnInit {
  componentType: string = 'addData';
  constructor(private appSelectionService: AppSelectionService) {}

  ngOnInit(): void {}
  openUserMetaTagsSlider() {
    this.appSelectionService.topicGuideShow.next(undefined);
  }
}
