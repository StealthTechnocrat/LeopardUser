import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import { AccountService } from 'src/app/service/account-service';
import { UiService } from 'src/app/service/ui-service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  crc_Lst: any = [];
  scr_Lst: any = [];
  tns_Lst: any = [];
  seriesList: any = [];
  eventList : any = [];
  constructor(private accountService: AccountService, public uISERVICE: UiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    // $('ul.list a.main_drop').click(function () {
    //   var $step1 = $(this).parent().find('ul.step_1');
    //   $('ul.list ul.step_1').not($step1).slideUp();
    //   $('ul.list a.main_drop').removeClass('drop_open');

    //   $(this).toggleClass('drop_open');
    //   $step1.slideToggle();

    //   setTimeout(function () {
    //     $step1.find('a').click(function (event) {
    //       event.stopPropagation();

    //       if ($('.dropInner').hasClass('drop_open')) {
    //         $('.dropInner').removeClass('drop_open');
    //         $('ul.step_2').removeClass('d-block');

    //         $(this).addClass('drop_open');
    //         $(this).parent().find('ul.step_2').addClass('d-block');
    //       } else {
    //         $(this).addClass('drop_open');
    //         $(this).parent().find('ul.step_2').addClass('d-block');
    //       }
    //     });
    //   }, 1000);
    // });
  }
  

  getSrsData(sportsId) {    
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  redirectfun(sptId, eveId) {
    debugger;
    this.router.navigate(["/set-bet/",sptId,eveId]);
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }

  getCompList(sportsId) {
    this.seriesList = []
    this.accountService.getCompList(sportsId).then((response) => {
      if (response) {
        this.seriesList = response.Result;
        console.log("comp",this.seriesList)
      } else {
        this.seriesList = [];
      }
    });
  }
  getEventList(sportsId,seriesId) {
    debugger;
    this.eventList = [];
    this.accountService.getEventList(sportsId,seriesId).then((response) => {
      if (response) {
        this.eventList = response.Result;
        console.log("evt",this.eventList)
      } else {
        this.eventList = [];
      }
    });
  }

}
