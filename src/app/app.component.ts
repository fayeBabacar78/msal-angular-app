import {Component, Inject, OnInit} from '@angular/core';
import {MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService} from "@azure/msal-angular";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {filter} from "rxjs";
import {InteractionStatus, RedirectRequest} from "@azure/msal-browser";

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'msal-angular-app';
  isLoggedIn = false;
  isIframe = false;

  constructor(
    private authService: MsalService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private broadcastService: MsalBroadcastService) {
  }

  ngOnInit(): void {
    // false by default
    this.isIframe = window !== window.parent && !window.opener;
    this.broadcastService.inProgress$ // interaction status
      .pipe(filter((status: InteractionStatus) => status === InteractionStatus.None)) // no interaction
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.isLoggedIn = this.isSignedIn()
      })
  }

  isSignedIn() {
    return this.authService.instance.getAllAccounts().length > 0;
  }

  signIn() {
    if (this.msalGuardConfig.authRequest) { // authenticate user with configured scopes
      this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  async signOut() { // sign out using redirects
    await this.authService.logoutRedirect({
      postLogoutRedirectUri: 'http://localhost:4200'
    });
  }
}
