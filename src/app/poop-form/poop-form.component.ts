import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpRequest} from "@angular/common/http";
import {FormControl, FormGroup} from "@angular/forms";
import {Poop} from "../models/poop";
import {UntypedFormBuilder} from "@angular/forms";
import {PoopService} from "../services/poop.service";
import {LocationService} from "../services/location.service";
import {Location} from "../models/location";
import {concatMap, Observable, tap} from "rxjs";
import {googleInterface} from "../models/google-interface";
import {keyframes} from "@angular/animations";
import {AuthService} from "@auth0/auth0-angular";
import {SharedDataService} from "../services/shared-data.service";
import {AyeUser} from "../interfaces/aye-user";

@Component({
  selector: 'app-poop-form',
  templateUrl: './poop-form.component.html',
  styleUrls: ['./poop-form.component.scss']
})
export class PoopFormComponent implements OnInit {

  loading = false;
  buttonText = ''
  locationPermission = true;
  unknownError = false;
  isTextLoaded = false;
  helpText = "";
  isLoggedIn = false;
  ayeUser: AyeUser | undefined;

  public poopLocation!: googleInterface;

  formData = this.formBuilder.group({
    name: '',
    description: '',
    rating: '',
    time: ''
  })

  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: UntypedFormBuilder,
    private poopService: PoopService,
    private locationService: LocationService,
    public auth: AuthService,
    private sharedDataService: SharedDataService,
  ) {
    this.buttonText = 'Submit';
    this.generateRandomHelpText();
    this.auth.isAuthenticated$.subscribe(
      (res) => {
        this.isLoggedIn = res;
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
                        this.ayeUser = res;
                        this.setAyeUser(ayeUser);
                      }
                    )
                  ).subscribe();
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

  ngOnInit(): void {
  }

  setAyeUser(ayeUser: AyeUser) {
    this.sharedDataService.setUser(ayeUser)
  }

  generateRandomHelpText(): void {
    const randomVal = Math.random() * 100;
    switch (true) {
      case (randomVal <= 25):
        this.helpText = "How's it going?";
        break;
      case (randomVal <= 50):
        this.helpText = "What's up?";
        break;
      case (randomVal <= 75):
        this.helpText = "You feeling alright?";
        break;
      default:
        this.helpText = "Tell me how you're feeling.";
    }

  }

  decodeLocation(longitude: number, latitude: number) {
    console.log(longitude, latitude);
    this.locationService.decodeLocation(longitude, latitude).subscribe((res: googleInterface) => {
        this.poopLocation = res;
        this.unknownError = false;
        console.log(this.poopLocation);
      },
      (err: any) => {
        this.unknownError = true;
        console.log(err);
      });
  }

  getLocation(): void {
    navigator.geolocation.getCurrentPosition((position) => {
        this.locationPermission = true;
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        this.decodeLocation(longitude, latitude);
      },
      (error) => {
        if (error.code == error.PERMISSION_DENIED) {
        }
        this.locationPermission = false;
      });
  }

  onSubmit(): void {
    let userId = this.ayeUser?.user_id || '';
    let description = this.formData.get('description')?.value;
    let rating = this.formData.get('rating')?.value;
    let date = new Date();

    if (rating == '') {
      rating = 0;
    }

    console.log(this.ayeUser)
    console.log(userId);
    if (this.poopLocation) {
      this.poopService.addPoops(userId, description, rating, date, this.poopLocation.fullAddr, this.poopLocation.longitude,
        this.poopLocation.latitude, this.poopLocation.street, this.poopLocation.city, this.poopLocation.longState,
        this.poopLocation.country, this.poopLocation.zipcode);
    } else {
      this.poopService.addPoops(userId, description, rating, date);
    }
    this.loading = true;
    this.buttonText = 'Submitting...';

    setTimeout(() => {
      this.loading = false;
      this.buttonText = "Submitted! Rerouting..."
    }, 1000)
    setTimeout(() => {
      this.router.navigate(['/poop-diaries'], {fragment: 'past-poops'}).then();
    }, 1750)
  }


}
