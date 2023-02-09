import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-snippet',
  templateUrl: './snippet.component.html',
  styleUrls: ['./snippet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnippetComponent {}
