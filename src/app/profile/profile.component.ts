import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment as E} from "../../environments/environment.prod";

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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getProfile()
  }

  getProfile() {
    this.http.get(E.graph)
      .subscribe(profile => {
        this.profile = profile;
      });
  }

}
