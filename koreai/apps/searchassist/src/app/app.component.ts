import { Component, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { LazyLoadService } from '@kore.shared/*';
import { LoaderService } from './shared/loader/loader.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showMainMenu = true;
  settingMainMenu = false;
  sourceMenu = false;
  appSelected = false;

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private store: Store,
    private lazyLoadService: LazyLoadService
  ) {
    this.onRouteEvents();
  }

  ngOnInit() {
    this.lazyLoadStyles();
  }

  lazyLoadStyles() {
    this.lazyLoadService.loadStyle('vendor.min.css');
  }

  onRouteEvents() {
    this.router.events.subscribe((event: any) => {
      switch (true) {
        case event instanceof NavigationStart: {
          if (event.url !== '/') {
            this.appSelected = true;
          } else {
            this.appSelected = false;
          }
          this.loaderService.show();
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loaderService.hide();
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  showMenu(event) {
    this.showMainMenu = event;
  }
  showSourceMenu(event) {
    this.sourceMenu = event;
  }
  settingMenu(event) {
    this.settingMainMenu = event;
  }
}
