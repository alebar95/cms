import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { distinctUntilChanged, filter, switchMap, tap } from 'rxjs';
import { User } from './api/models';
import { UsersService } from './api/services';
import { SideNavItem } from './models/sidenav-item';
import { LogUserService } from './services/log-user.service';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
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

  get loggedUser(): User | undefined {
    return this.logUserService.loggedUser;
  }

  constructor(
    public router: Router,
    private translate: TranslateService,
    private searchService: SearchService,
    private logUserService: LogUserService
  ) {
    // lingua
    this.translate.use('en');

    // aggiornamento elemento sidenav attivo
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url === '/') this.currentNavItem = this.sideNavItems[0];
        else {
          this.currentNavItem =
            this.sideNavItems.find((navItem) => navItem.path === event.url) ??
            this.currentNavItem;
        }
      });
  }
  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value: string) => {
        this.searchService.emitSearch(value);
      });
    this.logUserService.getLoggedUser(); // mock utente loggato
  }

  onSetLang(lang: 'en' | 'it') {
    this.translate.use(lang);
  }
}
