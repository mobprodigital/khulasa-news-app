import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpErrorResponse } from "@angular/common/http";

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

  constructor(private http: HttpClient) { }


  public get(params: HttpParams): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl.english, {
        params: params
      }).subscribe(
        ((resp : any) => {
          if(resp.status === 200){
            resolve(resp.data);
          }
          else{
            reject(resp.message);
          }
        }),
        (err : HttpErrorResponse) => {
          reject(err.message);
        },
        () => {
          console.log('completed');
        }
      )
    })
  }

}
