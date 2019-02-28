import { NgModule } from '@angular/core';
import { IonicModule} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ChooseLangComponent } from './components/choose-lang/choose-lang.component';
import { SearchComponent } from './components/search/search.component';
import { FormsModule } from '@angular/forms';
import { ArchivePostPage } from './components/archive-post/archive-post.page';

@NgModule({
  entryComponents: [
    ChooseLangComponent,
    SearchComponent
  ],
  declarations: [
    ChooseLangComponent,
    SearchComponent,
    ArchivePostPage
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
  ]
})
export class SharedModule { }
