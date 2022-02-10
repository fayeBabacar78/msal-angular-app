import {Component, OnInit} from '@angular/core';
import {MsalService} from "@azure/msal-angular";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'msal-angular-app';
  isLoggedIn = false;

  constructor(private authService: MsalService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.isSignedIn();
  }

  activeAccounts() {
    return this.authService.instance.getAllAccounts().length; // number of active sessions
  }

  isSignedIn() {
    return this.authService.instance.getActiveAccount() !== null;
  }

  async signIn() {
    await this.authService.loginPopup().pipe(untilDestroyed(this)).subscribe({
        next: (authResult) => {
          window.location.pathname = '/profile'; // reload ui
          this.authService.instance.setActiveAccount(authResult.account)
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }

  async signOut() {
    await this.authService.logoutPopup({
      mainWindowRedirectUri: "/home"
    });
  }
}
