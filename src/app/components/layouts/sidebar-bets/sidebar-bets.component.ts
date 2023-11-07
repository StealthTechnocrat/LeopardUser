import { UiService } from './../../../service/ui-service';
import { Component, OnInit } from "@angular/core";
import { Cookie } from "ng2-cookies";
import { AccountService } from 'src/app/service/account-service';

@Component({
  selector: "app-sidebar-bets",
  templateUrl: "./sidebar-bets.component.html",
  styleUrls: ["./sidebar-bets.component.scss"],
})
export class SidebarBetsComponent implements OnInit {
  sportsId:number=0;
  marketName:string="All";
  BetType:string="All";
  constructor( public uISERVICE: UiService, private accountService: AccountService) { }

  ngOnInit(): void {
    if (Cookie.check('usersCookies')) {
      this.uISERVICE.Header = true;
    } else {
      this.uISERVICE.Header = false;
    }
  }

  

  GetAllBets() {
    
    this.accountService.getPendingBets('Null',this.sportsId,this.marketName,this.BetType,0,0).then((response) => {
      
      if (response.Status) {
        this.uISERVICE.backUpBets=response.Result;
        this.uISERVICE.Bets=response.Result;
        localStorage.setItem('Bets', JSON.stringify(this.uISERVICE.Bets));
      } else {
        this.uISERVICE.Bets=[];
      }
    });
  }



}
