import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CreateArticleDto } from 'src/app/api/models';

@Component({
  selector: 'app-article-preview',
  templateUrl: './article-preview.component.html',
  styleUrls: ['./article-preview.component.scss'],
})
export class ArticlePreviewComponent implements OnInit, OnChanges {
  data?: CreateArticleDto;
  @Input() dataFromArticlePage?: CreateArticleDto;
  @Output() onGoBack = new EventEmitter<boolean>();

  constructor(private location: Location, private router: Router) {
    // dati passati attraverso la navigazione
    const navigationData = this.router.getCurrentNavigation()?.extras.state;
    if (navigationData && navigationData['data'])
      this.data = navigationData['data'];
  }

  ngOnChanges(changes: SimpleChanges): void {
    // dati passati in input dalla pagina di creazione/editing articolo
    if (changes && changes['dataFromArticlePage']) {
      this.data = { ...this.dataFromArticlePage };
    }
  }

  ngOnInit(): void {}

  goBack() {
    if (this.dataFromArticlePage) {
      this.onGoBack.emit(true);
    } else this.location.back();
  }
}
