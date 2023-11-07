import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { AccountService } from 'src/app/service/account-service';
import { UiService } from 'src/app/service/ui-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CardDetails } from 'src/app/Model/CardsModel';
import { Location } from '@angular/common';


@Component({
  selector: 'app-teenpatti',
  templateUrl: './teenpatti.component.html',
  styleUrls: ['./teenpatti.component.scss']
})
export class TeenpattiComponent implements OnInit {
  eventId: string;
  rtrnObj: any = [];
  type: string = "Before";
  MtchMrkt: string;
  apiData: any = [];
  apiDataResult: any = [];
  roundId: string = "";
  marketName: string;
  public _setIntervalHandler: any;
  public _setIntervalHandler2: any;
  runnerStatus: boolean = false;
  gameResult: any = [];
  cardsData: any = [];
  AnderCards: any = [];
  BaharCards: any = [];
  videourl: string;
  iframeURL = '';
  urlSafe: SafeResourceUrl;
  showcard: boolean = false;
  public cardModel: CardDetails;
  layLock: boolean = false;


  marketId: string;
  constructor(private location: Location, public sanitizer: DomSanitizer, private http: HttpClient, private accountService: AccountService, private route: ActivatedRoute, public uISERVICE: UiService, private router: Router) {
    this.cardModel = <CardDetails>{
      MarketId: "",
      CardNames: "",
      MarketName: "",
    };
    this.cardModel.MarketName = this.marketName;
    this.uISERVICE.profit = 0;
    this.uISERVICE.exposure = 0;
    this.uISERVICE.stake = 0;
    this.uISERVICE.showSlip = [];
  }

  ngOnInit(): void {
    this.uISERVICE.sideBar = true;
    if (Cookie.check("usersCookies")) {
      this.type = "After";
      this.route.paramMap.subscribe(params => {
        this.marketId = params.get('marketId');
        this.getEventDetail();
        this.myfunction();
      });
    } else {
      this.uISERVICE.Error = true;
      this.uISERVICE.Message = "Please Login OR SignUp";
      this.location.back();
      setTimeout(() => {
        this.uISERVICE.Error = false;
      }, 2000);
    }
  }

  async myfunction() {
    if (this.rtrnObj != null) {
      return await new Promise(resolve => {
        this._setIntervalHandler = setInterval(() => {
          this.getApiData();
          this.calculateBook();
        }, 3000);
        this._setIntervalHandler2 = setInterval(() => {
          this.getApiResult();
        }, 15000);

      });
    }

  }

  ngOnDestroy() {
    clearInterval(this._setIntervalHandler);
    clearInterval(this._setIntervalHandler2);
  }

  getEventDetail() {
    this.uISERVICE.loader = true;
    this.accountService.getCasinoDetail(this.marketId, this.type).then((response) => {
      if (response.Status) {
        this.uISERVICE.Bets = response.Result.Bets;
        response.Result.markets.forEach((element, i) => {
          element.runners.forEach(data => {
            data.runners = {
              'availableToBack': [{ 'price': 0, 'size': 0 }],
              'availableToLay': [{ 'price': 0, 'size': 0 }]
            }
          });
        });
        this.rtrnObj = response.Result;
        this.marketName = this.rtrnObj.markets[0].marketName;
        this.uISERVICE.betSlip = this.rtrnObj.chips;
        this.uISERVICE.loader = false;
        this.getApiData();
        this.getApiResult();
        this.sendUrl();
      } else {
        this.uISERVICE.loader = false;
        this.rtrnObj = [];
      }
    });
  }

  saveCards() {
    this.accountService.saveCard(this.cardModel).then((response) => {
      if (response.Status) {

      } else {

      }
    })
  }

