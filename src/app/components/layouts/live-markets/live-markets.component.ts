import { Location } from "@angular/common";
import { Component, OnInit,ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Cookie } from "ng2-cookies";
import { AccountService } from "src/app/service/account-service";
import { UiService } from "src/app/service/ui-service";

@Component({
  selector: "app-live-markets",
  templateUrl: "./live-markets.component.html",
  styleUrls: ["./live-markets.component.scss"],
})
export class LiveMarketsComponent implements OnInit {
  @ViewChild('todayTab') todayTab: ElementRef;
  sportsId: number = 4;
  rtrnObj: any;
  reqType: string = "All";
  chkCnd: string = "Before";
  cndtn: string = "1";
  currentDate=Date;
  nextDate=Date;
  hideTab:boolean=true;
  evtType: string = "Home"
  cricEvt: number = 0;
  cricInplayEvt: number = 0;
  footEvt: number = 0;
  footInplayEvt: number = 0;
  tennEvt: number = 0;
  tennInplayEvt: number = 0;
  totalInplay: number = 0;
  popularGames:any=[];
  popularGamesName:any=[]
  providers:string='Ezugi,Evolution Gaming';
  prevIndex:number=0;
  casinoProviderList:any=[];
  sndvalue:string = ""
  casinoGamesList:any=[];

  constructor(
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    public uISERVICE: UiService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.GetEventDetails();
    if(this.location.path().includes("match-list")){
      debugger;
      localStorage.setItem("developername", '')
      this.hideTab=false;
      this.route.paramMap.subscribe(params => {
        this.sportsId = parseInt(params.get('sportsId'));     
      });
    }
  
    if (Cookie.check('usersCookies')) {
      this.chkCnd = "After";
      this.GetDetail();
      this.getCasinoCategory();
    } else {
      this.uISERVICE.Header = false;
      this.GetDetail();
      this.getCasinoCategory();
    }
    
  }

  getCasinoCategory() {
    this.accountService.GetCasinoCategory().then((response) => {
      
      if (response.Status) {
        this.uISERVICE.casinoCategoryList = response.Result.lists;
        this.getCasinoProvider(this.uISERVICE.casinoCategoryList[0].id,0)
      }
    });
    this.getPopularGames();
  }


  getCasinoProvider(categoryId: string, index) {
    this.uISERVICE.loader=true;
    this.casinoProviderList =[];
    this.accountService.GetCasinoProvider(categoryId).then((response) => {
      
      if (response.Status) {
        this.uISERVICE.casinoCategoryList.forEach(element => {
          element.status = false;
        });
        this.uISERVICE.casinoCategoryList[this.prevIndex].status = false;
        this.uISERVICE.casinoCategoryList[index].status = true;
        this.prevIndex = index;
        this.casinoProviderList = response.Result.lists;  
      }
      
    this.uISERVICE.loader=false;
    });
  }

  getPopularGames(){
    this.accountService.GetPopularGames(this.providers).then((response) => {
      
      if (response.Status) {
       this.popularGames=response.Result
      }

    })
  }

  getGameList(systemId: string, index) {

    this.casinoGamesList = [];
    this.accountService.GetCasinoGames(systemId).then((response) => {
      
      if (response.Status) {
        this.uISERVICE.casinoProvidersList.forEach(element => {
          element.status = false;
        });
        this.uISERVICE.casinoProvidersList[this.prevIndex].status = false;
        this.uISERVICE.casinoProvidersList[index].status = true;
        this.prevIndex = index;
        this.casinoGamesList = response.Result;
        //this.uISERVICE.loader = false;
      }

    })
  }

  setTab(value: string){
this.evtType = value;
this.GetEventDetails();
  }

