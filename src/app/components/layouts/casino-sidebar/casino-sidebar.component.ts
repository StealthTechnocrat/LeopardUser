import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { AccountService } from 'src/app/service/account-service';
import { UiService } from 'src/app/service/ui-service';




@Component({
  selector: 'app-casino-sidebar',
  templateUrl: './casino-sidebar.component.html',
  styleUrls: ['./casino-sidebar.component.scss']
})
export class CasinoSidebarComponent implements OnInit {
  tableGamesList:any=[];
  constructor(private accountService: AccountService,public uISERVICE:UiService,private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getTableGames();
    this.getCasinoProviders();
  }

  getTableGames() {
    this.uISERVICE.loader = true;
    this.accountService.GetTableGames().then((response) => {
      if (response.Status) {
        
        this.tableGamesList = response.Result;
      }
      this.uISERVICE.loader = false;
    })
  }


  getCasinoProviders() {
    this.accountService.GetCasinoProviders().then((response) => {
      
      if (response.Status) {
        this.uISERVICE.casinoProvidersList = response.Result;
      }
    })
  }

  redirect(type) {
    if(Cookie.check("usersCookies")){
      switch (type) {
        case 1:
          this.router.navigate(["/table-games/LiveGames/TeenPatti20-20"]);
          setTimeout(() => {
            window.location.reload();
          }, 200);
          break;
        case 2:
          this.router.navigate(["/table-games/LiveGames/TeenPatti1-day"]);
          setTimeout(() => {
            window.location.reload();
          }, 200);
          break;
          case 3:
          this.router.navigate(["table-games/LiveGames/TeenPatti-Test"]);
          setTimeout(() => {
            window.location.reload();
          }, 200);
          break;
          case 4:
          this.router.navigate(["/table-games/LiveGames/Lucky7-A" ]);
          setTimeout(() => {
            window.location.reload();
          }, 200);
          break;
          case 5:
          this.router.navigate(["/table-games/LiveGames/Lucky7-B"]);
          setTimeout(() => {
            window.location.reload();
          }, 200);
          break;
          case 6:
          this.router.navigate(["/table-games/LiveGames/Poker20-20"]);
          setTimeout(() => {
            window.location.reload();
          }, 200);
          break;
          case 7:
            this.router.navigate(["/table-games/LiveGames/Poker1-day"]);
            setTimeout(() => {
              window.location.reload();
            }, 200);
            break;
          case 8:
          this.router.navigate(["/table-games/LiveGames/AndarBahar"]);
          setTimeout(() => {
            window.location.reload();
          }, 200);
          break;
          case 9:
          this.router.navigate(["/table-games/LiveGames/DragonTiger20-20"]);
          setTimeout(() => {
            window.location.reload();
          }, 200);
          break;
          case 10:
          this.router.navigate(["/table-games/LiveGames/Amar-Akbar"]);
          setTimeout(() => {
            window.location.reload();
          }, 200);
          break;
        
  
        default:
          break;
      }
    }else{
      this.uISERVICE.Error=true;
      this.uISERVICE.Message="Please Login OR SignUp";
      setTimeout(() => {        
      this.uISERVICE.Error=false;
      }, 2000);
    }
   
  }

}
