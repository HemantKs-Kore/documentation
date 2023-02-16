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
import { AppSelectionService } from './services/app.selection.service';
import { LoaderService } from './shared/loader/loader.service';
import { LazyLoadService } from '@kore.libs/shared/src';
import { MainMenuComponent } from './modules/layout/mainmenu/mainmenu.component';
import { TranslateService } from '@ngx-translate/core';
import { Renderer2 } from '@angular/core';
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
  appSelected = false;

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private appSelectionService: AppSelectionService,
    private lazyLoadService: LazyLoadService,
    private translate: TranslateService,
    private renderer: Renderer2
  ) {
    this.onRouteEvents();
    this.handleLang();
  }

  handleLang() {
    const lang = window.localStorage.getItem('appLanguage');
    if (lang) {
      this.translate.setDefaultLang(lang);
      if (lang && lang !== 'en') {
        this.lazyLoadService.loadStyle('lang.min.css').subscribe();
        this.renderer.addClass(document.body, 'sa-lang-' + lang);
      }
    } else {
      const loc = window.location.href.split('home/');
      if (loc.length && loc[1]) {
        const lang = loc[1];
        this.translate.setDefaultLang(lang);
        this.renderer.addClass(document.body, 'sa-lang-' + lang);
      }
    }
  }

  ngOnInit() {
    if (Object.entries(localStorage?.jStorage).length > 2)
      this.appSelectionService?.getAllPlans();
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
