import { Component, OnInit } from '@angular/core';
import {MsalBroadcastService} from "@azure/msal-angular";
import {filter} from "rxjs";
import {EventMessage, EventType, InteractionStatus} from "@azure/msal-browser";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AuthService} from "../services/auth.service";

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private broadcastService: MsalBroadcastService, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.broadcastService.msalSubject$
      .pipe(filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS))
      .pipe(untilDestroyed(this))
      .subscribe((_: EventMessage) => {
        console.log('Login is successful');
      });

    this.broadcastService.inProgress$ // interaction status
      .pipe(filter((status: InteractionStatus) => status === InteractionStatus.None)) // no interaction
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.authService.isSignedIn();
      })
  }

}
