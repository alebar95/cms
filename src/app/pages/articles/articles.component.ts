import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, Subscription } from 'rxjs';
import { Article } from 'src/app/api/models';
import {
  ArticlesService,
  CategoriesService,
  UsersService,
} from 'src/app/api/services';
import { ConfirmationDialogComponent } from 'src/app/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import {
  AUTHOR,
  CATEGORY,
  CREATION_DATE,
  DATE_PICKER,
  ID,
  SELECT,
  TITLE,
} from 'src/app/constants';
import { FilterItem } from 'src/app/models/filter-item';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    ID,
    TITLE,
    CATEGORY,
    AUTHOR,
    CREATION_DATE,
    'more',
  ];
  articles: Article[] = [];
  articlesTotalNumber = 0;
  articlesCurrentPage = 1;
  articlesPageSize = 5;
  searchSubscription?: Subscription;
  searchTerm = '';
  articleFiltersList: FilterItem[] = [
    {
      name: CATEGORY,
      type: SELECT,
      options: [],
      control: new FormControl(),
      active: false,
    },
    {
      name: AUTHOR,
      type: SELECT,
      options: [],
      control: new FormControl(),
      active: false,
    },
    {
      name: CREATION_DATE,
      type: DATE_PICKER,
      controlsGroup: new FormGroup([new FormControl(), new FormControl()]),
      active: false,
    },
  ];
  get activeFiltersParams(): {
    _page: number;
    _limit: number;
    q: string;
    _sort?: string;
    _order?: string;
    'category.name': string[];
    'author.name': string[];
    creation_date_gte?: number;
    creation_date_ne?: number;
    creation_date_lte?: number;
  } {
    return {
      _page: this.articlesCurrentPage,
      _limit: this.articlesPageSize,
      q: this.searchTerm,
      _sort: this.sort?.active ?? CREATION_DATE, // ordina di default per data creazione dalla più recente
      _order: this.sort?.direction ?? 'desc',
      'category.name':
        this.articleFiltersList.find(
          (filter) => filter.active && filter.name === CATEGORY
        )?.control?.value ?? [],
      'author.name':
        this.articleFiltersList.find(
          (filter) => filter.active && filter.name === AUTHOR
        )?.control?.value ?? [],
      creation_date_gte: this.articleFiltersList
        .find((filter) => filter.active && filter.name === CREATION_DATE)
        ?.controlsGroup?.controls[0]?.value?.valueOf(), // valueOf prende il valore in millisecondi della data moment.js
      creation_date_lte: this.articleFiltersList
        .find((filter) => filter.active && filter.name === CREATION_DATE)
        ?.controlsGroup?.controls[1]?.value?.valueOf(),
    };
  }

  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private articlesService: ArticlesService,
    private categoriesService: CategoriesService,
    private searchService: SearchService,
    private usersService: UsersService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.searchSubscription = this.searchService.searchObservable.subscribe(
      (value: string) => {
        this.searchTerm = value;
        this.articlesCurrentPage = 1;
        this.getArticles();
      }
    );
    this.getArticles();
    this.getCategories();
    this.getAuthors();
  }

  getArticles() {
    this.articlesService
      .getArticles$Response(this.activeFiltersParams)
      .pipe(
        map((res) => {
          return {
            content: res.body,
            totalNumber:
              res.headers.get('X-Total-Count') &&
              !isNaN(res.headers.get('X-Total-Count') as any as number)
                ? (res.headers.get('X-Total-Count') as any as number)
                : 0,
          };
        })
      )
      .subscribe({
        next: (res) => {
          this.articlesTotalNumber = res.totalNumber;
          this.articles = res.content;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  getCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        // Aggiorno opzioni filtro
        const categoryFilterItem = this.articleFiltersList.find(
          (item) => item.name === CATEGORY
        );
        if (categoryFilterItem)
          categoryFilterItem.options = res.map((cat) => {
            return { id: cat.id!, name: cat.name! };
          });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getAuthors() {
    this.usersService.getUsers().subscribe({
      next: (res) => {
        // Aggiorno opzioni filtro
        const authorFilterItem = this.articleFiltersList.find(
          (item) => item.name === AUTHOR
        );
        if (authorFilterItem)
          authorFilterItem.options = res.map((author) => {
            return { id: author.id!, name: author.name! };
          });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onPageChange(pageInfo: PageEvent) {
    this.articlesPageSize = pageInfo.pageSize;
    this.articlesCurrentPage = ++pageInfo.pageIndex; // le pagine dell'api partono da 1
    this.getArticles();
  }

  openDeleteArticleDialog(article: Article) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        data: { type: 'article', ...article },
        type: 'operation_confirm',
        title: 'WARNING',
        subtitle: 'CONFIRM_DELETE_SUBTITLE',
      },
    });

    dialogRef.afterClosed().subscribe((actionConfirmed) => {
      if (actionConfirmed) {
        this.deleteArticle(article.id!);
      }
    });
  }

  openDeleteSuccesDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        data: {
          type: 'article',
        },
        type: 'operation_done',
        title: 'DELETE',
        subtitle: 'SUCCESS_DELETE_SUBTITLE',
      },
    });

    dialogRef.afterClosed().subscribe((_) => {
      this.getArticles();
    });
  }

  deleteArticle(articleId: number) {
    this.articlesService.deleteArticle({ articleId }).subscribe({
      next: (_) => {
        this.openDeleteSuccesDialog();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
