import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AjaxService {


  private readonly baseUrl: {
    hindi: string;
    english: string
  } = {
      english: 'http://khulasa-news.com/wp-admin/admin-ajax.php',
      hindi: 'http://hindi.khulasa-news.com/wp-admin/admin-ajax.php'
    };

  private activeBaseUrl: string = localStorage.getItem('lang') === 'hin' ? this.baseUrl.hindi : this.baseUrl.english;

  constructor(private http: HttpClient) { }


  public get(params: HttpParams): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.activeBaseUrl, {
        params: params,
      }).subscribe(
        ((resp: any) => {
          if (resp.status === 200) {
            resolve(resp.data);
          } else {
            reject(resp.message);
          }
        }),
        (err: HttpErrorResponse) => {
          reject(err.message);
        },
      );
    });
  }

}
