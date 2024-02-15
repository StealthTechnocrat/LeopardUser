import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Cookie } from "ng2-cookies";
import { AccountService } from "src/app/service/account-service";
import { UiService } from "src/app/service/ui-service";

@Component({
  selector: "app-casino",
  templateUrl: "./casino.component.html",
  styleUrls: ["./casino.component.scss"],
})
export class CasinoComponent implements OnInit {
  gameType: string;
  casinoGamesList: any = [];
  prevIndex: number = 0;
  systemId: string;
  gameList: any = [];
  casinoProviderList: any = [];
  categoryId: string = "";
  categoryName: string = "";
  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    public uISERVICE: UiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (Cookie.check("usersCookies")) {
      this.uISERVICE.sideBar = true;
      this.route.paramMap.subscribe((params) => {
        this.categoryId = params.get("categoryId");
        this.categoryName = params.get("name");
        this.uISERVICE.categoryId = this.categoryId;
        this.uISERVICE.categoryName = this.categoryName;
        localStorage.setItem(
          "categoryId",
          JSON.stringify(this.uISERVICE.categoryId)
        );
        localStorage.setItem(
          "categoryName",
          JSON.stringify(this.uISERVICE.categoryName)
        );
      });
      this.getCasinoProvider(this.categoryId);
      // this.route.paramMap.subscribe(params => {
      //   this.gameType = params.get('type');
      //   if (params.get('systemId') != undefined) {
      //     this.prevIndex = parseInt(params.get('index'));
      //     this.systemId = params.get('systemId');
      //   }else{

      //     this.systemId=this.uISERVICE.casinoProvidersList[0].SystemId;
      //   }
      // });
      // if (this.gameType == "live-games") {
      //   this.getGameList(this.systemId, this.prevIndex);
      // } else {
      //   this.getTableGames();
      // }
    } else {
      this.uISERVICE.Error = true;
      this.uISERVICE.Message = "Please Login OR SignUp";
      this.router.navigate(["games"]);
      setTimeout(() => {
        this.uISERVICE.Error = false;
      }, 2000);
    }
  }

  getCasinoProvider(categoryId) {
    this.uISERVICE.loader = true;
    this.casinoProviderList = [];
    this.accountService.GetCasinoProvider(categoryId).then((response) => {
      if (response.Status) {
        this.casinoProviderList = response.Result.lists;
      }
      this.uISERVICE.loader = false;
    });
  }

  getGameList(systemId: string, index) {
    this.casinoGamesList = [];
    this.accountService.GetCasinoGames(systemId).then((response) => {
      if (response.Status) {
        this.uISERVICE.casinoProvidersList.forEach((element) => {
          element.status = false;
        });
        this.uISERVICE.casinoProvidersList[this.prevIndex].status = false;
        this.uISERVICE.casinoProvidersList[index].status = true;
        this.prevIndex = index;
        this.casinoGamesList = response.Result;
        //this.uISERVICE.loader = false;
      }
    });
  }

  // getTableGames() {
  //   this.uISERVICE.loader = true;
  //   this.accountService.GetTableGames().then((response) => {
  //     if (response.Status) {

  //       this.gameList = response.Result;
  //     }
  //     this.uISERVICE.loader = false;
  //   })
  // }

  // getCasinoProviders() {
  //   this.accountService.GetCasinoProviders().then((response) => {

  //     if (response.Status) {
  //       this.uISERVICE.casinoProvidersList = response.Result;
  //     }
  //   })
  // }

  // getGameList(systemId: string, index) {

  //   this.casinoGamesList = [];
  //   this.accountService.GetCasinoGames(systemId).then((response) => {

  //     if (response.Status) {
  //       this.uISERVICE.casinoProvidersList.forEach(element => {
  //         element.status = false;
  //       });
  //       this.uISERVICE.casinoProvidersList[this.prevIndex].status = false;
  //       this.uISERVICE.casinoProvidersList[index].status = true;
  //       this.prevIndex = index;
  //       this.casinoGamesList = response.Result;
  //       //this.uISERVICE.loader = false;
  //     }

  //   })
  // }
}
