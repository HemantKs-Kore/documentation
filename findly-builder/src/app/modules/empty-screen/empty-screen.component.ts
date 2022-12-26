import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-empty-screen',
  templateUrl: './empty-screen.component.html',
  styleUrls: ['./empty-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyScreenComponent implements OnInit {
  @Input() imgName = 'no-data.svg';
  @Input() width = '200';
  @Input() height = '200';
  @Input() title = '';
  @Input() desc = '';
  @Input() isSearch = false;
  @Output() isImgLoading = new EventEmitter(false);
  isLoading: boolean = false;

  constructor() {
    this.isLoading = true;
    this.isImgLoading.emit(this.isLoading);
  }

  hideLoader() {
    this.isLoading = false;
    this.isImgLoading.emit(this.isLoading);
  }

  loadingSpinner() {
    this.isImgLoading.emit(this.isLoading);
  }

  ngOnInit(): void {}
}