  GetEventDetails() {
    this.uISERVICE.loader = true;
    this.rtrnObj = [];

    this.accountService.getEventDtl(this.evtType).then((response) => {

      if (response.Status) {
        this.uISERVICE.loader = false;
        this.rtrnObj = response.Result;
        if(this.evtType == "Home" || this.evtType == "Inplay") {
          this.cricEvt = response.cricketCount;
          this.cricInplayEvt = response.cricketInplayCount;
          this.footEvt = response.footballCount;
          this.footInplayEvt = response.footballInplayCount;
          this.tennEvt = response.TennisCount;
          this.tennInplayEvt = response.TennisInplayCount;
          this.totalInplay = this.cricInplayEvt + this.footInplayEvt  + this.tennInplayEvt;
        }
        // if (this.reqType == "All") {
          this.uISERVICE.News = this.rtrnObj.News;
        //   this.uISERVICE.TopEvents = this.rtrnObj.TopEvents;
        //   this.uISERVICE.TopInplay = this.rtrnObj.TopInplay;
          this.uISERVICE.Bets = this.rtrnObj.Bets;
        //   localStorage.setItem('TopEvents', JSON.stringify(this.rtrnObj.TopEvents));
        //   localStorage.setItem('News', JSON.stringify(this.rtrnObj.News));
        //   localStorage.setItem('TopInplay', JSON.stringify(this.rtrnObj.TopInplay));
        //   if (this.chkCnd == "After") {
        //     localStorage.setItem('Bets', JSON.stringify(this.rtrnObj.Bets));
        //   }
        // }
      } else {
        this.uISERVICE.loader = false;
        this.rtrnObj = [];
      }
    });
  }

  GetDetail() {
    this.uISERVICE.loader = true;
    this.accountService.getDetailLst(this.sportsId, this.reqType, this.chkCnd).then((response) => {

      if (response.Status) {
        this.uISERVICE.loader = false;
        // this.rtrnObj = response.Result;
        if (this.reqType == "All") {
          this.uISERVICE.News = response.Result.News;
          // this.uISERVICE.TopEvents = this.rtrnObj.TopEvents;
          // this.uISERVICE.TopInplay = this.rtrnObj.TopInplay;
          this.uISERVICE.Bets = response.Result.Bets;
          // localStorage.setItem('TopEvents', JSON.stringify(this.rtrnObj.TopEvents));
          // localStorage.setItem('News', JSON.stringify(this.rtrnObj.News));
          // localStorage.setItem('TopInplay', JSON.stringify(this.rtrnObj.TopInplay));
          if (this.chkCnd == "After") {
            localStorage.setItem('Bets', JSON.stringify(response.Result.Bets));
          }
        }
      } else {
        this.uISERVICE.loader = false;
        this.rtrnObj = [];
      }
    });
  }

  changeSportsId(sportsId, reqType) {
    this.sportsId = sportsId;
    this.reqType = reqType;
    this.uISERVICE.News = JSON.parse(localStorage.getItem("News"));
    this.uISERVICE.TopEvents = JSON.parse(localStorage.getItem("TopEvents"));
    this.uISERVICE.TopInplay = JSON.parse(localStorage.getItem("TopInplay"));
    this.todayTab.nativeElement.click();
    if (this.chkCnd == "After") {
      this.uISERVICE.Bets = JSON.parse(localStorage.getItem("Bets"));
    }
    this.GetDetail();
  }
  

  checkLogin(type, systemId) {
    if (!Cookie.get("usersCookies")) {
      if (type == "Live") {
        this.uISERVICE.live = true;
        this.router.navigate(["games"]);
      } else if (type == "UpCom") {
        this.uISERVICE.live = false;
        this.router.navigate(["games"]);
      } else {
        switch (type) {
          case 'table':
            this.router.navigate(["/casino/", type]);
            break;
          case 'live-games':
            this.router.navigate(["/casino/", type]);
            break;
          case 'SatkaMatka':
            this.router.navigate(["/satka-matka/"]);
            break;
          case 'CupRate':
            this.router.navigate(["/cup-rate/", 4, 28127348]);
            break;
          case 'Live':
            this.uISERVICE.live = true;
            this.router.navigate(["games"]);
            break;
          case 'UpCom':
            this.uISERVICE.live = false;
            this.router.navigate(["games"]);
            break;
        }
      }
    } else {
      switch (type) {
        case 'table':
          this.router.navigate(["/casino/", type]);
          break;
        case 'live-games':
          this.router.navigate(["/casino/", type]);
          break;
        case 'SatkaMatka':
          this.router.navigate(["/satka-matka/"]);
          break;
        case 'CupRate':
          this.router.navigate(["/cup-rate/", 4, 28127348]);
          break;
        case 'Live':
          this.uISERVICE.live = true;
          this.router.navigate(["games"]);
          break;
        case 'UpCom':
          this.uISERVICE.live = false;
          this.router.navigate(["games"]);
          break;
      }

    }
  }

}
