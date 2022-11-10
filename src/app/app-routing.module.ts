import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleComponent } from './pages/articles/article/article.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { NewArticleComponent } from './pages/articles/new-article/new-article.component';
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
    path: "articles/new-article",
    component: NewArticleComponent
  },
  {
    path: "articles/:id",
    component: ArticleComponent
  },
  {
    path: "articles",
    component: ArticlesComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
