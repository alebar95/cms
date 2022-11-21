import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as moment from 'moment';
import { Article, Category, CreateArticleDto, Image } from 'src/app/api/models';
import {
  ArticlesService,
  CategoriesService,
  ImagesService,
} from 'src/app/api/services';
import { ConfirmationDialogComponent } from 'src/app/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ImageConverterService } from 'src/app/services/image-converter.service';
import { LogUserService } from 'src/app/services/log-user.service';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {
  formGroup: FormGroup;
  categories: Category[] = [];
  imageFile: File | null = null;
  imageFileUploadProgress = 0;
  imageFileError = false;
  imageFileUploaded?: Image | null;
  // configurazioni WYSIWYG editor
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '250px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
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
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      [
        'fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode',
      ],
    ],
  };

  //  dati preview d apassare al componente di preview
  get previewData(): CreateArticleDto {
    return {
      ...this.formGroup.value,
      author: this.logUserService.loggedUser,
      image: this.imageFileUploaded,
      creation_date: this.article
        ? this.article.creation_date
        : moment.now().valueOf(),
    };
  }

  // previw mode
  previewMode = false;

  // edit mode
  editMode = false;
  article?: Article;

  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private articlesService: ArticlesService,
    private imagesService: ImagesService,
    private router: Router,
    private route: ActivatedRoute,
    private imageConverterService: ImageConverterService,
    private dialog: MatDialog,
    private logUserService: LogUserService,
    private location: Location,
    private translate: TranslateService
  ) {
    this.formGroup = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
    });
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

    // placeholder editor tradotto
    this.translate.get('EDITOR_PLACEHOLDER').subscribe((label) => {
      this.editorConfig.placeholder = label;
    });
    this.translate.onLangChange.subscribe((_) => {
      this.editorConfig.placeholder =
        this.translate.instant('EDITOR_PLACEHOLDER');
    });
  }

  getArticle(id: number) {
    this.articlesService.getArticleById({ articleId: id }).subscribe({
      next: (res: Article) => {
        this.article = res;
        this.formGroup.setValue({
          title: this.article.title,
          content: this.article.content,
          category: this.article.category,
        });
        if (
          this.article &&
          this.article.image &&
          this.article.image.base64string &&
          this.article.image.file_name
        ) {
          // conversione da base64 letto da db a file
          this.convertBase64toImageFile(
            this.article.image.base64string,
            this.fromBlobToFile,
            (err) => {
              console.error(err);
            }
          );
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onSaveArticle() {
    if (this.logUserService.loggedUser) {
      const article: CreateArticleDto = {
        ...this.formGroup.value,
        image: this.imageFileUploaded,
        author: this.logUserService.loggedUser,
        creation_date:
          this.article && this.article.creation_date
            ? this.article.creation_date
            : moment().valueOf(),
      };
      this.saveArticle(article, this.article?.id);
    }
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

  saveArticle(article: CreateArticleDto, articleId?: number) {
    const saveObservable = articleId
      ? this.articlesService.editArtcileById({ articleId, body: article })
      : this.articlesService.createArticle({ body: article });
    saveObservable.subscribe({
      next: (res) => {
        this.openSaveSuccesDialog(articleId ? true : false);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  openSaveSuccesDialog(edit?: boolean) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        data: {
          type: this.translate.currentLang === 'en' ? 'article' : 'Articolo',
        },
        type: 'operation_done',
        title: edit ? 'EDIT_ARTICLE' : 'NEW_ARTICLE',
        subtitle: edit ? 'SUCCESS_EDIT_SUBTITLE' : 'SUCCESS_CREATE_SUBTITLE',
      },
    });
    dialogRef.afterClosed().subscribe((_) => {
      this.router.navigateByUrl('articles');
    });
  }

  goBack() {
    this.location.back();
  }

  deleteImage() {
    this.imageFile = null;
    this.imageFileError = false;
    this.imageFileUploaded = null;
  }

  fileBrowseHandler(target: EventTarget | null) {
    if (target) {
      const input = target as HTMLInputElement;
      if (input.files && input.files.length) this.imageFile = input.files[0];
      if (this.imageFile) {
        this.convertImageToBase64(
          this.imageFile,
          this.uploadImage, // upload immagine se conversione in base64 va a buon fine
          () => (this.imageFileError = true) // errore conversione
        );
      }
    }
  }

  // le immagini sono salvate nel db.json in base64
  uploadImage = (base64string: string) => {
    if (this.imageFile) {
      // post di upload
      this.imagesService
        .createImage$ResponseProgressEvent({
          body: {
            file_name: this.imageFile.name,
            base64string: base64string,
          },
        })
        .subscribe({
          next: (event: HttpEvent<any>) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                // upload in progress
                if (event.total)
                  this.imageFileUploadProgress = Math.round(
                    (event.loaded / event.total) * 100
                  );
                break;
              case HttpEventType.Response:
                // upload completato
                const imageParsed: Image = JSON.parse(event.body);
                this.imageFileUploaded = imageParsed;
                break;
            }
          },
          error: (err) => {
            console.error(err);
            this.imageFileError = true;
          },
        });
    }
  };

  fromBlobToFile = (blob: Blob) => {
    const file = new File([blob], this.article!.image!.file_name!);
    this.imageFile = file;
    this.imageFileUploadProgress = 100;
    this.imageFileUploaded = this.article!.image;
  };

  // funzione che compara opzioni e valore isnerito per la select di category
  compareWithCategorySelect(category1: Category, category2: Category) {
    return category1.id === category2.id;
  }

  convertImageToBase64(
    imageFile: File,
    succesCallback: (base64string: string) => void,
    errorCallback: () => void
  ) {
    this.imageConverterService.toBase64(imageFile).subscribe({
      next: (value) => {
        if (value) {
          succesCallback(value as string);
        }
      },
      error: (_) => {
        errorCallback();
      },
    });
  }

  convertBase64toImageFile(
    base64string: string,
    succesCallback: (blob: Blob) => void,
    errorCallback: (error: any) => void
  ) {
    this.imageConverterService.toBlob(base64string).subscribe({
      next: (blob) => {
        succesCallback(blob);
      },
      error: (err) => {
        errorCallback(err);
      },
    });
  }

  goToPreview() {
    this.previewMode = true;
  }
}
