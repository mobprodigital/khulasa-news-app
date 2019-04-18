import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ChooseLangComponent } from './components/choose-lang/choose-lang.component';
import { FormsModule } from '@angular/forms';
import { ArchivePostPage } from './components/archive-post/archive-post.page';
import { SingalPageComponent } from './components/singal-page/singal-page.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CheckUpdateComponent } from './components/check-update/check-update.component';

@NgModule({
  entryComponents: [
    ChooseLangComponent,
    SingalPageComponent,
    CheckUpdateComponent
  ],
  declarations: [
    ChooseLangComponent,
    ArchivePostPage,
    SingalPageComponent,
    CheckUpdateComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    ChooseLangComponent,
    ArchivePostPage,
    CheckUpdateComponent
  ],
  providers: [InAppBrowser]
})
export class SharedModule { }
