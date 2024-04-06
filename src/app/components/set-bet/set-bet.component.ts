import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { AccountService } from 'src/app/service/account-service';
import { UiService } from 'src/app/service/ui-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { parse } from 'path';
import * as $ from "jquery";
// import 'jquery-ui-dist/jquery-ui';
@Component({
  selector: 'app-set-bet',
  templateUrl: './set-bet.component.html',
  styleUrls: ['./set-bet.component.scss']
})
export class SetBetComponent implements OnInit {
  sportsId: number;
  eventId: string;
  rtrnObj: any = [];
  sesnObj: any = [];
  type: string = "Before";
  MtchMrkt: string;
  apiData: any = [];
  bookApiData: any = [];
  matchData: any = [];
  url: string;
  scoreData: any = [];
  public _setInterval1: any;
  public _setInterval2: any;
  scoreApi: boolean = true;
  fancy: string;
  ssnBook: any = [];
  date: Date;
  marketName: string = "All";
  BetType: string = "All";
  sessonProfitLoss: any = [];
  sessonBookList: any = [];
  modalVisible: boolean = false;
  closeResult = '';
  scoreUrlFrame: SafeResourceUrl;
  fancyBetStatus: boolean = false;
  BetStatus: boolean = false;

  constructor(private router: Router, public sanitizer: DomSanitizer, private http: HttpClient, private accountService: AccountService, private route: ActivatedRoute, public uISERVICE: UiService, private modalService: NgbModal) { }
  toggleModal() {
    this.modalVisible = !this.modalVisible;
  }
  ngOnInit(): void {
    this.uISERVICE.sideBar = true;
    if (Cookie.check("usersCookies")) {
      this.type = "After";
      this.uISERVICE.showSlip = [];
      this.uISERVICE.profit = 0;
      this.uISERVICE.stake = 0;
      this.uISERVICE.exposure = 0;
      this.route.paramMap.subscribe(params => {
        this.sportsId = parseInt(params.get('sportsId'));
        this.eventId = params.get('eventId');
        this.getEventDetail();
        this.scoreUrl();
        setTimeout(() => {
          this.myFunction();
        }, 2000);
      });
    } else {
      this.uISERVICE.Error = true;
      this.uISERVICE.Message = "Please Login OR SignUp";
      this.router.navigate(["games"]);
      setTimeout(() => {
        this.uISERVICE.Error = false;
      }, 2000);
    }
  }
  GetAllBets() {
    this.uISERVICE.backUpBets = [];
    this.accountService.getPendingBets('Null', this.sportsId, this.marketName, this.BetType, 0, 0).then((response) => {
      if (response.Status) {

        this.uISERVICE.backUpBets = response.Result.filter(x => x.EventName == this.rtrnObj.EventName);
      } else {
        this.uISERVICE.backUpBets = [];
      }
    });
  }
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  async myFunction() {
    return await new Promise(resolve => {
      this._setInterval1 = setInterval(() => {
        this.getAPIData();
      }, 1500);
      this._setInterval2 = setInterval(() => {
        this.calculateBook();
      }, 3000);
    });
  }



  ngOnDestroy() {
    clearInterval(this._setInterval1);
    clearInterval(this._setInterval2);
  }


  fancyBook(sId, fancyName) {

    this.fancy = fancyName
    this.sessonBookList = [];
    const fancyBets = this.uISERVICE.Bets.filter(x => x.RunnerId == sId && x.EventId == this.eventId);
    if (fancyBets.length > 0) {
      const minOdds = Math.min(...fancyBets.map(x => x.Odds));
      const maxOdds = Math.max(...fancyBets.map(x => x.Odds));
      const min = minOdds - 5;
      const max = maxOdds + 50;

      this.sessonBookList = Array.from({ length: max - min + 1 }, () => ({ RunValue: 0, Pl: 0 }));

      fancyBets.forEach(element => {
        if (element.BetType == "Yes") {
          for (let index = min; index <= max; index++) {
            const currentIndex = index - min;
            if (index < element.Odds) {
              this.sessonBookList[currentIndex].RunValue = index;
              this.sessonBookList[currentIndex].Pl -= element.Exposure;
            } else {
              this.sessonBookList[currentIndex].RunValue = index;
              this.sessonBookList[currentIndex].Pl += element.Profit;
            }
          }
        } else {
          for (let index = min; index <= max; index++) {
            const currentIndex = index - min;
            if (index < element.Odds) {
              this.sessonBookList[currentIndex].RunValue = index;
              this.sessonBookList[currentIndex].Pl += element.Profit;
            } else {
              this.sessonBookList[currentIndex].RunValue = index;
              this.sessonBookList[currentIndex].Pl -= element.Exposure;
            }
          }
        }
      });
    }

  }

