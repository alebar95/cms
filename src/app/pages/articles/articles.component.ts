import { Component, OnInit } from '@angular/core';
import { ArticlesService } from 'src/app/api/services';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
  constructor(private articlesService: ArticlesService) {}

  ngOnInit(): void {
    this.articlesService.articlesGet().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
