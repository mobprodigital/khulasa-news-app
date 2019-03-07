import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ArchiveComponent } from './components/archive/archive.component';
import { SingleNewsComponent } from './components/single-news/single-news.component';
import { SharedModule } from '../shared/shared.module';
import { AdMobFree } from '@ionic-native/admob-free/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([

      {
        path: ':categoryId',
        component: ArchiveComponent,
      },
      {
        path: '',
        component: ArchiveComponent,
      },
    ])
  ],
  entryComponents: [SingleNewsComponent],
  declarations: [HomePage, ArchiveComponent, SingleNewsComponent],
  providers: [AdMobFree]
})
export class HomePageModule { }
