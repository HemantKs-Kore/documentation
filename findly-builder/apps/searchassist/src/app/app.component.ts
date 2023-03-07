import {
  Component,
  ComponentRef,
  OnDestroy,
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
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmationDialogComponent } from './helpers/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LocalStoreService } from '@kore.apps/services/localstore.service';
import { AppUrlsService } from './services/app.urls.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

const SMALL_WIDTH_BREAKPOINT = 1200;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('dynamicRef', { read: ViewContainerRef }) dynamicRef;
  smMainMenuOpened = false;
  isMainMenuLoaded = false;
  mainMenuRef: ComponentRef<MainMenuComponent>;
  showMainMenu = false;
  appSelected = false;
  private unsubscriber: Subject<void> = new Subject<void>();
  sub: Subscription;
  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private appSelectionService: AppSelectionService,
    private lazyLoadService: LazyLoadService,
    private translate: TranslateService,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private localStoreDetails: LocalStoreService,
    private appUrlsService: AppUrlsService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.onRouteEvents();
    this.handleLang();
    this.observeScreen();
    // window.onbeforeunload = function onunload(event) {
    //   event.preventDefault();
    //   event.returnValue = '';
    // };

    // history.pushState(null, '');
    // fromEvent(window, 'popstate')
    //   .pipe(takeUntil(this.unsubscriber))
    //   .subscribe((event) => {
    //     event.preventDefault();
    //     event.returnValue = false;
    //     history.pushState(null, '');
    //     const currentRoute = this.router.routerState.snapshot.url;
    //     this.confirmation(event, currentRoute);
    //   });
  }
  confirmation(event, currentRoute) {
    setTimeout(() => {
      this.router.navigate([currentRoute], { skipLocationChange: true });
    }, 0);
    let body = 'This will navigate screen to home Page ';
    if (currentRoute === '/') {
      body = 'This will logout and navigate to Login';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '530px',
      height: 'auto',
      panelClass: 'delete-popup',
      data: {
        newTitle: 'Are you sure you want to leave this page ',
        body: body,
        buttons: [
          { key: 'yes', label: 'Proceed' },
          { key: 'no', label: 'Cancel', secondaryBtn: true },
        ],
        confirmationPopUp: true,
      },
    });
    dialogRef.componentInstance.onSelect.subscribe((result) => {
      if (result === 'yes') {
        dialogRef.close();
        if (currentRoute === '/') {
          //this.router.navigate([''], { skipLocationChange: true });
          this.localStoreDetails.removeAuthInfo();
          this.appUrlsService.redirectToLogin();
        } else {
          this.router.navigate([''], { skipLocationChange: true });
        }
      } else if (result === 'no') {
        dialogRef.close();
        console.log('Stop here');
      }
    });
  }

  observeScreen() {
    this.sub = this.breakpointObserver
      .observe([`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`])
      .subscribe((state: BreakpointState) => {
        if (!state.matches) {
          this.smMainMenuOpened = false;
        }
      });
  }

  handleLang() {
    const lang = window.localStorage.getItem('appLanguage');
    if (lang) {
      this.translate.setDefaultLang(lang);
      if (lang && lang !== 'en') {
        this.lazyLoadService.loadStyle('lang.min.css');
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
    const routerEventSub = this.router.events.subscribe((event: any) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loaderService.show();
          break;
        }

        case event instanceof NavigationEnd: {
          if (event.url !== '/') {
            this.appSelected = true;
            this.smMainMenuOpened = false;
          } else {
            this.appSelected = false;
          }

          this.loaderService.hide();
          break;
        }
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

    this.sub?.add(routerEventSub);
  }

  updateMenuProps(menuType, event) {
    if (this.mainMenuRef) {
      this.mainMenuRef.instance[menuType] = event;
    }
  }

  loadMainMenu(menuType, event) {
    if (!this.isMainMenuLoaded) {
      this.isMainMenuLoaded = true;

      import('./modules/layout/mainmenu/mainmenu.component').then(
        ({ MainMenuComponent }) => {
          if (this.dynamicRef) {
            this.dynamicRef.clear();
            this.mainMenuRef =
              this.dynamicRef.createComponent(MainMenuComponent);
            this.updateMenuProps(menuType, event);
            const menuToggleSub =
              this.mainMenuRef.instance.toggleMainMenu.subscribe(() => {
                this.smMainMenuOpened = false;
              });

            this.sub?.add(menuToggleSub);
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
  openSmMainMenu() {
    this.smMainMenuOpened = true;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}
