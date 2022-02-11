import {Inject, Injectable} from '@angular/core';
import {MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService} from '@azure/msal-angular';
import {AuthenticationResult, InteractionType, PopupRequest, PublicClientApplication} from '@azure/msal-browser';
import {User} from '../user.model';
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Client} from '@microsoft/microsoft-graph-client';
import {
  AuthCodeMSALBrowserAuthenticationProvider
} from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import {MSAL} from "../../environments/msal.conf";

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})

export class AuthService {

  public authenticated = false;
  public graphClient?: Client;

  constructor(private msalService: MsalService, @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration) {
    this.isSignedIn();
  }

  // Prompt the user to sign in and
  // grant consent to the requested permission scopes
  async signIn() {
    await this.msalService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: async (authResult) => {
          this.setActiveAccount(authResult);
        },
        error: (error) => {
          console.log(error);
        }
      })
  }

  signOut() {
    this.msalService.logoutPopup({
      mainWindowRedirectUri: '/'
    });
  }

  setActiveAccount(authResult: AuthenticationResult) {
    this.msalService.instance.setActiveAccount(authResult.account);
    this.isSignedIn(); // authenticated is true
  }

  isSignedIn() {
    this.authenticated = this.msalService.instance.getActiveAccount() !== null;
  }

  async getUser(): Promise<User | undefined> {

    if (!this.authenticated) return undefined;

    const instance = this.msalService.instance as PublicClientApplication;
    const options = {
      account: this.msalService.instance.getActiveAccount()!,
      scopes: MSAL.scopes,
      interactionType: InteractionType.Popup
    }

    // Create an authentication provider for the current user
    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(instance, options);

    // Initialize the Graph client
    this.graphClient = Client.initWithMiddleware({authProvider: authProvider});

    // Get the user from Graph (GET /me)
    const graphUser: MicrosoftGraph.User = await this.graphClient
      .api('/me').select('displayName,mail,userPrincipalName').get(); // returns a promise

    const user = new User();
    user.displayName = graphUser.displayName ?? '';
    // Prefer the mail property, but fall back to userPrincipalName
    user.email = graphUser.mail ?? graphUser.userPrincipalName ?? '';
    user.timeZone = graphUser.mailboxSettings?.timeZone ?? 'UTC';
    user.avatar = graphUser.photo;

    return user;
  }
}