  getSessionPl(runnerId): number {
    this.sessonProfitLoss = [];
    const fancyBets = this.uISERVICE.Bets.filter(x => x.RunnerId == runnerId && x.EventId == this.eventId);
    if (fancyBets.length > 0) {
      const minOdds = Math.min(...fancyBets.map(x => x.Odds));
      const maxOdds = Math.max(...fancyBets.map(x => x.Odds));
      const min = minOdds - 5;
      const max = maxOdds + 50;

      this.sessonProfitLoss = Array.from({ length: max - min + 1 }, () => ({ RunValue: 0, Pl: 0 }));

      fancyBets.forEach(element => {
        if (element.BetType == "Yes") {
          for (let index = min; index <= max; index++) {
            const currentIndex = index - min;
            if (index < element.Odds) {
              this.sessonProfitLoss[currentIndex].RunValue = index;
              this.sessonProfitLoss[currentIndex].Pl -= element.Exposure;
            } else {
              this.sessonProfitLoss[currentIndex].RunValue = index;
              this.sessonProfitLoss[currentIndex].Pl += element.Profit;
            }
          }
        } else {
          for (let index = min; index <= max; index++) {
            const currentIndex = index - min;
            if (index < element.Odds) {
              this.sessonProfitLoss[currentIndex].RunValue = index;
              this.sessonProfitLoss[currentIndex].Pl += element.Profit;
            } else {
              this.sessonProfitLoss[currentIndex].RunValue = index;
              this.sessonProfitLoss[currentIndex].Pl -= element.Exposure;
            }
          }
        }
      });
      const data = this.sessonProfitLoss.find(x => x.RunValue == maxOdds);
      return data ? data.Pl : 0;
    }
    return 0;
  }

  LiveTv() {
    if (this.uISERVICE.tv) {
      this.uISERVICE.tv = false;
      this.url = "";
      this.uISERVICE.IframeUrl = "";
    } else {
      this.uISERVICE.tv = true;
      this.url = this.rtrnObj.apiUrls.TvUrl + this.eventId;
      this.uISERVICE.IframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    }
  }

  counter(i: number) {
    return new Array(i);
  }

  async getScore() {
    this.http.get(this.rtrnObj.apiUrls.ScoreUrl + this.eventId).subscribe(data => {
      this.scoreData = data;

      if (this.scoreData.length > 0) {
        this.scoreApi = true;
      } else {
        this.scoreData = [];
        this.scoreApi = false;
      }
    });
  }

  async getEventDetail() {
    //this.uISERVICE.loader = true;
    this.accountService.getEvntDetail(this.eventId, this.type).then((response) => {
      if (response.Status) {
        if (response.Result.userInfo.deleted == true) {
          this.uISERVICE.Error = true;
          this.uISERVICE.Message = "Account Deleted";
          setTimeout(() => {
            this.uISERVICE.Error = false;
          }, 2000);
        } else {
          if (response.Result.userInfo.status == true) {
            this.fancyBetStatus = response.Result.userInfo.FancyBetStatus;
            this.uISERVICE.BetStatus = response.Result.userInfo.BetStatus;
            this.uISERVICE.Error = true;
            this.uISERVICE.Message = "Account Blocked";
            setTimeout(() => {
              this.uISERVICE.Error = false;
            }, 2000);
          } else {
            this.uISERVICE.Bets = response.Result.Bets;
            response.Result.markets.forEach((element, i) => {
              if (element.marketName == "Match Odds") {
                this.MtchMrkt = element.MarketId;
              }

              if (element.marketName == "To Win the Toss") {
                element.runners.forEach(data => {
                  data.runners = {
                    'availableToBack': [{ 'price': 1.95, 'size': 100 }, { 'price': 0, 'size': 0 }, { 'price': 0, 'size': 0 }],
                    'availableToLay': [{ 'price': 0, 'size': 0 }, { 'price': 0, 'size': 0 }, { 'price': 0, 'size': 0 }]
                  }
                });
              } else {
                element.runners.forEach(data => {
                  data.runners = {
                    'availableToBack': [{ 'price': 0, 'size': 0 }, { 'price': 0, 'size': 0 }, { 'price': 0, 'size': 0 }],
                    'availableToLay': [{ 'price': 0, 'size': 0 }, { 'price': 0, 'size': 0 }, { 'price': 0, 'size': 0 }]
                  }
                });
              }
            });
            this.uISERVICE.loader = false;
            this.rtrnObj = response.Result;
            this.uISERVICE.betSlip = this.rtrnObj.chips;
            this.getAPIData();
            this.checkToss();
          }
        }
      } else {
        this.uISERVICE.loader = false;
        this.rtrnObj = [];
      }
    });
  }

