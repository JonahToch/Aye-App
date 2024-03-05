import {Component} from '@angular/core';
import {googleInterface} from "../../models/google-interface";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {PoopService} from "../../services/poop.service";
import {LocationService} from "../../services/location.service";
import {SharedDataService} from "../../services/shared-data.service";
import {AyeUser} from "../../interfaces/aye-user";
import {ProfileService} from "../../services/profile.service";
import {concatMap, tap} from "rxjs";
import {AuthService} from "@auth0/auth0-angular";

@Component({
  selector: 'app-username-selection',
  templateUrl: './username-selection.component.html',
  styleUrls: ['./username-selection.component.scss']
})
export class UsernameSelectionComponent {

  loading = false;
  minUsernameLength = 2;
  maxUsernameLength = 20
  usernameChosen = false;
  usernameTaken = false;
  ayeUser: AyeUser | undefined;

  usernameForm = this.formBuilder.group({
    username: '',
  })

  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: UntypedFormBuilder,
    private poopService: PoopService,
    private sharedDataService: SharedDataService,
    private profileService: ProfileService,
    public auth: AuthService,
  ) {
    this.auth.isAuthenticated$.subscribe((res) => {
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
                      this.ayeUser = ayeUser;
                      if (this.ayeUser?.user_metadata.ayeUsername) {
                        this.router.navigate(['/']).then();
                      }
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
    })
  }

  ngOnInit(): void {
    this.usernameForm = this.formBuilder.group({
      username: ['', [
        Validators.minLength(1),
        Validators.maxLength(this.maxUsernameLength),
        Validators.pattern(/^[a-zA-Z0-9_-]+$/), // Regular expression for alphanumeric, underscore, and hyphen
      ]]
    });
  }

  setAyeUser(ayeUser: AyeUser) {
    this.sharedDataService.setUser(ayeUser)
  }


  isUsernameTaken() {
    return this.usernameTaken;
  }

  userTyping() {
    this.usernameTaken = false;
  }

  hasWhiteSpace() {
    return this.usernameForm.get('username')?.value === '';
  }

  assignUsername(username: string) {
    return this.sharedDataService.getManagementAuthToken().subscribe(
      (res) => {
        this.sharedDataService.getUser(username, res.access_token).subscribe(
          (res) => {
            console.log(res);
            if (res.length === 0) {
              this.usernameChosen = true;
              this.createMetadata(this.ayeUser?.user_id, res.access_token);
            } else {
              this.usernameTaken = true;
            }
          }
        )
      }
    );
  }

  createMetadata(userId: string | undefined, authToken: string | undefined) {

    this.ayeUser!.user_metadata = {
      ayeUsername: this.usernameForm.get('username')?.value,
      bio: '',
      seinfeld: '',
      profileCode: 0,
      profilePicUrl: '',
    }
    this.profileService.createUsername(this.ayeUser, userId, authToken).subscribe(
      (res) => {
        this.usernameChosen = true;
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );

  }

  goToProfile(): void {
    this.router.navigate(['/@' + this.usernameForm.value.username]).then();
  }

  submitForm(): void {
    this.usernameTaken = false;
    if (this.usernameForm.valid) {
      // Handle form submission
      console.log('Submitted username:', this.usernameForm.value.username);
      this.assignUsername(this.usernameForm.get('username')?.value);
    }
  }
}
