import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './modules/material.module';
import { ArticlesComponent } from './pages/articles/articles.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ArticlePreviewComponent } from './pages/articles/article-preview/article-preview.component';
import { ArticleComponent } from './pages/articles/article/article.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorIntlService } from './services/paginator-intl.service';
import { FiltersComponent } from './components/filters/filters.component';
import { ConfirmationDialogComponent } from './components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { AngularEditorModule } from '@kolkov/angular-editor';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ArticlesComponent,
    DashboardComponent,
    ArticlePreviewComponent,
    ArticleComponent,
    FiltersComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularEditorModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
  }}),
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useFactory: (translate: TranslateService) => {
        const service = new PaginatorIntlService();
        service.injectTranslateService(translate);
        return service;
      },
      deps: [TranslateService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
