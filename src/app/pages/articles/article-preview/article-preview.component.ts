import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CreateArticleDto } from 'src/app/api/models';

@Component({
  selector: 'app-article-preview',
  templateUrl: './article-preview.component.html',
  styleUrls: ['./article-preview.component.scss'],
})
export class ArticlePreviewComponent implements OnInit {
  data?: CreateArticleDto;

  constructor(
    private location: Location,
    private router: Router
  ) {
    // dati passati attraverso la navigazione
    const navigationData = this.router.getCurrentNavigation()?.extras.state;
    if (navigationData && navigationData['data'])
      this.data = navigationData['data'];
  }

  ngOnInit(): void {
  }

  goBack() {
    this.location.back();
  }
}
