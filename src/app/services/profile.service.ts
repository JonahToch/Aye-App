import {Injectable} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {Auth0Client} from '@auth0/auth0-spa-js';
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {Poop} from "../models/poop";
import {AyeUser} from "../interfaces/aye-user";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  private profileList_: BehaviorSubject<any> = new BehaviorSubject(null);
  profileList$: Observable<any> = this.profileList_.asObservable();


  constructor(public auth: AuthService,
              private http: HttpClient,
  ) {
  }

  updateUserMetadata(ayeUser: AyeUser | undefined, userId: string | undefined, authToken: string | undefined): void {
    // const url: string = `${environment.mainApiUrl}/users`;
    const url = 'https://dev-mn6falogt3c14mat.us.auth0.com/api/v2/users/' + userId
    // const body = {
    //     "bio": '555',
    //     "updateUrl": 'https://dev-mn6falogt3c14mat.us.auth0.com/api/v2/users/' + userId,
    //     "authToken": authToken
    // }

    const body = {
      user_metadata: {
        "bio": 'test123',
      }
    }

    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken,
        },
      )
    };


    console.log(url);
    console.log(body);
    // console.log(httpOptions);
    console.log(authToken);

    this.http.patch<any>(url, body, httpOptions).subscribe(
      (value) => {
        console.log(value);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAllUsers(userId: string | undefined, authToken: string | undefined): Observable<any> {
    const url = 'https://dev-mn6falogt3c14mat.us.auth0.com/api/v2/users?q=email%3A%22jane%40exampleco.com%22&search_engine=v3'
    console.log(userId, authToken);

    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + authToken,
        "Access-Control-Allow-Origin": "*",
      })
    }

    return this.http.get<Observable<any>>(url, httpOptions);
    // console.log('after');
  }


  getProfile(userId: string | undefined, authToken: string | undefined): Observable<any> {
    const url = 'https://dev-mn6falogt3c14mat.us.auth0.com/api/v2/users/' + userId
    console.log(userId, authToken);

    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + authToken,
        "Access-Control-Allow-Origin": "*",
      })
    }

    return this.http.get<Observable<any>>(url, httpOptions);
    // console.log('after');
  }






}
