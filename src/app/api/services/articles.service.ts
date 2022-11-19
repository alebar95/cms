/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Article } from '../models/article';
import { CreateArticleDto } from '../models/create-article-dto';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getArticles
   */
  static readonly GetArticlesPath = '/articles';

  /**
   * Get all articles.
   *
   * get all articles
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getArticles()` instead.
   *
   * This method doesn't expect any request body.
   */
  getArticles$Response(params?: {
    '_page'?: number;
    '_limit'?: number;
    'q'?: string;
    '_sort'?: string;
    '_order'?: string;
    'category.name'?: Array<string>;
    'author.name'?: Array<string>;
    creation_date_lte?: number;
    creation_date_gte?: number;
    creation_date_ne?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<Article>>> {

    const rb = new RequestBuilder(this.rootUrl, ArticlesService.GetArticlesPath, 'get');
    if (params) {
      rb.query('_page', params['_page'], {"style":"form","explode":true});
      rb.query('_limit', params['_limit'], {"style":"form","explode":true});
      rb.query('q', params['q'], {"style":"form","explode":true});
      rb.query('_sort', params['_sort'], {"style":"form","explode":true});
      rb.query('_order', params['_order'], {"style":"form","explode":true});
      rb.query('category.name', params['category.name'], {"style":"form","explode":true});
      rb.query('author.name', params['author.name'], {"style":"form","explode":true});
      rb.query('creation_date_lte', params.creation_date_lte, {"style":"form","explode":true});
      rb.query('creation_date_gte', params.creation_date_gte, {"style":"form","explode":true});
      rb.query('creation_date_ne', params.creation_date_ne, {"style":"form","explode":true});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json; charset&#x3D;utf-8',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<Article>>;
      })
    );
  }

  /**
   * Get all articles.
   *
   * get all articles
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getArticles$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getArticles(params?: {
    '_page'?: number;
    '_limit'?: number;
    'q'?: string;
    '_sort'?: string;
    '_order'?: string;
    'category.name'?: Array<string>;
    'author.name'?: Array<string>;
    creation_date_lte?: number;
    creation_date_gte?: number;
    creation_date_ne?: number;
    context?: HttpContext
  }
): Observable<Array<Article>> {

    return this.getArticles$Response(params).pipe(
      map((r: StrictHttpResponse<Array<Article>>) => r.body as Array<Article>)
    );
  }

  /**
   * Path part for operation createArticle
   */
  static readonly CreateArticlePath = '/articles';

  /**
   * Add a new article.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createArticle()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createArticle$Response(params: {
    context?: HttpContext

    /**
     * Create article
     */
    body: CreateArticleDto
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ArticlesService.CreateArticlePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Add a new article.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `createArticle$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createArticle(params: {
    context?: HttpContext

    /**
     * Create article
     */
    body: CreateArticleDto
  }
): Observable<void> {

    return this.createArticle$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getArticleById
   */
  static readonly GetArticleByIdPath = '/articles/{articleId}';

  /**
   * Get article.
   *
   * get an article by its id
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getArticleById()` instead.
   *
   * This method doesn't expect any request body.
   */
  getArticleById$Response(params: {

    /**
     * Numeric ID of the article to delete
     */
    articleId: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Article>> {

    const rb = new RequestBuilder(this.rootUrl, ArticlesService.GetArticleByIdPath, 'get');
    if (params) {
      rb.path('articleId', params.articleId, {"style":"simple","explode":false});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json; charset&#x3D;utf-8',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Article>;
      })
    );
  }

  /**
   * Get article.
   *
   * get an article by its id
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getArticleById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getArticleById(params: {

    /**
     * Numeric ID of the article to delete
     */
    articleId: number;
    context?: HttpContext
  }
): Observable<Article> {

    return this.getArticleById$Response(params).pipe(
      map((r: StrictHttpResponse<Article>) => r.body as Article)
    );
  }

  /**
   * Path part for operation editArtcileById
   */
  static readonly EditArtcileByIdPath = '/articles/{articleId}';

  /**
   * Edit article.
   *
   * Edit article
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `editArtcileById()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  editArtcileById$Response(params: {

    /**
     * Numeric ID of the article to edit
     */
    articleId: number;
    context?: HttpContext

    /**
     * Edit article
     */
    body: CreateArticleDto
  }
): Observable<StrictHttpResponse<Article>> {

    const rb = new RequestBuilder(this.rootUrl, ArticlesService.EditArtcileByIdPath, 'put');
    if (params) {
      rb.path('articleId', params.articleId, {"style":"simple","explode":false});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json; charset&#x3D;utf-8',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Article>;
      })
    );
  }

  /**
   * Edit article.
   *
   * Edit article
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `editArtcileById$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  editArtcileById(params: {

    /**
     * Numeric ID of the article to edit
     */
    articleId: number;
    context?: HttpContext

    /**
     * Edit article
     */
    body: CreateArticleDto
  }
): Observable<Article> {

    return this.editArtcileById$Response(params).pipe(
      map((r: StrictHttpResponse<Article>) => r.body as Article)
    );
  }

  /**
   * Path part for operation deleteArticle
   */
  static readonly DeleteArticlePath = '/articles/{articleId}';

  /**
   * Delete article.
   *
   * delete an article by its id
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteArticle()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteArticle$Response(params: {

    /**
     * Numeric ID of the article to delete
     */
    articleId: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Article>> {

    const rb = new RequestBuilder(this.rootUrl, ArticlesService.DeleteArticlePath, 'delete');
    if (params) {
      rb.path('articleId', params.articleId, {"style":"simple","explode":false});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json; charset&#x3D;utf-8',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Article>;
      })
    );
  }

  /**
   * Delete article.
   *
   * delete an article by its id
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `deleteArticle$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteArticle(params: {

    /**
     * Numeric ID of the article to delete
     */
    articleId: number;
    context?: HttpContext
  }
): Observable<Article> {

    return this.deleteArticle$Response(params).pipe(
      map((r: StrictHttpResponse<Article>) => r.body as Article)
    );
  }

}
