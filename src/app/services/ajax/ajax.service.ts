import { Injectable, isDevMode } from '@angular/core';
import { HttpParams, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppLangService } from '../choose-lang/choose-lang.service';
import { AppLanguageEnum } from 'src/app/interfaces/app-lang.enum';
import { Network } from '@ionic-native/network/ngx';

@Injectable({
  providedIn: 'root'
})
export class AjaxService {


  private readonly baseUrl: {
    hindi: string;
    english: string
  } = {
      english: 'https://khulasa-news.com/wp-admin/admin-ajax.php',
      hindi: 'https://hindi.khulasa-news.com/wp-admin/admin-ajax.php'
    };

  private activeBaseUrl: string = this.baseUrl.english;

  constructor(
    private http: HttpClient,
    private appLangService: AppLangService,
    private network: Network,
  ) {
    if (this.appLangService.selectedLang === AppLanguageEnum.English) {
      this.activeBaseUrl = this.baseUrl.english;
    } else {
      this.activeBaseUrl = this.baseUrl.hindi;
    }
  }


  public get(params: HttpParams): Promise<any> {

    return new Promise((resolve, reject) => {
      if (this.network.type === 'none') {
        reject('Please connect to internet');
      } else {
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
            // reject(err.message);
            reject('something went wrong. Please try again later.');
          },
        );
      }
    });
  }
  public post(params: any, baseUrl?: string): Promise<any> {

    return new Promise((resolve, reject) => {
      if (this.network.type === 'none') {
        reject('Please connect to internet');
      } else {
        this.http.post(baseUrl, JSON.stringify(params)).subscribe(
          ((resp: any) => {
            console.log('fcm success ', resp);
            if (resp.status === 200) {
              resolve(resp.data);
            } else {
              reject(resp.message);
            }
          }),
          (err: HttpErrorResponse) => {
            console.log('fcm err ', err);
            // reject(err.message);
            reject('something went wrong. Please try again later.');
          },
        );
      }
    });
  }

}
