import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}
    requestJSON(requestBody, endpoint): Observable<HttpResponse<any>> {
      return this.http.post<HttpResponse<any>>(endpoint, requestBody, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }), observe: 'response'
      })
        .map((res: HttpResponse<any>) => res.body || {})
        .catch((error: any) => Observable.throw(error.json()));
    }
    // requestPage(requestBody, endpoint): Observable<HttpResponse<Post[]>> {
    // return this.http.post<HttpResponse<Post[]>>(endpoint, requestBody, {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json'
    //   }), observe: 'response'
    // })
    //   .map((res) => res.body || {})
    //   .catch((error: any) => Observable.throw(error.json()));
    // }

  requestPage(requestBody, endpoint): Observable<Blog> {
    return this.http.post<Blog>(endpoint, requestBody, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .map((res: any) => res || {})
      .catch((error: any) => Observable.throw(error.json()));
  }

  requestPost(requestBody, endpoint): Observable<Post> {
    return this.http.post<Blog>(endpoint, requestBody, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .map((res: any) => res[0] || {}) // If successful, API function returns an array [] with 1 element
      .catch((error: any) => Observable.throw(error.json()));
  }

  publish(requestBody: Post, endpoint): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(endpoint, requestBody, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .map((res: any) => res || {}) // If successful, API function returns an array [] with 1 element
      .catch((error: any) => Observable.throw(error.json()));
  }
}

export interface StatusMessage {
  statusCode: number,
  message: string
}

export interface ApiResponse {
  items: StatusMessage[]
}

export interface PostHeader {
  author: string,
  title: string,
  excerpt: string
}

export interface Post {
  sortKey: number,
  slug: string,
  header: PostHeader,
  image: {
    width?: number,
    height?: number,
    url: string,
    alt: string,
    css?: any
  },
  article: Part[]
}

export interface Part {
  type: string,
  url?: string,
  alt?: string,
  text?: string,
  width?: number,
  height?: number,
  subtitle?: string,
  css?: string
}

export interface Blog {
  pages: number,
  pageSize: number,
  currentPage: number,
  posts: Post[]
}
