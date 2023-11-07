import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/service/account-service';
import { UiService } from 'src/app/service/ui-service';


@Component({
  selector: 'app-casino-game',
  templateUrl: './casino-game.component.html',
  styleUrls: ['./casino-game.component.scss']
})
export class CasinoGameComponent implements OnInit {
  systemId: string;
  casinoGamesList:any=[];
  constructor(private accountService: AccountService, private route: ActivatedRoute, public uISERVICE: UiService, private router: Router) { }


  ngOnInit(): void {
    if (Cookie.check("usersCookies")) {
      this.route.paramMap.subscribe(params => {
        this.systemId = params.get('systemId');
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

  getGameList() {
    this.uISERVICE.loader = true;
    this.casinoGamesList = [];
    this.accountService.GetCasinoGames(this.systemId).then((response) => {      
      if (response.Status) {       
        this.casinoGamesList = response.Result;
        this.uISERVICE.loader = false;
      }
    })
  }

}
