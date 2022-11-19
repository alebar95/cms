import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as moment from 'moment';
import { Article, Category, CreateArticleDto } from 'src/app/api/models';
import { ArticlesService, CategoriesService } from 'src/app/api/services';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {
  formGroup: FormGroup;
  categories: Category[] = [];
  imageFile: File | null = null;
  imageBase64: string | ArrayBuffer | null = null;
  imageFileUploadProgress = 0;
  imageFileReader = new FileReader();
  imageFileError = false;
  // configurazioni WYSIWYG editor
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    //upload: (file: File) => {  },
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['bold', 'italic'], ['fontSize']],
  };

  // edit mode
  editMode = false;
  article?: any;

  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private articlesService: ArticlesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
    });
    this.imageFileReader.onprogress = this.onReadingFileProgress;
    this.imageFileReader.onload = this.onReadingFileDone;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const numberId = id as any as number;
      if (!isNaN(numberId)) {
        this.getArticle(numberId);
      }
      this.editMode = true;
    }
    this.getCategories();
  }

  getArticle(id: number) {
    this.articlesService.getArticleById({ articleId: id }).subscribe({
      next: (res: any) => {
        this.article = res;
        this.formGroup.setValue({
          title: this.article.title,
          content: this.article.content,
          category: this.article.category,
        });
        // TODO modificare modello db per article per image per il filename, fare post e get di image
        const url = this.article.image.base64string;
        if (url) {
          this.imageBase64 = url;
          fetch(url)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], this.article.image.file_name)
            this.imageFile = file;
            this.imageFileUploadProgress = 100;
          })
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onSaveArticle() {
    const article: CreateArticleDto = {
      ...this.formGroup.value,
      image: this.imageBase64,
      author: {
        id: 1,
        name: 'Calvin Candie',
        image: './assets/users_images/calvin_candie.png',
      },
      creation_date: moment().valueOf(),
    };
    this.saveArticle(article);
  }

  getCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  saveArticle(article: CreateArticleDto) {
    this.articlesService
      .createArticle({
        body: article,
      })
      .subscribe({
        next: (res) => {
          console.log('creato');
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  goBack() {
    this.router.navigateByUrl('articles');
  }

  /* Gestione file immagine (viene salvata come base64,
    l'ogetto imageFileReader è il file reader che legge il file
    in input e lo trasforma in base64)
  */

  deleteImage() {
    this.imageFile = null;
    this.imageBase64 = null;
    this.imageFileError = false;
  }

  fileBrowseHandler(target: EventTarget | null) {
    if (target) {
      const input = target as HTMLInputElement;
      if (input.files && input.files.length) this.imageFile = input.files[0];
      if (this.imageFile) {
        this.imageFileReader.readAsDataURL(this.imageFile);
      }
    }
  }

  onReadingFileProgress = (event: ProgressEvent<FileReader>) => {
    this.imageFileUploadProgress = (event.loaded / event.total) * 100;
  };
  onReadingFileDone = () => {
    this.imageBase64 = this.imageFileReader.result;
  };
  onReadingFileError = () => {
    this.imageFileError = true;
  };

  // funzione che compara opzioni e valore isnerito per la select di category
  compareWithCategorySelect(category1: Category, category2: Category) {
    return category1.id === category2.id;
  }
}
