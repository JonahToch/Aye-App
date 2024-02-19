import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PoopDiariesComponent} from "./poop-diaries/poop-diaries.component";
import {HomeComponent} from "./home/home.component";
import {PoopFormComponent} from "./poop-form/poop-form.component";
import {MaintenanceComponent} from "./maintenance/maintenance.component";
import {LeaderboardsComponent} from "./leaderboards/leaderboards.component";
import {ProfileComponent} from "./profile/profile.component";
import {SoftballComponent} from "./softball/softball.component";
import {SesameComponent} from "./components/sesame/sesame.component";

const routes: Routes = [

  { path: 'softball',
    component: SoftballComponent,
    title: "Aye - Aye's & Bae's"
  },
  { path: 'poop-diaries',
    component: PoopDiariesComponent,
    title: 'Aye - Poop Diaries'
  },
  { path: 'sesame',
    component: SesameComponent,
    title: "Aye - Sesame"
  },
  { path: 'poop-form',
    component: PoopFormComponent,
    title: 'Aye - Poop Form',
  },
  { path: 'maintenance',
    component: MaintenanceComponent,
    title: 'Aye - Maintenance',
  },
  { path: 'leaderboards',
    component: LeaderboardsComponent,
    title: 'Aye - Leaderboards'
  },
  { path: ':@profile',
    component: ProfileComponent,
    title: 'Aye - Profile',
  },
  { path: 'authorize',
    component: ProfileComponent,
    title: 'Aye - Profile'
  },
  { path: '**',
    component: HomeComponent,
    title: 'Aye - Welcome',
  },
  { path: '',
    component: HomeComponent,
    title: 'Aye - Welcome',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
