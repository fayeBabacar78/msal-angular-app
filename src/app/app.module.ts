import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ProfileComponent} from './profile/profile.component';
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {
  MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalGuard, MsalInterceptor, MsalModule, MsalService
} from "@azure/msal-angular";
import {HomeComponent} from './home/home.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MsalGuardConfFactory, MsalInstanceFactory, MsalInterceptorConfFactory} from "../environments/msal.conf";

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MsalModule,
    MatButtonModule,
    MatToolbarModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: MSAL_INSTANCE,
      useFactory: MsalInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MsalGuardConfFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MsalInterceptorConfFactory
    },
    { // to allow acquiring tokens for outgoing requests
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard,
    MsalService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
