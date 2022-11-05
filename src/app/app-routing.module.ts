import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticlesComponent } from './pages/articles/articles.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full"
  },
  {
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: "articles",
    component: ArticlesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
