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
    context?: HttpContext
  }
): Observable<Array<Article>> {

    return this.getArticles$Response(params).pipe(
      map((r: StrictHttpResponse<Array<Article>>) => r.body as Array<Article>)
    );
  }

}
