import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgInputHighlighterModule } from 'ng-input-highlighter';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgInputHighlighterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
