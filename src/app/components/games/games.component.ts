import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/service/account-service';
import { UiService } from 'src/app/service/ui-service';
import { HttpClient } from '@angular/common/http';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  rtrnObj: any = [];
  sportsId: number = 4;
  data: any = [];
  UserId: number = 0;
  Role: string;
  bannerList: any = [];
  type: string = "All";
  ScreenWidth = window.innerWidth;
  casinoProvidersList: any = [];
  constructor(private http: HttpClient, private accountService: AccountService, private router: Router, private route: ActivatedRoute, public uISERVICE: UiService) { }

  ngOnInit(): void {
    this.uISERVICE.sideBar = true;
    if (Cookie.check('usersCookies')) {
      this.uISERVICE.Header = true;
    } else {
      this.uISERVICE.Header = false;
    }

    this.getBanners();
  }

  

  getBanners() {
    
    this.accountService.GetBanner(this.type).then((response) => {
      if (response.Status) {
        
        if (this.ScreenWidth < 768) {
          this.bannerList = response.Result.filter((x: any) => x.BannerType == "Mobile")
        } else {
          this.bannerList = response.Result.filter((x: any) => x.BannerType == "Desktop");
        }
      } else {
      }
    });
    
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: false,
    smartSpeed: 1000,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: false
  }
}
