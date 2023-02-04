/* eslint-disable @angular-eslint/no-output-native */
import {
  Component,
  NgZone,
  Input,
  Output,
  ViewChild,
  ElementRef,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'md-editor-resize-sensor',
  templateUrl: './resize-sensor.html',
  styleUrls: ['./resize-sensor.scss'],
})
export class MarkdownEditorResizeSensorComponent implements AfterViewInit {
  @ViewChild('resizeSensor') resizeSensor: ElementRef;

  @Input() interval = 500;
  @Output() resize: EventEmitter<any> = new EventEmitter<any>();

  private sizeInfo: any = {
    width: 0,
    height: 0,
  };

  constructor(private _ngZone: NgZone) {}

  ngAfterViewInit() {
    this.sizeInfo = {
      width: this.resizeSensor.nativeElement.offsetWidth,
      height: this.resizeSensor.nativeElement.offsetHeight,
    };
    this._ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.detectSize();
      }, this.interval);
    });
  }

  private detectSize() {
    const width = this.resizeSensor.nativeElement.offsetWidth;
    const height = this.resizeSensor.nativeElement.offsetHeight;
    if (this.sizeInfo.width !== width || this.sizeInfo.height !== height) {
      this.sizeInfo = {
        width: width,
        height: height,
      };
      this.resize.emit(this.sizeInfo);
    }
    setTimeout(() => {
      this.detectSize();
    }, this.interval);
  }
}
