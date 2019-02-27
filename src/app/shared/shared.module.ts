import { NgModule } from '@angular/core';
import { IonicModule} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ChooseLangComponent } from './components/choose-lang/choose-lang.component';
import { SearchComponent } from './components/search/search.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  entryComponents: [
    ChooseLangComponent,
    SearchComponent
  ],
  declarations: [
    ChooseLangComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    BrowserModule,
  ],
  exports: [
    ChooseLangComponent,
    SearchComponent
  ]
})
export class SharedModule { }
