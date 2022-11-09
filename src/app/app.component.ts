import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { SideNavItem } from './models/sidenav-item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'cms';
  sideNavItems: SideNavItem[] = [
    {
      key: 'dashboard',
      label: 'SIDENAV_ITEMS.DASHBOARD',
      path: '/dashboard',
      icon: 'dashboard',
    },
    {
      key: 'articles',
      label: 'SIDENAV_ITEMS.ARTICLES',
      path: '/articles',
      icon: 'article',
    },
  ];
  currentNavItem?: SideNavItem;
  isSideNavExpanded = false;
  searchControl = new FormControl();

  constructor(private router: Router, private translate: TranslateService) {
    // lingua
    this.translate.use('en');

    // aggiornamento elemento sidenav attivo
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(
      (event: any)=> {
        if (event.url === '/') this.currentNavItem = this.sideNavItems[0];
        else {
          this.currentNavItem = this.sideNavItems.find((navItem) => navItem.path === event.url) ?? this.currentNavItem;
        }
      }
    )
  }
}
