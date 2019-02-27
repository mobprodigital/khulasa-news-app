import { NgModule } from '@angular/core';
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
    BrowserModule,
  ],
  exports: [
    ChooseLangComponent,
    SearchComponent
  ]
})
export class SharedModule { }
