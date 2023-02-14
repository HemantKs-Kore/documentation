import {
  Component,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { LoaderService } from './shared/loader/loader.service';
import { Store } from '@ngrx/store';
import { LazyLoadService } from '@kore.libs/shared/src';
import { MainMenuComponent } from './modules/layout/mainmenu/mainmenu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('dynamicRef', { read: ViewContainerRef }) dynamicRef;
  isMainMenuLoaded = false;
  mainMenuRef: ComponentRef<MainMenuComponent>;
  showMainMenu = true;
  // settingMainMenu = false;
  // sourceMenu = false;
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

  updateMenuProps(menuType, event) {
    this.mainMenuRef.instance[menuType] = event;
  }

  loadMainMenu(menuType, event) {
    if (!this.isMainMenuLoaded) {
      import('./modules/layout/mainmenu/mainmenu.component').then(
        ({ MainMenuComponent }) => {
          this.isMainMenuLoaded = true;

          if (this.dynamicRef) {
            this.dynamicRef.clear();
            this.mainMenuRef =
              this.dynamicRef.createComponent(MainMenuComponent);
            this.updateMenuProps(menuType, event);
          }
        }
      );
    } else {
      this.updateMenuProps(menuType, event);
    }
  }

  showMenu(event) {
    this.showMainMenu = event;
    this.loadMainMenu('show', event);
  }

  showSourceMenu(event) {
    this.loadMainMenu('sourceMenu', event);
  }
  settingMenu(event) {
    this.loadMainMenu('settingMainMenu', event);
  }
}
