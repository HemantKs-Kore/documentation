import { Component, HostListener, OnInit } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { workflowService } from '@kore.services/workflow.service';
declare const $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading = true;
  appsData: any;
  constructor(private router: Router,
              private authService: AuthService,
              public localstore: LocalStoreService,
              public workflowService: workflowService,
  ) {

    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  ngOnInit() {
    this.onResize();
    $('.toShowAppHeader').addClass('d-none');
    this.router.navigate(['/apps'], { skipLocationChange: true });
  }

  navigationInterceptor(event: RouterEvent): void {
    const self = this;
    if (event instanceof NavigationStart) {
      this.authService.findlyApps.subscribe( (res) => {
        self.appsData = res;
        self.loading = true;
      });
    }
    if (event instanceof NavigationEnd) {
      if (event && event.url === '/apps') {
        // $('.toShowAppHeader').addClass('d-none');
        $('.krFindlyAppComponent').removeClass('appSelected');
      } else {
        // $('.toShowAppHeader').removeClass('d-none');
        $('.krFindlyAppComponent').addClass('appSelected');
      }
      this.authService.findlyApps.subscribe((res) => {
        self.appsData = res;
        self.loading = false;
      });
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loading = false;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.workflowService.disablePerfectScroll = window.innerWidth <= 600;
  }
}
