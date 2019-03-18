import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ChooseLangComponent } from './components/choose-lang/choose-lang.component';
import { SearchComponent } from './components/search/search.component';
import { FormsModule } from '@angular/forms';
import { ArchivePostPage } from './components/archive-post/archive-post.page';
import { SingalPageComponent } from './components/singal-page/singal-page.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@NgModule({
  entryComponents: [
    ChooseLangComponent,
    SearchComponent,
    SingalPageComponent
  ],
  declarations: [
    ChooseLangComponent,
    SearchComponent,
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
    SearchComponent,
    ArchivePostPage
  ],
  providers: [InAppBrowser]
})
export class SharedModule { }