  async getApiData() {
    try {
      const data = await this.http.get(this.rtrnObj.apiUrls.APIUrl).toPromise();
      this.apiData[0] = data;
      if (this.apiData.length > 0) {
        switch (this.rtrnObj.markets[0].marketName) {
          case "20-20 TeenPatti":
            this.rtrnObj.markets[0].runners.forEach(element => {
              const runner = this.apiData[0].data.t2.find(x => x.sid == element.RunnerId);
              element.status = parseInt(runner.gstatus);
              this.uISERVICE.gStatus = parseInt(runner.gstatus);
              element.runners.availableToBack[0].price = runner.rate;
              element.runners.availableToBack[0].size = 0;
              element.runners.availableToLay[0].price = 0;
              element.runners.availableToLay[0].size = 0;
            });
            if (this.apiData[0].data.t1[0].C6 != 1 && this.apiData[0].data.t1[0].C6 != null) {
              this.cardModel.CardNames = this.apiData[0].data.t1[0].C1 + ',' +
                this.apiData[0].data.t1[0].C2 + ',' +
                this.apiData[0].data.t1[0].C3 + ',' +
                this.apiData[0].data.t1[0].C4 + ',' +
                this.apiData[0].data.t1[0].C5 + ',' +
                this.apiData[0].data.t1[0].C6;
            }
            if (this.roundId != this.apiData[0].data.t1[0].mid && this.roundId != "") {
              this.uISERVICE.Bets = [];
              this.cardModel.MarketId = this.roundId;
              this.saveCards();
            }
            this.roundId = this.apiData[0].data.t1[0].mid;
            this.uISERVICE.activeRoundId = this.apiData[0].data.t1[0].mid;
            break;
          case "Lucky7-A":

            this.layLock = true;
            this.rtrnObj.markets[0].runners.forEach(element => {
              var runner = this.apiData[0].data.t2.find(x => x.sid == element.RunnerId);
              element.status = parseInt(runner.gstatus);
              this.uISERVICE.gStatus = parseInt(runner.gstatus);
              element.runners.availableToBack[0].price = runner.rate;
            });
            if (this.apiData[0].data.t1.length >= 0) {
              this.showcard = true;
            }
            if (this.apiData[0].data.t1[0].C1 != 1 && this.apiData[0].data.t1[0].C1 != null) {
              this.cardModel.CardNames = this.apiData[0].data.t1[0].C1;
            }
            if (this.roundId != this.apiData[0].data.t1[0].mid && this.roundId != "") {
              this.cardModel.MarketId = this.roundId;
              this.cardModel.MarketName = this.marketName;

              this.saveCards();
              this.uISERVICE.Bets = [];
            }
            this.roundId = this.apiData[0].data.t1[0].mid;
            this.uISERVICE.activeRoundId = this.apiData[0].data.t1[0].mid;

            break;

          case "Amar Akbar Anthony":

            this.rtrnObj.markets[0].runners.forEach(element => {
              var runner = this.apiData[0].data.t2.find(x => x.sid == element.RunnerId);
              element.status = runner.gstatus == "SUSPENDED" ? 0 : 1;
              this.uISERVICE.gStatus = runner.gstatus == "SUSPENDED" ? 0 : 1;
              element.runners.availableToBack[0].price = runner.b1;
              element.runners.availableToLay[0].price = runner.l1;
            });
            if (this.apiData[0].data.t1.length >= 0) {
              this.showcard = true;
            }
            if (this.apiData[0].data.t1[0].C1 != 1 && this.apiData[0].data.t1[0].C1 != null) {
              this.cardModel.CardNames = this.apiData[0].data.t1[0].C1;
            }

            if (this.roundId != this.apiData[0].data.t1[0].mid && this.roundId != "") {
              this.cardModel.MarketId = this.roundId;

              this.saveCards();
              this.uISERVICE.Bets = [];
            }
            this.roundId = this.apiData[0].data.t1[0].mid;
            this.uISERVICE.activeRoundId = this.apiData[0].data.t1[0].mid;
            break;
          case "DragonTiger20-20":

            this.rtrnObj.markets[0].runners.forEach(element => {
              var runner = this.apiData[0].data.t2.find(x => x.sid == element.RunnerId);
              element.status = parseInt(runner.gstatus);
              this.uISERVICE.gStatus = parseInt(runner.gstatus);
              element.runners.availableToBack[0].price = runner.rate;
            });
            if (this.apiData[0].data.t1.length >= 0) {
              this.showcard = true;
            }
            if (this.apiData[0].data.t1[0].C2 != 1 && this.apiData[0].data.t1[0].C2 != null) {
              this.cardModel.CardNames = this.apiData[0].data.t1[0].C1 + ',' +
                this.apiData[0].data.t1[0].C2;
            }
            if (this.roundId != this.apiData[0].data.t1[0].mid && this.roundId != "") {
              this.cardModel.MarketId = this.roundId;

              this.saveCards();
              this.uISERVICE.Bets = [];
            }
            this.roundId = this.apiData[0].data.t1[0].mid;
            this.uISERVICE.activeRoundId = this.apiData[0].data.t1[0].mid;
            break;

          case "AndarBahar":
            if (this.apiData[0].data.t1[0].mid != "0") {
              this.rtrnObj.markets[0].runners.forEach(element => {
                var runner = this.apiData[0].data.t2.find(x => x.sid == element.RunnerId);
                element.status = parseInt(runner.gstatus);
                this.uISERVICE.gStatus = parseInt(runner.gstatus);
                element.runners.availableToBack[0].price = 1.98;
              });
              /* cards display work  start */
              let cardObj = this.apiData[0].data.t1[0].Cards;
              var cards = cardObj.substring(0, cardObj.indexOf(",1,"));
              if (cards.length > 0) {
                this.cardsData = cards.split(",");
                this.BaharCards = [];
                this.AnderCards = [];
                this.cardsData.forEach((element, id) => {
                  if (id > 2) {
                    if (element != "") {
                      if (id % 2 == 0) {
                        this.AnderCards.push(element);
                      } else {
                        this.BaharCards.push(element);
                      }
                    }
                  }
                });
              }
            }
            if (this.apiData[0].data.t1[0].mid == "0") {
              var cardString = this.apiData[0].data.t1[0].Cards.substring(0, this.apiData[0].data.t1[0].Cards.indexOf("1"));
              this.cardModel.MarketId = this.roundId;
              this.cardModel.CardNames = cardString;
              this.uISERVICE.Bets = [];
              this.saveCards();
              setTimeout(() => {
                this.BaharCards = [];
                this.AnderCards = [];
              }, 5000);
            }
            this.roundId = this.apiData[0].data.t1[0].mid;
            this.uISERVICE.activeRoundId = this.apiData[0].data.t1[0].mid;
            /* end */
            break;


        }
        if (this.apiData[0].data.t1.length > 0) {
          this.showcard = true;
        }
      }

    } catch (error) {
      console.error(error);
    }
  }

