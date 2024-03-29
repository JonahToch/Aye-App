import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {SoftballHitter, StatExplain} from "../interfaces/softball";
import {formatDate} from "@angular/common";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {StatExplanationComponent} from "../dialogs/stat-explanation/stat-explanation.component";
import {MatSort, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";

@Component({
  selector: 'app-softball',
  templateUrl: './softball.component.html',
  styleUrls: ['./softball.component.scss']
})
export class SoftballComponent implements AfterViewInit {
  dataSource: MatTableDataSource<SoftballHitter>;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  @ViewChild(MatSort) sort: MatSort;

  softballHitterData: SoftballHitter[] = [
    {
      name: 'Alexander Bae',
      position: '',
      games: 0,
      plateAppearances: 0,
      runs: 0,
      hits: 0,
      doubles: 0,
      triples: 0,
      homeruns: 0,
      rbis: 0,
      walks: 0,
    },
    {
      name: 'Zach Batio',
      position: 'SS',
      games: 2,
      plateAppearances: 2,
      runs: 1,
      hits: 1,
      doubles: 0,
      triples: 0,
      homeruns: 0,
      rbis: 0,
      walks: 1,
    },
    {
      name: 'Tessa Berger',
      position: 'RF',
      games: 2,
      plateAppearances: 3,
      runs: 1,
      hits: 0,
      doubles: 0,
      triples: 0,
      homeruns: 0,
      rbis: 0,
      walks: 1,
    },
    {
      name: 'Alexander Caines',
      position: '',
      games: 0,
      plateAppearances: 0,
      runs: 0,
      hits: 0,
      doubles: 0,
      triples: 0,
      homeruns: 0,
      rbis: 0,
      walks: 0,
    },
    {
      name: 'Brandon Deleon',
      position: '3B',
      games: 2,
      plateAppearances: 2,
      runs: 1,
      hits: 2,
      doubles: 1,
      triples: 1,
      homeruns: 0,
      rbis: 1,
      walks: 0,
    },
    {
      name: 'Audrey Dehler',
      position: 'RF',
      games: 1,
      plateAppearances: 1,
      runs: 0,
      hits: 1,
      doubles: 0,
      triples: 0,
      homeruns: 0,
      rbis: 1,
      walks: 0,
    },
    {
      name: 'Declan Donohue',
      position: 'LF',
      games: 2,
      plateAppearances: 3,
      runs: 1,
      hits: 1,
      doubles: 1,
      triples: 0,
      homeruns: 0,
      rbis: 0,
      walks: 0,
    },
    {
      name: 'Ian Imhof',
      position: '3B',
      games: 2,
      plateAppearances: 2,
      runs: 1,
      hits: 1,
      doubles: 0,
      triples: 0,
      homeruns: 1,
      rbis: 2,
      walks: 0,
    },
    {
      name: 'Justin Imhof',
      position: 'CF',
      games: 1,
      plateAppearances: 2,
      runs: 0,
      hits: 1,
      doubles: 0,
      triples: 0,
      homeruns: 0,
      rbis: 0,
      walks: 0,
    },
    {
      name: 'Kyra Kalliope',
      position: 'C',
      games: 1,
      plateAppearances: 2,
      runs: 0,
      hits: 0,
      doubles: 0,
      triples: 0,
      homeruns: 0,
      rbis: 0,
      walks: 0,
    },
    {
      name: 'Juliana Livieri',
      position: '2B',
      games: 2,
      plateAppearances: 3,
      runs: 1,
      hits: 2,
      doubles: 0,
      triples: 0,
      homeruns: 0,
      rbis: 1,
      walks: 0,
    },
    {
      name: 'Kevin Patto',
      position: '',
      games: 0,
      plateAppearances: 0,
      runs: 0,
      hits: 0,
      doubles: 0,
      triples: 0,
      homeruns: 0,
      rbis: 0,
      walks: 0,
    },
    {
      name: 'Alyssa Pierce',
      position: '1B',
      games: 1,
      plateAppearances: 1,
      runs: 1,
      hits: 0,
      doubles: 0,
      triples: 0,
      homeruns: 0,
      rbis: 1,
      walks: 0,
    },
    {
      name: 'Zaq Perdomo',
      position: '1B',
      games: 2,
      plateAppearances: 3,
      runs: 1,
      hits: 1,
      doubles: 0,
      triples: 1,
      homeruns: 0,
      rbis: 0,
      walks: 0,
    },
    {
      name: 'Kenny Puleikis',
      position: 'SS',
      games: 1,
      plateAppearances: 2,
      runs: 1,
      hits: 1,
      doubles: 0,
      triples: 1,
      homeruns: 0,
      rbis: 1,
      walks: 0,
    },
    {
      name: 'Jan Rara',
      position: 'CF',
      games: 2,
      plateAppearances: 3,
      runs: 2,
      hits: 3,
      doubles: 0,
      triples: 0,
      homeruns: 0,
      rbis: 0,
      walks: 0,
    },
    {
      name: 'Tony Rayas',
      position: 'OF',
      games: 1,
      plateAppearances: 1,
      runs: 1,
      hits: 1,
      doubles: 0,
      triples: 0,
      homeruns: 1,
      rbis: 3,
      walks: 0,
    },
    {
      name: 'Jonah Toch',
      position: 'P',
      games: 1,
      plateAppearances: 2,
      runs: 0,
      hits: 2,
      doubles: 0,
      triples: 0,
      homeruns: 0,
      rbis: 0,
      walks: 0,
    },
    {
      name: 'Jessica Uy',
      position: 'LF',
      games: 2,
      plateAppearances: 2,
      runs: 0,
      hits: 1,
      doubles: 0,
      triples: 0,
      homeruns: 0,
      rbis: 0,
      walks: 0,
    },
  ]

  // Your pitching stats: 5 IP with 5 walks and 2 Strikeouts

  // headers = [
  //   {label: 'Item ID', key: 'manufacturerItemId'},
  //   {label: 'Quantity', key: 'quantity'},
  //   {label: 'Purchase Order', key: 'purchaseOrder'},
  // ];
  displayedColumns: string[] = ['name', 'games', 'plateAppearances', 'runs', 'hits', 'doubles', 'triples', 'homeruns', 'rbis', 'walks', 'battingAverage',
    'onBasePercentage', 'sluggingPercentage', 'onBasePlusSlugging'];

  baseballRef = new Map<string, StatExplain>([
    ["G", {
      fullStat: "Games",
      statExplained: "Show up to the game and you get a game stat. You don't even have to play."
    },
    ],
    ["PA", {
      fullStat: "Plate Appearances",
      statExplained: "When you bat and there is an outcome."
    },
    ],
    ["R", {
      fullStat: "Runs",
      statExplained: "Cross home and score a run as a base runner."
    },
    ],
    ["H", {
      fullStat: "Hits",
      statExplained: "Hit the ball and reach at least 1st base without it being an error or a fielder's choice."
    },
    ], ["2B", {
      fullStat: "Double",
      statExplained: "Hit the ball and reach 2nd base without it being due to a throwing error by the defense."
    },
    ], ["3B", {
      fullStat: "Triple",
      statExplained: "Hit the ball and reach 3rd base without it being due to a throwing error by the defense."
    },
    ], ["HR", {
      fullStat: "Homerun",
      statExplained: "Hit the ball and go around all of the bases without it being due to a throwing error by the defense."
    },
    ], ["RBI", {
      fullStat: "Runs Batted In",
      statExplained: "Hit the ball and someone scores because of it and not due to a throwing error by the defense."
    },
    ], ["BB", {
      fullStat: "Base on Balls",
      statExplained: "Take 4 balls as a hitter and get a free 1st base."
    },
    ], ["AVG", {
      fullStat: "Batting Average",
      statExplained: "The number of hits you have divided by at bats. (Walks don't contribute to stat)."
    },
    ], ["OBP", {
      fullStat: "On Base Percentage",
      statExplained: "The number of times you get on base divided by at bats. So hit or get walked and have your plate appearance end without an out."
    },
    ], ["SLG", {
      fullStat: "Slugging Percentage",
      statExplained: "Of your hits, how many of them are multi base hits? The formula is (1B + 2Bx2 + 3Bx3 + HRx4)/AB."
    },
    ],
    ["OPS", {
      fullStat: "On Base Percentage + Slugging Percentage",
      statExplained: "The best stat. It tells you not only how often a player gets on base but how often they get big hits. The best stat."
    },
    ],
  ])


  softballImgUrl = 'assets/softball/ayes-and-baes-06-24-23.jpg';

  constructor(
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
  ) {
    this.dataSource = new MatTableDataSource<SoftballHitter>(this.softballHitterData);
    this.sort = new MatSort();
  }

  openStatDefinition() {
    // this.dialog.open(TrophyDialogComponent);
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<SoftballHitter>(this.softballHitterData);
    // @ts-ignore
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  changePhoto(color: string) {
    if (color === 'red') {
      this.softballImgUrl = 'assets/softball/ayes-and-baes-06-10-23.jpg'
    } else if (color === 'orange') {
      this.softballImgUrl = 'assets/softball/ayes-and-baes-06-17-23.jpg'
    } else if (color === 'yellow') {
      this.softballImgUrl = 'assets/softball/ayes-and-baes-06-24-23.jpg'
    }
  }


  sortSoftballData(sortState: Sort) {

    let originalData = this.dataSource.data;
    let sortedData: SoftballHitter[] = [];

    if (sortState.active === "battingAverage") {
      sortedData = this.sortByAvg(originalData);

      if (sortState.direction === "desc") {
        sortedData.reverse();
      }

      this.dataSource.data = sortedData;

    } else if (sortState.active === "onBasePercentage") {

      sortedData = this.sortByOBP(originalData);

      if (sortState.direction === "desc") {
        sortedData.reverse();
      }

      this.dataSource.data = sortedData;
    } else if (sortState.active === "sluggingPercentage") {
      sortedData = this.sortBySLG(originalData);

      if (sortState.direction === "desc") {
        sortedData.reverse();
      }
        this.dataSource.data = sortedData;
    } else if (sortState.active === "onBasePlusSlugging") {
      sortedData = this.sortByOPS(originalData);

      if (sortState.direction === "desc") {
        sortedData.reverse();
      }

      this.dataSource.data = sortedData;
    }

  }

  sortByAvg(originalData: SoftballHitter[]) {
    let newData: SoftballHitter[] = [];

    for (let i = 0; i < originalData.length; i++) {
      let avg = this.calcAvg(originalData[i].plateAppearances, originalData[i].walks, originalData[i].hits);

      if (i === 0) {
        newData.push(originalData[i]);
        continue;
      }
      for (let j = 0; j < newData.length; j++) {

        if (j === newData.length - 1) {
          if (avg >= this.calcAvg(newData[j].plateAppearances, newData[j].walks, newData[j].hits)) {
            newData.push(originalData[i]);
          } else {
            newData.unshift(originalData[i]);
          }
          break;
        }

        if (avg > this.calcAvg(newData[j].plateAppearances, newData[j].walks, newData[j].hits) &&
          avg <= this.calcAvg(newData[j + 1].plateAppearances, newData[j + 1].walks, newData[j + 1].hits)) {
          newData.splice(j + 1, 0, originalData[i]);
          break;
        }
      }
    }
    return newData;
  }

  sortByOBP(originalData: SoftballHitter[]) {
    let newData: SoftballHitter[] = [];

    for (let i = 0; i < originalData.length; i++) {
      let obp = this.calcOBP(originalData[i].hits, originalData[i].walks, originalData[i].plateAppearances);

      if (i === 0) {
        newData.push(originalData[i]);
        continue;
      }
      for (let j = 0; j < newData.length; j++) {

        if (j === newData.length - 1) {
          if (obp >= this.calcOBP(newData[j].hits, newData[j].walks, newData[j].plateAppearances)) {
            newData.push(originalData[i]);
          } else {
            newData.unshift(originalData[i]);
          }
          break;
        }

        if (obp > this.calcOBP(newData[j].hits, newData[j].walks, newData[j].plateAppearances) &&
          obp <= this.calcOBP(newData[j + 1].hits, newData[j + 1].walks, newData[j + 1].plateAppearances)) {
          newData.splice(j + 1, 0, originalData[i]);
          break;
        }
      }
    }
    return newData;
  }

  sortBySLG(originalData: SoftballHitter[]) {
    let newData: SoftballHitter[] = [];

    for (let i = 0; i < originalData.length; i++) {
      let slg = this.calcSlugging(originalData[i].hits, originalData[i].doubles, originalData[i].triples,
        originalData[i].homeruns, originalData[i].plateAppearances, originalData[i].walks);

      if (i === 0) {
        newData.push(originalData[i]);
        continue;
      }
      for (let j = 0; j < newData.length; j++) {

        if (j === newData.length - 1) {
          if (slg >= this.calcSlugging(newData[j].hits, newData[j].doubles, newData[j].triples,
            newData[j].homeruns, newData[j].plateAppearances, newData[j].walks)) {
            newData.push(originalData[i]);
          } else {
            newData.unshift(originalData[i]);
          }
          break;
        }

        if (slg > this.calcSlugging(newData[j].hits, newData[j].doubles, newData[j].triples,
            newData[j].homeruns, newData[j].plateAppearances, newData[j].walks) &&
          slg <= this.calcSlugging(newData[j + 1].hits, newData[j + 1].doubles, newData[j + 1].triples,
            newData[j + 1].homeruns, newData[j + 1].plateAppearances, newData[j + 1].walks)) {
          newData.splice(j + 1, 0, originalData[i]);
          break;
        }
      }
    }
    return newData;

  }

  sortByOPS(originalData: SoftballHitter[]) {
    let newData: SoftballHitter[] = [];

    for (let i = 0; i < originalData.length; i++) {
      let ops = this.calcOPS(originalData[i].hits, originalData[i].doubles, originalData[i].triples,
        originalData[i].homeruns, originalData[i].plateAppearances, originalData[i].walks);

      if (i === 0) {
        newData.push(originalData[i]);
        continue;
      }
      for (let j = 0; j < newData.length; j++) {

        if (j === newData.length - 1) {
          if (ops >= this.calcOPS(newData[j].hits, newData[j].doubles, newData[j].triples,
            newData[j].homeruns, newData[j].plateAppearances, newData[j].walks)) {
            newData.push(originalData[i]);
          } else {
            newData.unshift(originalData[i]);
          }
          break;
        }

        if (ops > this.calcOPS(newData[j].hits, newData[j].doubles, newData[j].triples,
            newData[j].homeruns, newData[j].plateAppearances, newData[j].walks) &&
          ops <= this.calcOPS(newData[j + 1].hits, newData[j + 1].doubles, newData[j + 1].triples,
            newData[j + 1].homeruns, newData[j + 1].plateAppearances, newData[j + 1].walks)) {
          newData.splice(j + 1, 0, originalData[i]);
          break;
        }
      }
    }
    return newData;

  }

  getCurrDate() {
    return formatDate(new Date(), 'MM-dd-yy', 'en');
  }

  calcAvg(plateApp: number, walks: number, hits: number): number {
    let AVG = hits / (plateApp - walks);
    if (isNaN(AVG)) {
      AVG = 0.000;
    }
    return AVG;
  }


  calcOBP(hits: number, walks: number, plateAppearances: number) {
    let OBP = (hits + walks) / (plateAppearances)
    if (isNaN(OBP)) {
      OBP = 0.000;
    }
    return OBP;
  }

  calcSlugging(hits: number, doubles: number, triples: number, homeruns: number, plateAppearances: number, walks: number) {
    const singles = hits - doubles - triples - homeruns;
    let slugging = singles + (doubles * 2) + (triples * 3) + (homeruns * 4) / (plateAppearances - walks);
    if (isNaN(slugging)) {
      slugging = 0.000;
    }
    return slugging;
  }

  calcOPS(hits: number, doubles: number, triples: number, homeruns: number, plateAppearances: number, walks: number) {
    const OBP = this.calcOBP(hits, walks, plateAppearances);
    const slugging = this.calcSlugging(hits, doubles, triples, homeruns, plateAppearances, walks)
    let OPS = OBP + slugging;
    if (isNaN(OPS)) {
      OPS = 0.000;
    }
    return OPS;
  }

  openStatExplanation(stat: string) {

    const fullStat = this.baseballRef.get(stat)?.fullStat;
    const statExplained = this.baseballRef.get(stat)?.statExplained;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: stat,
      fullName: fullStat,
      description: statExplained
    }

    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = true;

    this.dialog.open(StatExplanationComponent, dialogConfig);
  }


}
