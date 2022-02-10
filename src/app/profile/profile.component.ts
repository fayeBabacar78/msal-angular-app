import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment as E} from "../../environments/environment.prod";
import {MsalService} from "@azure/msal-angular";

class ProfileType {
  givenName?: string;
  surname?: string;
  userPrincipalName?: string;
  id?: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile!: ProfileType;

  constructor(private http: HttpClient, private authService: MsalService) {

  }

  ngOnInit(): void {
    this.getProfile();
  }

  activeAccounts() {
    return this.authService.instance.getAllAccounts().length; // number of active sessions
  }

  getProfile() {
    this.http.get(E.graph)
      .subscribe(profile => {
        console.log(profile);
        this.profile = profile;
      });
  }

}
