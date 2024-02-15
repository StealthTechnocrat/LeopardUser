import { Component, OnInit } from "@angular/core";
import { Cookie } from "ng2-cookies";
import { ActivatedRoute, Router } from "@angular/router";
import { AccountService } from "src/app/service/account-service";
import { UiService } from "src/app/service/ui-service";

@Component({
  selector: "app-casino-game",
  templateUrl: "./casino-game.component.html",
  styleUrls: ["./casino-game.component.scss"],
})
export class CasinoGameComponent implements OnInit {
  systemId: string;
  casinoGamesList: any = [];
  developerId: string = "";
  gameList: any = [];
  developername: string = "";
  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    public uISERVICE: UiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (Cookie.check("usersCookies")) {
      this.route.paramMap.subscribe((params) => {
        this.developerId = params.get("developerId");
        this.developername = params.get("developer_name");
        localStorage.setItem("developerId", JSON.stringify(this.developerId));
        localStorage.setItem("developername",JSON.stringify(this.developername));
        this.uISERVICE.developerId = this.developerId;
        this.uISERVICE.developername = this.developername;
      });

      this.getGameList();
    } else {
      this.uISERVICE.Error = true;
      this.uISERVICE.Message = "Please Login OR SignUp";
      this.router.navigate(["games"]);
      setTimeout(() => {
        this.uISERVICE.Error = false;
      }, 2000);
    }
  }
  back() {
    debugger;
    this.uISERVICE.categoryId = JSON.parse(localStorage.getItem("categoryId"));
    this.uISERVICE.categoryName = JSON.parse(
      localStorage.getItem("categoryName")
    );
    this.router.navigate([
      `casino/${this.uISERVICE.categoryId}/${this.uISERVICE.categoryName}`,
    ]);
    localStorage.setItem("categoryId", '');
    localStorage.setItem("categoryName", '');
  }

  getGameList() {
    this.uISERVICE.loader = true;
    this.accountService.GetCasinoGames(this.developerId).then((response) => {
      if (response.Status) {
        this.gameList = response.Result.lists;
        this.uISERVICE.loader = false;
      } else {
        this.uISERVICE.loader = false;
      }
    });
  }

  sendData(data: any) {
    debugger;
    this.router.navigate(["/live-games", data]);
  }
}
