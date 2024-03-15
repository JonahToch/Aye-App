import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {map, Observable, of, pipe} from "rxjs";
import {Poop} from "../models/poop";
import {HttpClient} from "@angular/common/http";
import {PoopService} from "../services/poop.service";
import {AyeScore, AyeScoreArr} from "../interfaces/aye-score";
import {MatTableDataSource} from "@angular/material/table";
import {SoftballHitter} from "../interfaces/softball";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {formatDate} from "@angular/common";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {StatExplanationComponent} from "../dialogs/stat-explanation/stat-explanation.component";
import {
  LocationExplanationComponent
} from "../dialogs/location-explanation/location-explanation/location-explanation.component";

@Component({
  selector: 'app-leaderboards',
  templateUrl: './leaderboards.component.html',
  styleUrls: ['./leaderboards.component.scss']
})
export class LeaderboardsComponent implements AfterViewInit {
  dataSource: MatTableDataSource<AyeScoreArr>;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['user', 'ayeScore', 'uniqueStates', 'uniqueCities'];

  listOfPoops$: Observable<any> = new Observable<any>();
  dataMap: Map<string, AyeScore>;
  sortedMap: [string, AyeScore][];
  showingLeaderboardInReverse = false;
  fillColor = "red";

  usStates = [
    {name: 'ALABAMA', abbreviation: 'AL'},
    {name: 'ALASKA', abbreviation: 'AK'},
    {name: 'AMERICAN SAMOA', abbreviation: 'AS'},
    {name: 'ARIZONA', abbreviation: 'AZ'},
    {name: 'ARKANSAS', abbreviation: 'AR'},
    {name: 'CALIFORNIA', abbreviation: 'CA'},
    {name: 'COLORADO', abbreviation: 'CO'},
    {name: 'CONNECTICUT', abbreviation: 'CT'},
    {name: 'DELAWARE', abbreviation: 'DE'},
    {name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
    {name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
    {name: 'FLORIDA', abbreviation: 'FL'},
    {name: 'GEORGIA', abbreviation: 'GA'},
    {name: 'GUAM', abbreviation: 'GU'},
    {name: 'HAWAII', abbreviation: 'HI'},
    {name: 'IDAHO', abbreviation: 'ID'},
    {name: 'ILLINOIS', abbreviation: 'IL'},
    {name: 'INDIANA', abbreviation: 'IN'},
    {name: 'IOWA', abbreviation: 'IA'},
    {name: 'KANSAS', abbreviation: 'KS'},
    {name: 'KENTUCKY', abbreviation: 'KY'},
    {name: 'LOUISIANA', abbreviation: 'LA'},
    {name: 'MAINE', abbreviation: 'ME'},
    {name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
    {name: 'MARYLAND', abbreviation: 'MD'},
    {name: 'MASSACHUSETTS', abbreviation: 'MA'},
    {name: 'MICHIGAN', abbreviation: 'MI'},
    {name: 'MINNESOTA', abbreviation: 'MN'},
    {name: 'MISSISSIPPI', abbreviation: 'MS'},
    {name: 'MISSOURI', abbreviation: 'MO'},
    {name: 'MONTANA', abbreviation: 'MT'},
    {name: 'NEBRASKA', abbreviation: 'NE'},
    {name: 'NEVADA', abbreviation: 'NV'},
    {name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
    {name: 'NEW JERSEY', abbreviation: 'NJ'},
    {name: 'NEW MEXICO', abbreviation: 'NM'},
    {name: 'NEW YORK', abbreviation: 'NY'},
    {name: 'NORTH CAROLINA', abbreviation: 'NC'},
    {name: 'NORTH DAKOTA', abbreviation: 'ND'},
    {name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
    {name: 'OHIO', abbreviation: 'OH'},
    {name: 'OKLAHOMA', abbreviation: 'OK'},
    {name: 'OREGON', abbreviation: 'OR'},
    {name: 'PALAU', abbreviation: 'PW'},
    {name: 'PENNSYLVANIA', abbreviation: 'PA'},
    {name: 'PUERTO RICO', abbreviation: 'PR'},
    {name: 'RHODE ISLAND', abbreviation: 'RI'},
    {name: 'SOUTH CAROLINA', abbreviation: 'SC'},
    {name: 'SOUTH DAKOTA', abbreviation: 'SD'},
    {name: 'TENNESSEE', abbreviation: 'TN'},
    {name: 'TEXAS', abbreviation: 'TX'},
    {name: 'UTAH', abbreviation: 'UT'},
    {name: 'VERMONT', abbreviation: 'VT'},
    {name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
    {name: 'VIRGINIA', abbreviation: 'VA'},
    {name: 'WASHINGTON', abbreviation: 'WA'},
    {name: 'WEST VIRGINIA', abbreviation: 'WV'},
    {name: 'WISCONSIN', abbreviation: 'WI'},
    {name: 'WYOMING', abbreviation: 'WY'}
  ]

  constructor(
    private http: HttpClient,
    private poopService: PoopService,
    public dialog: MatDialog,
  ) {
    this.dataMap = new Map<string, AyeScore>();
    this.sortedMap = [];
    this.dataSource = new MatTableDataSource<AyeScoreArr>([]);
    // // @ts-ignore
    // this.dataSource.paginator = this.paginator;
    this.sort = new MatSort();
  }


  ngAfterViewInit() {
    this.poopService.poopListObs$.pipe(
      map((poops) => {
        if (poops) {
          poops.forEach((poop: Poop) => {
            if (!poop.name) {
              return;
            }
            // Algorithm
            // pts per char of description is 1pt, max 300.
            // pts per giving addr is 100 if give, 250 if not in illinois, 0 if not.
            // pts per comment = 50, max for comments is 250.
            // pts per likes is 10, max for likes is 500
            // pts per dislike is -8, max for dislikes is 300
            // max score is 1300 and with full dislikes it is 1000.
            //
            let ayePoints = 0;
            let descValue = poop.description.length;
            // if (poop.name.toUpperCase() === "KEVIN") {
            //   console.log(poop);
            // }
            if (descValue) {
              if (descValue > 300) {
                descValue = 300;
              }
            }
            let addr = poop.fullAddr;
            let addrValue = 0;
            if (addrValue) {
              if (addr) {
                addrValue = 100;
              }
              if (addr && addr !== "Illinois") {
                addrValue = 250;
              }
            }
            let commentVal = (poop.comments.length * 50);
            if (commentVal) {
              if (commentVal > 250) {
                commentVal = 250;
              }
            }
            let fixedLikes = poop.likes;
            let likeVal = 0;
            if (fixedLikes) {
              if (fixedLikes === 0) {
                fixedLikes = 1;
              }
              likeVal = (fixedLikes * 10);
              if (likeVal > 500) {
                likeVal = 500;
              }
            }
            let fixedDislikes = poop.dislikes;
            let dislikeVal = 0;
            if (fixedDislikes) {
              if (fixedDislikes === 0) {
                fixedDislikes = 1;
              }
              dislikeVal = (fixedDislikes * 8);
              if (dislikeVal > 300) {
                dislikeVal = 300;
              }
            }
            ayePoints += descValue + addrValue + commentVal + likeVal - dislikeVal;
            if (ayePoints > 1300) {
              ayePoints = 1300
            }

            if (!this.dataMap.has(poop.name.toUpperCase())) {
              // TODO FIGURE OUT HOW TO NOT ADD UNDEFINED TO ARRAY.
              this.dataMap.set(poop.name.toUpperCase(), {
                cities: [],
                states: [],
                ayeScore: ayePoints,
              });
            }
            let ayeMap = this.dataMap.get(poop.name.toUpperCase());

            if (ayeMap) {
              ayeMap.ayeScore += ayePoints;
              if (poop.city && !ayeMap.cities.includes(poop.city)) {
                ayeMap.cities.push(poop.city);
              }
              // if (poop.name.toUpperCase() === "JONAH") {
              //   console.log(poop);
              // }
              if (poop.longState && !ayeMap.states.includes(poop.longState) && this.isUSState(poop.longState)) {
                ayeMap.states.push(poop.longState);
              }
              this.dataMap.set(poop.name.toUpperCase(), ayeMap!);
            }
          })
          this.sortedMap = [...this.dataMap.entries()].sort((a: any, b: any) =>
            b[1].ayeScore - a[1].ayeScore,
          );
        } else {
          this.poopService.getPoops().subscribe();
        }
        this.dataSource = new MatTableDataSource<AyeScoreArr>(this.ayeScoreToArr(this.sortedMap));
        console.log(this.dataSource)
        setTimeout(() => {
          // @ts-ignore
          this.dataSource.paginator = this.paginator;
        }, 1)
        this.dataSource.sort = this.sort;
        console.log(this.dataSource.paginator);
      })).subscribe();
  }

  isUSState(state: string) {
    for (let i = 0; i < this.usStates.length; i++) {
      if (this.usStates[i].name.toUpperCase() === state.toUpperCase()) {
        return true;
      }
    }
    return false;
  }

  sortPoopData(sortState: Sort) {
    this.showingLeaderboardInReverse = false;
    let originalData = this.dataSource.data;

    let sortedData: AyeScoreArr[] = [];

    if (sortState.active === "ayeScore") {
      sortedData = this.sortByAyeScore(originalData);
      if (sortState.direction === "asc") {
        sortedData.reverse();
      } else {
        this.showingLeaderboardInReverse = true;
      }
      this.dataSource.data = sortedData;
    } else if (sortState.active === "uniqueStates") {
      sortedData = this.sortByUniqueStates(originalData);
      if (sortState.direction === "desc") {
        sortedData.reverse();
      } else {
        this.showingLeaderboardInReverse = true;
      }
      this.dataSource.data = sortedData;
    } else if (sortState.active === "uniqueCities") {
      sortedData = this.sortByUniqueCities(originalData);
      if (sortState.direction === "desc") {
        sortedData.reverse();
      } else {
        this.showingLeaderboardInReverse = true;
      }
      this.dataSource.data = sortedData;
    }
    console.log(this.showingLeaderboardInReverse);

  }

  sortByAyeScore(originalData: AyeScoreArr[]) {
    let newData: AyeScoreArr[] = [];

    for (let i = 0; i < originalData.length; i++) {
      let score = originalData[i].ayeScore;
      if (i === 0) {
        newData.push(originalData[i]);
        continue;
      }
      for (let j = 0; j < newData.length; j++) {
        if (j === newData.length - 1) {
          if (score >= newData[j].ayeScore) {
            newData.push(originalData[i]);
          } else {
            newData.unshift(originalData[i]);
          }
          break;
        }
        if (score > newData[j].ayeScore &&
          score <= newData[j + 1].ayeScore) {
          newData.splice(j + 1, 0, originalData[i]);
          break;
        }
      }
    }
    return newData;
  }

  sortByUniqueStates(originalData: AyeScoreArr[]) {
    let newData: AyeScoreArr[] = [];

    for (let i = 0; i < originalData.length; i++) {
      let score = originalData[i].states.length;
      if (i === 0) {
        newData.push(originalData[i]);
        continue;
      }
      for (let j = 0; j < newData.length; j++) {
        if (j === newData.length - 1) {
          if (score >= newData[j].states.length) {
            newData.push(originalData[i]);
          } else {
            newData.unshift(originalData[i]);
          }
          break;
        }
        if (score > newData[j].states.length &&
          score <= newData[j + 1].states.length) {
          newData.splice(j + 1, 0, originalData[i]);
          break;
        }
      }
    }
    return newData;
  }

  sortByUniqueCities(originalData: AyeScoreArr[]) {
    let newData: AyeScoreArr[] = [];

    for (let i = 0; i < originalData.length; i++) {
      let score = originalData[i].cities.length;
      if (i === 0) {
        newData.push(originalData[i]);
        continue;
      }
      for (let j = 0; j < newData.length; j++) {
        if (j === newData.length - 1) {
          if (score >= newData[j].cities.length) {
            newData.push(originalData[i]);
          } else {
            newData.unshift(originalData[i]);
          }
          break;
        }
        if (score > newData[j].cities.length &&
          score <= newData[j + 1].cities.length) {
          newData.splice(j + 1, 0, originalData[i]);
          break;
        }
      }
    }
    return newData;
  }

  ayeScoreToArr(arr: [string, AyeScore][]) {
    let newArr: AyeScoreArr[] = [];

    for (let i = 0; i < arr.length; i++) {
      newArr.push({
        user: arr[i][0],
        cities: arr[i][1].cities,
        states: arr[i][1].states,
        ayeScore: arr[i][1].ayeScore,
      })
    }
    return newArr;

  }

  getBorder(name: string): string {
    if (this.showingLeaderboardInReverse) {
      return 'camper';
    }
    if (name === this.dataSource.data[0].user.toLowerCase()) {
      return 'golden';
    }
    if (name === this.dataSource.data[1].user.toLowerCase()) {
      return 'silver';
    }
    if (name === this.dataSource.data[2].user.toLowerCase()) {
      return 'bronze';
    }
    return 'camper';
  }


  openExplanation(locations: string[], personsName: string, type: string) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: type,
      personsName: personsName,
      locations: locations,
    }

    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "1050px";
    dialogConfig.width = "98%"

    this.dialog.open(LocationExplanationComponent, dialogConfig);
  }

  qualifyForMedal(name: string): boolean {
    if (this.showingLeaderboardInReverse) {
      return false;
    }
    if (name === this.dataSource.data[0].user.toLowerCase()) {
      return true;
    } else if (name === this.dataSource.data[1].user.toLowerCase()) {
      return true;
    } else if (name === this.dataSource.data[2].user.toLowerCase()) {
      return true;
    }
    return false;
  }

  getCurrDate() {
    return formatDate(new Date(), 'MM-dd-yy', 'en');
  }

}
