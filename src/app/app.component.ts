import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { distinctUntilChanged, filter, switchMap, tap } from 'rxjs';
import { SideNavItem } from './models/sidenav-item';
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

  constructor(
    private router: Router,
    private translate: TranslateService,
    private searchService: SearchService
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
      .pipe(
        distinctUntilChanged(),
      )
      .subscribe((value: string) => {
        this.searchService.emitSearch(value);
      }
      );
  }
}
