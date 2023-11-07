import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { AccountService } from 'src/app/service/account-service';
import { UiService } from 'src/app/service/ui-service';


@Component({
  selector: 'app-cup-rate',
  templateUrl: './cup-rate.component.html',
  styleUrls: ['./cup-rate.component.scss']
})
export class CupRateComponent implements OnInit {

  sportsId: number;
  eventId: string;
  rtrnObj: any = [];
  type: string = "Before";
  MtchMrkt: string;
  apiData: any = [];
  matchData: any = [];
  public _setInterval1: any;
  public _setInterval2: any;
  constructor(private router:Router,private http: HttpClient, private accountService: AccountService, private route: ActivatedRoute, public uISERVICE: UiService) { }

  ngOnInit(): void {
    this.uISERVICE.sideBar = true;

    if (Cookie.check("usersCookies")) {
      this.type = "After";
      this.uISERVICE.profit = 0;
      this.uISERVICE.exposure = 0;
      this.uISERVICE.stake = 0;
      this.uISERVICE.fancySlip = [];

      this.route.paramMap.subscribe(params => {
        this.sportsId = parseInt(params.get('sportsId'));
        this.eventId = params.get('eventId');
      });
      this.getEventDetail();
      this.myFunction();
    } else {
      this.uISERVICE.Error=true;
      this.uISERVICE.Message="Please Login OR SignUp";
      this.router.navigate(["games"]);
      setTimeout(() => {        
      this.uISERVICE.Error=false;
      }, 2000);
    }
  }


  myFunction() {
    this._setInterval1 = setInterval(() => {
      this.getAPIData();
    }, 1500);
    this._setInterval2 = setInterval(() => {
      this.calculateBook();
    }, 3000);

  }

  ngOnDestroy() {
    clearInterval(this._setInterval1);
  }

  getEventDetail() {
    this.uISERVICE.loader = true;
    this.accountService.getEvntDetail(this.eventId, this.type).then((response) => {
      if (response.Status) {
        this.uISERVICE.Bets = response.Result.Bets;
        response.Result.markets.forEach((element, i) => {
          this.MtchMrkt = element.MarketId;
          element.runners.forEach(data => {
            data.runners = {
              'availableToBack': [{ 'price': 0, 'size': 0 }],
              'availableToLay': [{ 'price': 0, 'size': 0 }]
            }
          });
          this.rtrnObj = response.Result;
          this.uISERVICE.betSlip = this.rtrnObj.chips;
        });
        this.uISERVICE.loader = false;
        this.calculateBook();
      } else {
        this.uISERVICE.loader = false;
        this.rtrnObj = [];
      }
    });
  }

  async getAPIData() {

    this.matchData = this.rtrnObj.markets.find(x => x.marketName == "Cup-Rate");
    if (this.matchData != null) {
      await this.http.get("https://cuprate.in/getbm?eventId=28127348").subscribe(data => {
        this.apiData = data;

        if (this.apiData.market.length > 0) {
          this.matchData.runners.forEach(element => {
            var runner = this.apiData.market[0].events.find(x => x.SelectionId == element.RunnerId);
            element.runners.availableToBack[0].price = runner.BackPrice1;
            element.runners.availableToBack[0].size = runner.BackSize1;

            element.runners.availableToLay[0].price = runner.LayPrice1;
            element.runners.availableToLay[0].size = runner.LaySize1;
          });
        }
      });
    }


    this.calculateBook();
  }



  reIntBook() {
    if (this.rtrnObj != null && this.uISERVICE.Bets != null) {
      //Match_Odds
      var market = this.rtrnObj.markets.find(x => x.marketName == "Cup-Rate");
      market.runners.forEach(element => {
        element.Book = 0;
      });

    }
  }

  calculateBook() {
    if (this.rtrnObj != null && this.uISERVICE.Bets != null) {
      this.reIntBook();
      //Match_Odds
      var market = this.rtrnObj.markets.find(x => x.marketName == "Cup-Rate");
      if (this.uISERVICE.Bets.length > 0) {
        market.runners.forEach(element => {
          this.uISERVICE.Bets.forEach(data => {
            if (data.RunnerId == element.id) {
              if (data.BetType == "Back") {
                element.Book = element.Book + data.Profit;
              }
              else {
                element.Book = element.Book - data.Exposure;
              }
            } else {
              if (data.BetType == "Back") {
                element.Book = element.Book - data.Exposure;
              }
              else {
                element.Book = element.Book + data.Profit;
              }
            }
          });
        });
      }
    }
  }

  checkLogin() {
    if (!Cookie.get("usersCookies")) {
      this.uISERVICE.logIn = false;
      this.uISERVICE.logIn = true;
    }
  }


  setValues(betType, odds, price, mId, rId, rName, maxMrkt, minMrkt, rIndx, mrktName, mainIndex, betDly) {
    this.checkLogin();

    if (!this.uISERVICE.logIn) {
      if (this.uISERVICE.fancySlip.length > 0) {
        let j = 0;
        this.uISERVICE.fancySlip.forEach((element, id) => {
          if (mainIndex == id) {
            this.uISERVICE.fancySlip[id] = true;
          } else {
            this.uISERVICE.fancySlip[id] = false;
          }
        });
        if (j == 0) {
          this.uISERVICE.fancySlip[mainIndex] = true;
        }
      } else {
        this.uISERVICE.fancySlip[mainIndex] = true;
      }
      this.uISERVICE.betType = betType;
      this.uISERVICE.odds = odds;
      this.uISERVICE.price = price;
      this.uISERVICE.marketId = mId;
      this.uISERVICE.rnrId = rId;
      this.uISERVICE.rName = rName;
      this.uISERVICE.maxMarkt = maxMrkt;
      this.uISERVICE.minMarkt = minMrkt;
      this.uISERVICE.betDelay = betDly
      this.uISERVICE.rIndx = rIndx;
      this.uISERVICE.mrktName = mrktName;
      this.uISERVICE.sportsId = this.sportsId;
      this.uISERVICE.eventId = this.eventId;
      this.uISERVICE.EventName = this.rtrnObj.EventName;
    }

  }

}