  async getAPIData() {
    switch (this.sportsId) {
      case 1:
      case 2:
        this.matchData = this.rtrnObj.markets.find(x => x.marketName === "Match Odds");
        if (this.matchData != null) {
          await this.http.get(this.rtrnObj.apiUrls.BetfairUrl + this.sportsId + "&marketid=" + this.MtchMrkt).subscribe(data => {
            this.apiData = data;
            if (this.apiData.marketId != null) {
              this.updateRunnerData(this.matchData.runners, this.apiData.runners, this.sportsId);
            }
          });
        }
        break;
      case 4:
        this.matchData = this.rtrnObj.markets.find(x => x.marketName === "Match Odds");
        const BookData = this.rtrnObj.markets.find(x => x.marketName === "BookMaker");
        if (this.matchData != null) {
          if (this.matchData.ApiUrlType == 1) {
            await this.http.get(this.rtrnObj.apiUrls.DaimondUrl + this.MtchMrkt + "/" + this.eventId).subscribe(data => {
              this.apiData = data;

              if (this.apiData.market != null && this.apiData.market?.length > 0) {
                this.sesnObj = this.apiData.session.filter(x => !x.RunnerName.includes(".3"));
                this.sesnObj.sort((a, b) => a.RunnerName.localeCompare(b.RunnerName));
                this.updateRunnerData(this.matchData.runners, this.apiData.market[0].events, this.sportsId);
              } if (this.apiData.session != null && this.apiData.session?.length > 0) {
                this.sesnObj = this.apiData.session.filter(x => !x.RunnerName.includes(".3"));
                this.sesnObj.sort((a, b) => a.RunnerName.localeCompare(b.RunnerName));
              }
            });
          } else {
            if(this.MtchMrkt=="1.214830846"){
              await this.http.get("https://mlive365day.com/apps/testA-t.php?sportsid=1&marketid=" + this.MtchMrkt).subscribe(data => {
                this.apiData = data;
                debugger;
                if (this.apiData.marketId != null) {
                  this.updateRunnerData(this.matchData.runners, this.apiData.runners, 1);
                }
              });
            }else{
              await this.http.get(this.rtrnObj.apiUrls.BetfairUrl + this.sportsId + "&marketid=" + this.MtchMrkt).subscribe(data => {
                this.apiData = data;
                if (this.apiData.marketId != null) {
                  this.updateRunnerData(this.matchData.runners, this.apiData.runners, 1);
                }
              });
            }
          }
        }
        if (BookData != null) {
          await this.http.get(this.rtrnObj.apiUrls.BookMakerUrl + this.MtchMrkt + "/" + this.eventId).subscribe(data => {
            this.bookApiData = data;
            if (this.bookApiData.market != null && this.bookApiData.market?.length > 0) {
              if (this.sesnObj.length === 0) {
                this.sesnObj = this.bookApiData.session;
              }
              this.updateRunnerData(BookData.runners, this.bookApiData.market[0].events, this.sportsId);
            }
          });
        }
        break;
    }

    // if (this.rtrnObj.Inplay && this.scoreApi) {
    //   this.getScore();
    // }
    this.calculateBook();
  }

  updateRunnerData(runners, apiRunners, sportsId) {

    runners.forEach((element, index) => {
      if (sportsId == 4) {
        const runner = apiRunners[index];//apiRunners.find(x => x.SelectionId == element.RunnerId.toString());
        element.runners.availableToBack[0].price = runner.BackPrice1;
        element.runners.availableToBack[0].size = runner.BackSize1;
        element.runners.availableToBack[1].price = runner.BackPrice3;
        element.runners.availableToBack[1].size = runner.BackSize3;
        element.runners.availableToBack[2].price = runner.BackPrice2;
        element.runners.availableToBack[2].size = runner.BackSize2;
        element.runners.availableToLay[0].price = runner.LayPrice1;
        element.runners.availableToLay[0].size = runner.LaySize1;
        element.runners.availableToLay[1].price = runner.LayPrice3;
        element.runners.availableToLay[1].size = runner.LaySize3;
        element.runners.availableToLay[2].price = runner.LayPrice2;
        element.runners.availableToLay[2].size = runner.LaySize2;
      } else {
        const runner = apiRunners[index];//apiRunners.find(x => x.selectionId == element.RunnerId);
        element.runners.availableToBack[0].price = runner.availableToBack[0].price;
        element.runners.availableToBack[0].size = runner.availableToBack[0].size;
        element.runners.availableToBack[1].price = runner.availableToBack[1].price;
        element.runners.availableToBack[1].size = runner.availableToBack[1].size;
        element.runners.availableToBack[2].price = runner.availableToBack[2].price;
        element.runners.availableToBack[2].size = runner.availableToBack[2].size;
        element.runners.availableToLay[0].price = runner.availableToLay[0].price;
        element.runners.availableToLay[0].size = runner.availableToLay[0].size;
        element.runners.availableToLay[1].price = runner.availableToLay[1].price;
        element.runners.availableToLay[1].size = runner.availableToLay[1].size;
        element.runners.availableToLay[2].price = runner.availableToLay[2].price;
        element.runners.availableToLay[2].size = runner.availableToLay[2].size;
      }

    });
  }


