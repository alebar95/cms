import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticlePreviewComponent } from './pages/articles/article-preview/article-preview.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { ArticleComponent } from './pages/articles/article/article.component';
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
    path: "articles/article/:id",
    component: ArticleComponent
  },
  {
    path: "articles/article",
    component: ArticleComponent
  },
  {
    path: "articles/article-preview",
    component: ArticlePreviewComponent
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
