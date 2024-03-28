import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {Poop} from "../models/poop";
import {environment} from "../../environments/environment.prod";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppMetadata, AyeUser, Identity, UserMetadata} from "../interfaces/aye-user";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private managementAuthToken_: BehaviorSubject<any> = new BehaviorSubject(null);
  managementAuthToken$: Observable<any> = this.managementAuthToken_.asObservable();

  private ayeUser_: BehaviorSubject<AyeUser | undefined> = new BehaviorSubject<AyeUser | undefined>(undefined);
  ayeUser$: Observable<AyeUser | undefined> = this.ayeUser_.asObservable();

  private userCache: Map<string, any> = new Map();

  constructor(
    private http: HttpClient,
  ) {
  }

  get isDevMode(): string | null {
    return localStorage.getItem('ayeApp-isDevMode');
  }

  set isDevMode(value: string | null) {
    if (value !== null) {
      localStorage.setItem('ayeApp-isDevMode', 'true');
    } else {
      localStorage.removeItem('ayeApp-isDevMode');
    }

  }

  getManagementAuthToken(): Observable<any> {
    if (this.managementAuthToken_.getValue()) {
      return this.managementAuthToken$;
    }
    const url: string = `${environment.mainApiUrl}/auth`;
    return this.http.get(url).pipe((res) => {
      res.subscribe((res: any) => {
        this.managementAuthToken_.next(res);
      })
      return res;
    })
  }

  getUser(username: string, managementAuthToken: string): Observable<any> {
    const url: string = `${environment.mainApiUrl}/users?type=isUsernameUnique&username=` + username + `&token=` + managementAuthToken;
    return this.http.get(url).pipe((res) => {
      return res;
    });
  }

  getUserById(userId: string, managementAuthToken: string) {

    const cacheKey = userId;

    if (this.userCache.has(cacheKey)) {
      return of(this.userCache.get(cacheKey));
    }
    const url: string = `${environment.mainApiUrl}/users2?type=getUserById&userId=` + userId + `&token=` + managementAuthToken;
    // const url = 'https://dev-mn6falogt3c14mat.us.auth0.com/api/v2/users/auth0%7C65e174d4a54d24662c0b9725';
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + managementAuthToken,
        },
      )
    };
    return this.http.get(url, httpOptions).pipe(
      map(data => {
        // Store data in cache
        this.userCache.set(userId, data);
        return data;
      }),
      catchError(error => {
        // Handle error gracefully
        console.error('Error fetching user data:', error);
        this.userCache.set(userId, null);
        return of(null);
      }))
  }

  setUser(ayeUser: AyeUser) {
    this.ayeUser_.next(ayeUser);
  }

  isLoggedInUserData() {
    return !!this.ayeUser_;
  }

}
