import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SideNavItem } from './models/sidenav-item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cms';
  sideNavItems: SideNavItem[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      path: "/dashboard",
      icon: "dashboard"
    },
    {
      key: "articles",
      label: "Articles",
      path: "/articles",
      icon: "article"
    }
  ];
  currentNavItem?: SideNavItem;
  isSideNavExpanded = false;

  constructor(private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(
      (event: any)=> {
        this.currentNavItem = this.sideNavItems.find((navItem) => navItem.path === event.url) ?? this.currentNavItem;
      }
    )
  }


}