  reIntBook() {
    if (this.rtrnObj != null && this.uISERVICE.Bets != null) {
      //Match_Odds
      var market = this.rtrnObj.markets.find(x => x.marketName == "Match Odds");
      market.runners.forEach(element => {
        element.Book = 0;
      });
      if (this.sportsId == 4) {
        //BookMaker
        var bookMrkt = this.rtrnObj.markets.find(x => x.marketName == "BookMaker");
        if (bookMrkt != null && bookMrkt != undefined) {
          bookMrkt.runners.forEach(element => {
            element.Book = 0;
          });
        }
        //To Win the Toss
        var tossMrkt = this.rtrnObj.markets.find(x => x.marketName == "To Win the Toss");
        if (tossMrkt != null && tossMrkt != undefined) {
          tossMrkt.runners.forEach(element => {
            element.Book = 0;
          });
        }
      }
    }
  }

  calculateBook() {

    if (this.rtrnObj != null && this.uISERVICE.Bets != null) {
      this.reIntBook();
      //Match_Odds
      var market = this.rtrnObj.markets.find(x => x.marketName == "Match Odds");
      var bets = this.uISERVICE.Bets.filter(x => x.MarketName == "Match Odds");
      if (bets.length > 0) {
        market.runners.forEach(element => {
          bets.forEach(data => {
            ;;
            if (data.RunnerId == element.id.toString()) {
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
      if (this.sportsId == 4) {
        //BookMaker
        var bookMrkt = this.rtrnObj.markets.find(x => x.marketName == "BookMaker");
        var bets = this.uISERVICE.Bets.filter(x => x.MarketName == "BookMaker");
        if (bets.length > 0) {
          bookMrkt.runners.forEach(element => {
            bets.forEach(data => {
              if (data.RunnerId == element.id.toString()) {
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
        //To Win the Toss

        var tossMrkt = this.rtrnObj.markets.find(x => x.marketName == "To Win the Toss");
        var bets = this.uISERVICE.Bets.filter(x => x.MarketName == "To Win the Toss");
        if (tossMrkt != null) {
          if (bets.length > 0) {
            tossMrkt.runners.forEach(element => {
              bets.forEach(data => {
                if (data.RunnerId == element.id.toString()) {
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
  }

  checkLogin() {
    if (!Cookie.get("usersCookies")) {
      this.uISERVICE.logIn = false;
      this.uISERVICE.logIn = true;
    }
  }

  scoreUrl() {
    debugger;
    this.url = "https://nxbet247.com/live-score-card/" + this.sportsId + "/" + this.eventId;
    this.scoreUrlFrame = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }


  setValues(betType, odds, price, mId, rId, rName, maxMrkt, minMrkt, rIndx, mrktName, mainIndex, betDly) {
    if (odds > 0) {
      this.checkLogin();
      if (!this.uISERVICE.logIn) {
        this.uISERVICE.profit = 0;
        this.uISERVICE.exposure = 0;
        this.uISERVICE.stake = 0;
        if (mrktName != "Fancy") {
          this.uISERVICE.fancySlip = [];
          this.uISERVICE.showSlip = [false, false, false, false];
          this.uISERVICE.showSlip[mainIndex] = true;
        } else {
          this.uISERVICE.showSlip = [false, false, false, false];
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

  // fancyBook(mrkId, sId, name) {
  //   this.ssnBook = [];
  //   this.fancy = name;
  //   this.accountService.getFancyBook(sId, mrkId).then((response) => {
  //     if (response.Status) {
  //       this.ssnBook = response.Result;
  //     } else {
  //     }
  //   });
  // }


  checkToss() {

    this.date = new Date();
    let crntDate = this.date.toString();
    const diffInMs = Date.parse(this.rtrnObj.EventTime) - Date.parse(crntDate);
    const diffInHours = diffInMs / 1000 / 60 / 60;
    if (diffInHours < 1) {
      var tossMrkt = this.rtrnObj.markets.find(x => x.marketName == "To Win the Toss");
      if (tossMrkt != null) {
        tossMrkt.status = true;

        this.rtrnObj.markets.splice(this.rtrnObj.markets.indexOf(tossMrkt), 1);
      }
    }
  }
  // ngAfterViewInit() {




  //   $('.tvModal .modal-content').resizable({
  //     alsoResize: ".tvModal .modal-dialog",
  //     minHeight: 300,
  //     minWidth: 300
  // });
  // $('.tvModal ').draggable();

  // $('#myModal').on('show.bs.modal', function () {
  //     $(this).find('.tvModal ').css({
  //         'max-height':'100%'
  //     });
  // });
  // }
}