  reIntBook() {
    if (this.rtrnObj != null && this.uISERVICE.Bets != null) {
      //Match_Odds
      var market = this.rtrnObj.markets.find(x => x.marketName == this.marketName);
      market.runners.forEach(element => {
        element.Book = 0;
      });

    }
  }

  calculateBook() {
    if (this.rtrnObj != null && this.uISERVICE.Bets != null) {
      this.reIntBook();
      //Match_Odds
      if (this.rtrnObj.markets.length > 0) {
        var market = this.rtrnObj.markets.find(x => x.marketName == this.marketName);
        var bets = this.uISERVICE.Bets.filter(x => x.MarketName == this.marketName);
        if (bets.length > 0) {
          market.runners.forEach(element => {
            bets.forEach(data => {

              if (data.RunnerId == element.RunnerId) {
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
  }

  async getApiResult() {
    const data = await this.http.get(this.rtrnObj.apiUrls.ResultAPIUrl).toPromise();
    this.apiDataResult = data;
    switch (this.marketName) {

      case "20-20 TeenPatti":
        this.apiDataResult.data.forEach(element => {
          if (element.result == '1') {
            element.Win = "A";
          } else if (element.result == '3') {
            element.result = 2;
            element.Win = "B";
          }
        });
        this.gameResult = this.apiDataResult.data;
        break;

      case "Lucky7-A":
        this.apiDataResult.data.forEach(element => {
          if (element.result == '0') {
            element.Win = "T";
          } else if (element.result == '1') {
            element.Win = "A";
          } else {
            element.Win = "B";
          }
        });
        this.gameResult = this.apiDataResult.data;
        break;

      case "AndarBahar":
        this.apiDataResult.data.forEach(element => {
          if (element.result == '1') {
            element.Win = "A";
          } else {
            element.Win = "B";
          }
        });
        this.gameResult = this.apiDataResult.data;
        break;

      case "DragonTiger20-20":
        this.apiDataResult.data.forEach(element => {
          if (element.result == '1') {
            element.Win = "D";
          } else {
            element.Win = "T";
          }
        });
        this.gameResult = this.apiDataResult.data;
        break;

      case "Amar Akbar Anthony":
        this.apiDataResult.data.forEach(element => {
          if (element.result == '1') {
            element.result = 1;
            element.Win = "AA";
          } else if (element.result == '2') {
            element.result = 2;
            element.Win = "AK";
          } else {
            element.result = 3;
            element.Win = "AN";
          }
        });
        this.gameResult = this.apiDataResult.data;
        break;
    }
  }

  sendUrl() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.rtrnObj.apiUrls.VedioUrl);
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
      if (mrktName == "TeenPatti1-day") {
        odds = "1." + odds;
      }
      if (odds > 0) {
        this.uISERVICE.showSlip = [false, false, false, false];
        this.uISERVICE.showSlip[mainIndex] = true;
        this.uISERVICE.betType = betType;
        this.uISERVICE.odds = odds;
        this.uISERVICE.price = price;
        this.uISERVICE.marketId = this.roundId;
        this.uISERVICE.rnrId = rId;
        this.uISERVICE.rName = rName;
        this.uISERVICE.maxMarkt = maxMrkt;
        this.uISERVICE.minMarkt = minMrkt;
        this.uISERVICE.betDelay = betDly
        this.uISERVICE.rIndx = rIndx;
        this.uISERVICE.mrktName = mrktName;
        this.uISERVICE.sportsId = 15;
        this.uISERVICE.eventId = this.eventId;
        this.uISERVICE.EventName = this.rtrnObj.EventName;
        this.uISERVICE.apiUrl = this.rtrnObj.apiUrls.APIUrl;
      }
    }

  }

}
