import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarPopupComponent, CyrusCalendarDirective } from '../../libs/cyrus-calendar/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DocsComponent } from './docs/docs.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    CalendarPopupComponent,
    CyrusCalendarDirective,
    DocsComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
