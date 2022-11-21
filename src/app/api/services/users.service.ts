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

import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getUsers
   */
  static readonly GetUsersPath = '/users';

  /**
   * get all users
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUsers()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUsers$Response(params?: {
    '_page'?: number;
    '_limit'?: number;
    'q'?: string;
    '_sort'?: string;
    '_order'?: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<User>>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.GetUsersPath, 'get');
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
        return r as StrictHttpResponse<Array<User>>;
      })
    );
  }

  /**
   * get all users
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUsers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUsers(params?: {
    '_page'?: number;
    '_limit'?: number;
    'q'?: string;
    '_sort'?: string;
    '_order'?: string;
    context?: HttpContext
  }
): Observable<Array<User>> {

    return this.getUsers$Response(params).pipe(
      map((r: StrictHttpResponse<Array<User>>) => r.body as Array<User>)
    );
  }

  /**
   * Path part for operation getUserById
   */
  static readonly GetUserByIdPath = '/users/{userId}';

  /**
   * Get user.
   *
   * get a user by its id
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserById()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserById$Response(params: {

    /**
     * Numeric ID of the user to get
     */
    userId: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<User>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.GetUserByIdPath, 'get');
    if (params) {
      rb.path('userId', params.userId, {"style":"simple","explode":false});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json; charset&#x3D;utf-8',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<User>;
      })
    );
  }

  /**
   * Get user.
   *
   * get a user by its id
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserById(params: {

    /**
     * Numeric ID of the user to get
     */
    userId: number;
    context?: HttpContext
  }
): Observable<User> {

    return this.getUserById$Response(params).pipe(
      map((r: StrictHttpResponse<User>) => r.body as User)
    );
  }

}
