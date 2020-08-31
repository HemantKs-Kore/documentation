import { Component, HostListener, OnInit } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError ,ActivatedRoute} from '@angular/router';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { WorkflowService } from '@kore.services/workflow.service';
import { SideBarService } from './services/header.service';
declare const $: any;
import * as _ from 'underscore';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading = true;
  previousState;
  appsData: any;
  pathsObj: any = {
   '/faq':'Faqs',
   '/content':'Contnet',
   '/source':'Source',
   '/botActions':'Bot Actions'
  }
  constructor(private router: Router,
              private authService: AuthService,
              public localstore: LocalStoreService,
              public workflowService: WorkflowService,
              private activatedRoute: ActivatedRoute,
              private headerService: SideBarService
  ) {

    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  ngOnInit() {
    this.onResize();
    this.previousState = this.getPreviousState();
  }
   restorepreviousState(){
    let route = '/apps';
    if(this.previousState && this.previousState.selectedApp){
      const apps = this.appsData;
      if(apps && apps.length){
        const selectedApp = _.filter(apps,(app) => {
          return (app._id === this.previousState.selectedApp)
        })
        if(selectedApp && selectedApp.length){
          this.workflowService.selectedApp(selectedApp[0]);
          route = '/summary';
        if(this.previousState.route){
          route = this.previousState.route
         }
         try {
          this.router.navigate([route], { skipLocationChange: true });
          if(route && this.pathsObj && this.pathsObj[route]){
            this.preview(this.pathsObj[route]);
          }
         } catch (e) {
         }
        }
      }
    }
   }
   setPreviousState(route?){
     const path: any = {
       selectedApp: '',
       route:''
     };
     if(route){
       if(this.workflowService.selectedApp && this.workflowService.selectedApp() && this.workflowService.selectedApp()._id){
         path.selectedApp = this.workflowService.selectedApp()._id;
         path.route = route
         window.localStorage.setItem('krPreviousState',JSON.stringify(path));
       }
     } else {
      window.localStorage.removeItem('krPreviousState');
     }
   }
   preview(selection): void {
    const toogleObj = {
      title: selection,
    };
    this.headerService.toggle(toogleObj);
  }
   getPreviousState(){
     let previOusState :any = null;
     try {
       previOusState = JSON.parse(window.localStorage.getItem('krPreviousState'));
     } catch (e) {
     }
     return previOusState;
   }
  navigationInterceptor(event: RouterEvent): void {
    const self = this;
    if (event instanceof NavigationStart) {
      this.authService.findlyApps.subscribe( (res) => {
        self.loading = true;
        this.appsData = res;
      });
    }
    if (event instanceof NavigationEnd) {
      if (event && event.url === '/apps') {
        this.setPreviousState();
        $('.krFindlyAppComponent').removeClass('appSelected');
      } else {
        const path = event.url.split('?')[0];
        if(path){
          this.setPreviousState(path);
        }
        $('.krFindlyAppComponent').addClass('appSelected');
      }
      this.authService.findlyApps.subscribe((res) => {
        this.appsData = res;
        this. restorepreviousState();
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
