import { Component, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { AppSelectionService } from './services/app.selection.service';
import { LoaderService } from './shared/loader/loader.service';
import { Store } from '@ngrx/store';
import { LazyLoadService } from '@kore.libs/shared/src';

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

  constructor(private router: Router, private loaderService: LoaderService, private appSelectionService: AppSelectionService, private lazyLoadService: LazyLoadService) {
    this.onRouteEvents();
  }

  ngOnInit() {
    if (Object.entries(localStorage?.jStorage).length > 2) this.appSelectionService?.getAllPlans();
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
