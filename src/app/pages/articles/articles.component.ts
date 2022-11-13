import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, Subscription } from 'rxjs';
import { Article } from 'src/app/api/models';
import {
  ArticlesService,
  CategoriesService,
  UsersService,
} from 'src/app/api/services';
import { FilterItem } from 'src/app/models/filter-item';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'title',
    'category',
    'author',
    'creation_date',
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
      name: 'category',
      type: 'select',
      options: [],
      control: new FormControl(),
      active: false,
    },
    {
      name: 'author',
      type: 'select',
      options: [],
      control: new FormControl(),
      active: false,
    },
    {
      name: 'creation_date',
      type: 'date_picker',
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
      _sort: this.sort?.active ?? 'creation_date', // ordina di default per data creazione dalla più recente
      _order: this.sort?.direction ?? 'desc',
      'category.name':
        this.articleFiltersList.find(
          (filter) => filter.active && filter.name === 'category'
        )?.control?.value ?? [],
      'author.name':
        this.articleFiltersList.find(
          (filter) => filter.active && filter.name === 'author'
        )?.control?.value ?? [],
      creation_date_gte: this.articleFiltersList
        .find((filter) => filter.active && filter.name === 'creation_date')
        ?.controlsGroup?.controls[0]?.value?.valueOf(), // valueOf prende il valore in millisecondi della data moment.js
      creation_date_lte: this.articleFiltersList
        .find((filter) => filter.active && filter.name === 'creation_date')
        ?.controlsGroup?.controls[1]?.value?.valueOf(),
    };
  }

  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private articlesService: ArticlesService,
    private categoriesService: CategoriesService,
    private searchService: SearchService,
    private usersService: UsersService
  ) {}

  ngAfterViewInit(): void {}

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
          (item) => item.name === 'category'
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
          (item) => item.name === 'author'
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
}
