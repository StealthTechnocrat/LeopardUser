import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { UiService } from 'src/app/service/ui-service';
import { Location } from '@angular/common';
import { AccountService } from 'src/app/service/account-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-live-games',
  templateUrl: './live-games.component.html',
  styleUrls: ['./live-games.component.scss']
})
export class LiveGamesComponent implements OnInit {
  systemId: string;
  pageCode: string;
  // lobbyUrl: string;
  casinoDetails: any = [];
  iFrame: any = [];
  userId: string = Cookie.get('c_UserId');
  game_code: string;
  lobbyUrl: SafeResourceUrl;
  constructor(public sanitizer: DomSanitizer,private accountService: AccountService, private location: Location, private http: HttpClient, private route: ActivatedRoute, private router: Router, public uISERVICE: UiService) { }

  ngOnInit(): void {
    this.uISERVICE.sideBar = false;

    if (Cookie.check("usersCookies")) {
      this.route.paramMap.subscribe(params => {
        // this.pageCode = params.get('page');
        // this.systemId = params.get('system');
        this.game_code = params.get('game_code');
      });
      this.getLobbyLaunchUrl();
      // this.GetCasinoDetails();

    } else {
      this.uISERVICE.Header = false;
      this.uISERVICE.Error = true;
      this.uISERVICE.Message = "Please Login OR SignUp";
      this.location.back();
      setTimeout(() => {
        this.uISERVICE.Error = false;
      }, 2000);
    }
  }

  getLobbyLaunchUrl() {
    this.uISERVICE.loader=true;
    this.accountService.GetLobbyLaunch(this.game_code).then((response) => {
      debugger;
      if (response.Status) {        
        this.lobbyUrl = this.sanitizer.bypassSecurityTrustResourceUrl(response.Result);
        setTimeout(() => {
          this.uISERVICE.loader=false;
        }, 5000);
      }else{
        this.uISERVICE.loader=false;
        this.uISERVICE.Error=true;
        this.uISERVICE.Message=response.Result;
      }
    })
  }

  GetCasinoDetails() {
    this.accountService.GetCasinoDetails().then((response) => {
      if (response.Status) {
        
        this.casinoDetails = response.Result;
        this.OpenCasinoFrame();
      }
    })
  }

  OpenCasinoFrame() {
    
    this.userId = this.userId + "_" + this.casinoDetails.Currency;
    this.iFrame = '<iframe width="100%" height="250" frameborder="0" style="border:0" src="' + this.casinoDetails.Url + '/fundistAPI/apicheck/authHTML.php/?Page=' + this.pageCode + '&System=' + this.systemId + '&Login=' + this.userId + '&Password=DemoTesting123&currency=' + this.casinoDetails.Currency + '&mobile_status=0&UniversalLaunch=1&ExtParam=' + this.casinoDetails.ExtraParameter + '" allowfullscreen></iframe>';    
  }



}
