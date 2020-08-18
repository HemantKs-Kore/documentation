import { Injectable, OnInit} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
    providedIn: 'root'
})
export class NotificationService {
  constructor(
    private toastr: ToastrService
  ) {}
  private windowElement: any;
  notify(notifyInfo, type) {
    this.windowElement = window;
    if (notifyInfo && this.windowElement && this.windowElement.parent && this.windowElement.parent.NotificationService) {
        this.windowElement.parent.NotificationService.notify(notifyInfo, type);
  } else {
    if (type === 'error') {
      this.toastr.error(notifyInfo);
    }
    if (type === 'success') {
      this.toastr.success(notifyInfo);
    }
    if (type === 'warning') {
      this.toastr.warning(notifyInfo);
    }
  }
}

}
