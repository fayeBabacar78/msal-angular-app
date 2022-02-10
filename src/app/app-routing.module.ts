import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProfileComponent} from "./profile/profile.component";
import {MsalGuard} from "@azure/msal-angular";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'profile', component: ProfileComponent, canActivate: [MsalGuard]},
  {path: 'home', component: HomeComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
