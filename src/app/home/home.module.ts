import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonNav } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ArchivePostPage } from '../templates/archive-post/archive-post.page';
import { ArchiveComponent } from './components/archive/archive.component';
import { SingleNewsComponent } from './components/single-news/single-news.component';
import { RoutedEventEmitterService } from '../services/routed-event-emitter/routed-event-emitter.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    
    RouterModule.forChild([
      {
        path: '',
        component: HomePage,
        children: [
          {
            path: 'archive/:id',
            component: ArchiveComponent
          }
        ]
      },
      {
        path: 'single/:id',
        component: SingleNewsComponent
      }
      ,

    ])
  ],
  declarations: [HomePage, ArchivePostPage, ArchiveComponent, SingleNewsComponent, ],
  providers : [RoutedEventEmitterService]
})
export class HomePageModule { }
