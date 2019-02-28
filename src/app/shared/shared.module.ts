import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChooseLangComponent } from './components/choose-lang/choose-lang.component';
import { SearchComponent } from './components/search/search.component';
import { BrowserModule } from '@angular/platform-browser';
import { SingalPageComponent } from './components/singal-page/singal-page.component';
import { IonicModule, IonNav } from '@ionic/angular';
@NgModule({
  entryComponents: [
    ChooseLangComponent,
    SearchComponent,
    SingalPageComponent
  ],
  declarations: [
    ChooseLangComponent,
    SearchComponent,
    SingalPageComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule,
  ],
  exports: [
    ChooseLangComponent,
    SearchComponent,
    SingalPageComponent
  ]
})
export class SharedModule { }
