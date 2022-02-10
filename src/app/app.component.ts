import {Component, Inject, OnInit} from '@angular/core';
import {MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService} from "@azure/msal-angular";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AuthenticationResult, PopupRequest} from "@azure/msal-browser";

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'msal-angular-app';
  isLoggedIn = false;

  constructor(
    private authService: MsalService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.isSignedIn();
    console.log(this.isLoggedIn); // false when no sign in
  }

  signIn() {
    if (this.msalGuardConfig.authRequest) { // authenticate user with configured scopes
      this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest).pipe(untilDestroyed(this))
        .subscribe(
          {
            next: (authResult) => {
              this.setActiveAccount(authResult);
            },
            error: (error) => {
              console.log(error);
            }
          })
    } else {
      this.authService.loginPopup().pipe(untilDestroyed(this)).subscribe({
        next: (authResult) => {
          this.setActiveAccount(authResult);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  isSignedIn() {
    return this.authService.instance.getActiveAccount() !== null;
  }

  setActiveAccount(authResult: AuthenticationResult) {
    this.authService.instance.setActiveAccount(authResult.account);
    this.isLoggedIn = this.isSignedIn();
  }

  async signOut() {
    await this.authService.logoutPopup({
      mainWindowRedirectUri: '/'
    });
  }
}
