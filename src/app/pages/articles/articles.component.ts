import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { map, Subscription } from 'rxjs';
import { Article } from 'src/app/api/models';
import { ArticlesService } from 'src/app/api/services';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit, OnDestroy {
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
  constructor(
    private articlesService: ArticlesService,
    private searchService: SearchService
  ) {}
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.searchSubscription = this.searchService.searchObservable.subscribe((value: string) => {
      this.getArticles(value);
    })
    this.getArticles();
  }

  getArticles(searchTerm?: string) {
    this.articlesService
      .getArticles$Response({
        _page: this.articlesCurrentPage,
        _limit: this.articlesPageSize,
        q: searchTerm
      })
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

  onPageChange(pageInfo: PageEvent) {
    this.articlesPageSize = pageInfo.pageSize;
    this.articlesCurrentPage = ++pageInfo.pageIndex; // le pagine dell'api partono da 1
    this.getArticles();
  }
}
