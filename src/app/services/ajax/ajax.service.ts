import { Injectable } from '@angular/core';
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
      english: 'http://khulasa-news.com/wp-admin/admin-ajax.php',
      hindi: 'http://hindi.khulasa-news.com/wp-admin/admin-ajax.php'
    };

  private activeBaseUrl: string = this.baseUrl.english;

  constructor(
    private http: HttpClient,
    private appLangService: AppLangService,
    private network: Network,
  ) {
    if (appLangService.selectedLang === AppLanguageEnum.English) {
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
            reject(err.message);
          },
        );
      }
    });
  }

}
