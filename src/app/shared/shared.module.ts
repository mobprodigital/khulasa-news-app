import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ChooseLangComponent } from './components/choose-lang/choose-lang.component';
import { FormsModule } from '@angular/forms';
import { ArchivePostPage } from './components/archive-post/archive-post.page';
import { SingalPageComponent } from './components/singal-page/singal-page.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@NgModule({
  entryComponents: [
    ChooseLangComponent,
    SingalPageComponent
  ],
  declarations: [
    ChooseLangComponent,
    ArchivePostPage,
    SingalPageComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    ChooseLangComponent,
    ArchivePostPage
  ],
  providers: [InAppBrowser]
})
export class SharedModule { }
