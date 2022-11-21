/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext, HttpEvent } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { CreateImageDto } from '../models/create-image-dto';
import { Image } from '../models/image';

@Injectable({
  providedIn: 'root',
})
export class ImagesService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getImages
   */
  static readonly GetImagesPath = '/images';

  /**
   * Get all images.
   *
   * get all images
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getImages()` instead.
   *
   * This method doesn't expect any request body.
   */
  getImages$Response(params?: {
    '_page'?: number;
    '_limit'?: number;
    'q'?: string;
    '_sort'?: string;
    '_order'?: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<Image>>> {

    const rb = new RequestBuilder(this.rootUrl, ImagesService.GetImagesPath, 'get');
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
        return r as StrictHttpResponse<Array<Image>>;
      })
    );
  }

  /**
   * Get all images.
   *
   * get all images
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getImages$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getImages(params?: {
    '_page'?: number;
    '_limit'?: number;
    'q'?: string;
    '_sort'?: string;
    '_order'?: string;
    context?: HttpContext
  }
): Observable<Array<Image>> {

    return this.getImages$Response(params).pipe(
      map((r: StrictHttpResponse<Array<Image>>) => r.body as Array<Image>)
    );
  }

  /**
   * Path part for operation createImage
   */
  static readonly CreateImagePath = '/images';

  /**
   * Add a new image.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createImage()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createImage$Response(params: {
    context?: HttpContext

    /**
     * Create image
     */
    body: CreateImageDto
  }
): Observable<StrictHttpResponse<Image>> {

    const rb = new RequestBuilder(this.rootUrl, ImagesService.CreateImagePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json; charset&#x3D;utf-8',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Image>;
      })
    );
  }

  /**
   * Add a new image.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `createImage$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createImage(params: {
    context?: HttpContext

    /**
     * Create image
     */
    body: CreateImageDto
  }
): Observable<Image> {

    return this.createImage$Response(params).pipe(
      map((r: StrictHttpResponse<Image>) => r.body as Image)
    );
  }

  /**
   * Path part for operation getImageById
   */
  static readonly GetImageByIdPath = '/images/{imageId}';

  /**
   * Get image.
   *
   * get an image by its id
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getImageById()` instead.
   *
   * This method doesn't expect any request body.
   */
  getImageById$Response(params: {

    /**
     * Numeric ID of the image to get
     */
    imageId: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Image>> {

    const rb = new RequestBuilder(this.rootUrl, ImagesService.GetImageByIdPath, 'get');
    if (params) {
      rb.path('imageId', params.imageId, {"style":"simple","explode":false});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json; charset&#x3D;utf-8',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Image>;
      })
    );
  }

  /**
   * Get image.
   *
   * get an image by its id
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getImageById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getImageById(params: {

    /**
     * Numeric ID of the image to get
     */
    imageId: number;
    context?: HttpContext
  }
): Observable<Image> {

    return this.getImageById$Response(params).pipe(
      map((r: StrictHttpResponse<Image>) => r.body as Image)
    );
  }

    /**
   * Add a new image  returning progress events
   *
   *
   *  This method creates image sending as a reposnse the upload progress
   */
     createImage$ResponseProgressEvent(params: {
      context?: HttpContext
      /**
       * Create image
       */
      body: CreateImageDto
    }
  ): Observable<HttpEvent<any>> {

      const rb = new RequestBuilder(this.rootUrl, ImagesService.CreateImagePath, 'post');
      if (params) {
        rb.body(params.body, 'application/json');
      }

      return this.http.request(rb.build({
        responseType: 'text',
        reportProgress: true,
        accept: '*/*',
        context: params?.context,
      }));
    }

}


