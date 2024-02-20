import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GoblinDatingSimulatorComponent} from './goblin-dating-simulator/goblin-dating-simulator.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {AyesAndBaesComponent} from './ayes-and-baes/ayes-and-baes.component';
import {PoopDiariesComponent} from './poop-diaries/poop-diaries.component';
import {BerglerComponent} from './bergler/bergler.component';
import {HomeComponent} from './home/home.component';
import {PokayemonComponent} from './pokayemon/pokayemon.component';
import {HttpClientModule} from '@angular/common/http';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {StarRatingModule} from "angular-star-rating";
import {PoopFormComponent} from './poop-form/poop-form.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaintenanceComponent} from './maintenance/maintenance.component';
import {LeaderboardsComponent} from './leaderboards/leaderboards.component';
import {CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport, ScrollingModule} from "@angular/cdk/scrolling";
import {AuthModule} from "@auth0/auth0-angular";
import {AuthbuttonComponent} from './authbutton/authbutton.component';
import {environment} from "../environments/environment.prod";
import {ProfileComponent} from './profile/profile.component';
import {TrophyDialogComponent} from './dialogs/trophy-dialog/trophy-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {MatTooltipModule} from "@angular/material/tooltip";
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthHttpInterceptor} from '@auth0/auth0-angular';
import {NgOptimizedImage} from "@angular/common";
import { SoftballComponent } from './softball/softball.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {CsvModule} from "@ctrl/ngx-csv";
import { StatExplanationComponent } from './dialogs/stat-explanation/stat-explanation.component';
import {MatSortModule} from "@angular/material/sort";
import { LocationExplanationComponent } from './dialogs/location-explanation/location-explanation/location-explanation.component';
import { UsMapModule } from 'angular-us-map';
import { UnitedStatesMapComponent } from './united-states-map/united-states-map.component';
import {QRCodeModule} from "angularx-qrcode";
import { QrCodeComponent } from './dialogs/qr-code/qr-code/qr-code.component';
import { SesameComponent } from './components/sesame/sesame.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';


@NgModule({
  declarations: [
    AppComponent,
    GoblinDatingSimulatorComponent,
    AyesAndBaesComponent,
    PoopDiariesComponent,
    BerglerComponent,
    HomeComponent,
    PokayemonComponent,
    PoopFormComponent,
    MaintenanceComponent,
    LeaderboardsComponent,
    AuthbuttonComponent,
    ProfileComponent,
    TrophyDialogComponent,
    SoftballComponent,
    StatExplanationComponent,
    LocationExplanationComponent,
    UnitedStatesMapComponent,
    QrCodeComponent,
    SesameComponent,
    PrivacyComponent,
    TermsAndConditionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    StarRatingModule.forRoot(),
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    ScrollingModule,
    QRCodeModule,
    AuthModule.forRoot({
      domain: environment.auth0Domain,
      clientId: environment.auth0ClientId,
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: `https://${environment.auth0Domain}/api/v2/`,
        scope: 'openid profile update:current_user_metadata offline_access read:current_user create:current_user_metadata delete:current_user_metadata create:current_user_device_credentials delete:current_user_device_credentials read:users',
      },

      httpInterceptor: {
        allowedList: [
          {
            uri: `https://${environment.auth0Domain}/api/v2/*`,
            tokenOptions: {
              authorizationParams: {
                // The attached token should target this audience
                audience: `https://${environment.auth0Domain}/api/v2/`,

                // The attached token should have these scopes
                scope: 'openid profile update:current_user_metadata offline_access read:current_user create:current_user_metadata delete:current_user_metadata create:current_user_device_credentials delete:current_user_device_credentials read:users'
              }
            }
          }]
      }
    }),
    MatDialogModule,
    ClipboardModule,
    MatTooltipModule,
    NgOptimizedImage,
    MatPaginatorModule,
    MatTableModule,
    CsvModule,
    MatSortModule,
    UsMapModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
