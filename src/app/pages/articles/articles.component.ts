import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/api/models';
import { ArticlesService } from 'src/app/api/services';


@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'category', 'author','creation_date', 'more'];
  articles: Article[] = [];
  constructor(private articlesService: ArticlesService) {}

  ngOnInit(): void {
    this.getArticles();
  }

  getArticles() {
    this.articlesService.getArticles().subscribe({
      next: (res) => {
        this.articles = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
