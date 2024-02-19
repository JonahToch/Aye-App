import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TrophyDialogComponent} from "../dialogs/trophy-dialog/trophy-dialog.component";
import {MatTooltip} from "@angular/material/tooltip";
import {NavigationEnd, Router} from "@angular/router";
import {AuthService} from "@auth0/auth0-angular";
import {ProfileService} from "../services/profile.service";
import {BehaviorSubject, concatMap, filter, map, Observable, of, Subscription, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AyeUser} from "../interfaces/aye-user";
import {SharedDataService} from "../services/shared-data.service";
import {DateService} from "../services/date.service";
import {QRCodeModule} from "angularx-qrcode";
import {QrCodeComponent} from "../dialogs/qr-code/qr-code/qr-code.component";
import {
  LocationExplanationComponent
} from "../dialogs/location-explanation/location-explanation/location-explanation.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  routerSubscription!: Subscription;

  userNotFound: boolean = false;
  loading: boolean = false;
  invalidImageError: boolean = false;
  profileUsername: string = '';
  profileChangesMade: boolean = false;

  newProfilePicUrl: string = '';
  editingBio: boolean = false;
  newBio: string = '';

  fullProfileUrl: string;
  ayeUser: AyeUser | undefined;

  private profileList_: BehaviorSubject<any> = new BehaviorSubject(null);
  profileList$: Observable<any> = this.profileList_.asObservable();


  constructor(public dialog: MatDialog,
              public auth: AuthService,
              public profileService: ProfileService,
              private http: HttpClient,
              private router: Router,
              private sharedDataService: SharedDataService,
              private dateService: DateService,
  ) {
    this.loading = true;
    this.fullProfileUrl = window.location.href;
    this.auth.isAuthenticated$.subscribe(
      (res) => {
        if (res) {
          this.sharedDataService.ayeUser$.subscribe(
            (res) => {
              if (res) {
                this.ayeUser = res;
              } else {
                this.auth.user$
                  .pipe(
                    concatMap((user: any) =>
                      this.http.get(
                        // @ts-ignore
                        encodeURI(`https://dev-mn6falogt3c14mat.us.auth0.com/api/v2/users/${user.sub}`)
                      )
                    ),
                    tap((ayeUser: any) => {
                        this.setAyeUser(ayeUser);
                      }
                    )
                  )
                  .subscribe();
              }
            },
            (error) => {
              console.log(error);
            },
          )
        }
      }
    )
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();

  }

  ngOnInit(): void {

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      console.log(event.url.substring(2, event.url.length));
      console.log(this.profileUsername)
      if (this.profileUsername !== event.url.substring(2, event.url.length)) {
        window.location.reload();
      }
    });

    if (this.router.url.substring(0, 2) !== '/@') {
      this.router.navigate(['/']).then();
    }
    this.profileUsername = this.router.url.substring(2, this.router.url.length);
    this.getManagementAuthToken();
  }

  setAyeUser(ayeUser: AyeUser) {
    this.sharedDataService.setUser(ayeUser)
  }

  handleImageError() {
    this.invalidImageError = true;
    this.ayeUser!.user_metadata.profilePicUrl = '/assets/images/goblin-silhouette.png';
  }

  changeBio(event: any) {
    this.newBio = event.target.value;
    this.profileChangesMade = true;
  }

  changeProfilePic(event: any) {
    this.invalidImageError = false;
    this.newProfilePicUrl = event.target.value;
    this.profileChangesMade = true;
  }

  openQRCodeDialog(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "550px";
    dialogConfig.width = "95%"

    this.dialog.open(QrCodeComponent, dialogConfig);
  }

  updateProfile(userId: string | undefined, authToken: string | undefined) {
    if (this.newBio) {
      this.ayeUser!.user_metadata!.bio = this.newBio;
    }
    if (this.newProfilePicUrl) {
      this.ayeUser!.user_metadata!.profilePicUrl = this.newProfilePicUrl;
    }

    this.profileService.updateUserMetadata(this.ayeUser, userId, authToken);

    this.editingBio = false;
    this.profileChangesMade = false;
  }

  redirectToHome() {
    this.router.navigate(['/']).then();
  }

  toStandardDate(date: Date): string {
    return this.dateService.toStandardDate(date);
  }

  getManagementAuthToken() {
    return this.sharedDataService.getManagementAuthToken().subscribe(
      (res): void => {
        this.sharedDataService.getUser(this.profileUsername, res.access_token).subscribe(
          (res): void => {
            console.log(res); // wonah
            if (res.length === 0) {
              this.userNotFound = true;
            } else {
              this.ayeUser = res[0];
            }
          },
          (error): void => {
            console.log(error);
          },
          () => {
            this.loading = false;
          }
        )
      }
    );
  }

}
