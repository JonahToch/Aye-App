import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UntypedFormBuilder} from "@angular/forms";
import {SharedDataService} from "../../services/shared-data.service";
import {AuthService} from "@auth0/auth0-angular";
import {concatMap, Observable, tap} from "rxjs";
import {AyeUser} from "../../interfaces/aye-user";
import {Router} from "@angular/router";
import {SesameService} from "../../services/sesame.service";
import {Sesame} from "../../interfaces/sesame";

@Component({
  selector: 'app-sesame',
  templateUrl: './sesame.component.html',
  styleUrls: ['./sesame.component.scss']
})
export class SesameComponent {

  openSesameStatus = '';
  assigningSesameStatus = '';
  newSesameId = '';
  loading = false;
  assigningSesame = false;
  ayeUser: AyeUser | undefined;
  sesameArray$: Observable<Sesame[]>;

  formData = this.formBuilder.group({
    sesameId: '',
  })

  constructor(private http: HttpClient,
              private formBuilder: UntypedFormBuilder,
              private sharedDataService: SharedDataService,
              public auth: AuthService,
              private router: Router,
              private sesameService: SesameService,
  ) {
    this.auth.isAuthenticated$.subscribe((res) => {
      if (res) {
        this.sharedDataService.ayeUser$.subscribe(
          (res) => {
            if (res) {
              this.ayeUser = res;
              if (res.user_metadata === undefined || res.user_metadata.ayeUsername === undefined
                || !res.user_metadata.ayeUsername) {
                this.router.navigate(['/username-selection']).then();
              }
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
                      console.log(ayeUser);
                      this.setAyeUser(ayeUser);
                      this.ayeUser = ayeUser;
                      this.getSesame(this.ayeUser!.user_id).subscribe();
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
    });
    this.sesameArray$ = this.sesameService.sesameData$;
  }

  setAyeUser(ayeUser: AyeUser) {
    this.sharedDataService.setUser(ayeUser)
  }

  assignNewSesame() {
    this.assigningSesame = true;
    this.openSesameStatus = '';
  }


  getSesame(userId: string) {
    return this.sesameService.getSesame(userId);
  }

  claimSesame(userId: string) {
    this.loading = true;
    this.openSesameStatus = '';

    const body = {
      "sesameId": this.formData.get('sesameId')?.value,
      "userId": userId,
    }
    this.http.post('https://jonahtoch.com/api/v1/sesame', body).subscribe(
      {
        next: res => {
          console.log(res);
          this.assigningSesameStatus = 'success';
          this.assigningSesame = false;
        },
        error: err => {
          console.log(err);
          this.loading = false;
          this.assigningSesameStatus = 'failure';
        },
        complete: () => {
          this.loading = false;
        }
      }
    )
  }

  generateNewSesame(submodel: string) {
    if (!submodel) {
      return;
    }

    const body = {
      "sesameId": 'NEW',
      "submodel": submodel,
    }
  console.log(body);
    this.http.post('https://jonahtoch.com/api/v1/sesame', body).subscribe(
      {
        next: (res: any) => {
          console.log(res);
          this.newSesameId = res.sesame.sesameId;
        },
        error: err => {
          console.log(err);
        },
        complete: () => {
        }
      }
    )
  }


  openSesame() {
    this.loading = true;
    this.assigningSesameStatus = '';
    this.http.post('https://jonahtoch.com/api/v1/sesame', 'test').subscribe(
      {
        next: res => {
          console.log(res);
          this.openSesameStatus = 'success';
        },
        error: err => {
          this.loading = false;
          this.openSesameStatus = 'failure';
        },
        complete: () => {
          this.loading = false;
        }
      }
    )
  }

}
