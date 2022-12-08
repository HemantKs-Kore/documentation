import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Component, OnInit,Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NotificationService } from '@kore.services/notification.service';

@Component({
  selector: 'app-custom-config-form',
  templateUrl: './custom-config-form.component.html',
  styleUrls: ['./custom-config-form.component.scss'],
})
export class CustomConfigFormComponent implements OnInit, OnChanges {
  @Input() formData;
  @Output() onFormSubmit = new EventEmitter();
  isEditing = false;
  constructor(
    public notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.formData = {key: '', value: ''};
  }

  ngOnChanges(changes) {
    const formData = changes.formData.currentValue;
    this.formData = formData;
  }

  submitForm(customConfigForm) { 
    if (customConfigForm.invalid) {
      // show alert
      console.log('ERR');
      this.notificationService.notify('Please enter the required fields to proceed', 'error');
      return;
    } 
    if (this.formData._id) {
      this.onFormSubmit.emit({_id: this.formData._id, ...customConfigForm.value });
    } else {
      this.onFormSubmit.emit(customConfigForm.value);
    }

    this.formData = {};
    customConfigForm.resetForm();
    // customConfigForm.markAsPristine();
  }
}
