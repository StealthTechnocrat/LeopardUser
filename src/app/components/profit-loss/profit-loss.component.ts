import { Component, OnInit } from "@angular/core";
import { Cookie } from "ng2-cookies";
import { ActivatedRoute, Router } from "@angular/router";
import { AccountService } from "src/app/service/account-service";
import { UiService } from "src/app/service/ui-service";
import { HttpClient } from "@angular/common/http";
import * as XLSX from 'xlsx';
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';

@Component({
  selector: "app-profit-loss",
  templateUrl: "./profit-loss.component.html",
  styleUrls: ["./profit-loss.component.scss"],
})
export class ProfitLossComponent implements OnInit {
  userName: string = "Null";
  role: string = Cookie.get("c_Role");
  userId: number = parseInt(Cookie.get("c_id"));
  sportsId: number = 0;
  startDate: string = "";
  endDate: string = "";
  profitLossObj: any = [];
  eventBetObj: any = [];
  eventId: string;
  marketName: string="All";
  backUpObj:any=[];
  dtToday:any;
  month:any;
  day:any;
  year:any;
  minDate:any;
  last:string;
  latest_date:any;
  constructor(
    private http: HttpClient,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    public uISERVICE: UiService,
    public datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.uISERVICE.sideBar = true;

    if (Cookie.check("usersCookies")) {
      this.uISERVICE.take=parseInt(localStorage.getItem('take'));
      this.getDate();
    } else {
      this.uISERVICE.Header = false;
    }
    setInterval(() => {
      this.desabledate()
    }, 1000);
  }

  getDate() {
    
    var date = new Date();
     this.last = new Date(date.getTime() - (6 * 24 * 60 * 60 * 1000)).toDateString();
      this.latest_date =this.datepipe.transform(this.last, 'yyyy-MM-dd');
     this.startDate = this.latest_date + " " + "00:00:00";
     this.last=this.datepipe.transform(date, 'yyyy-MM-dd');
     this.endDate = this.datepipe.transform(date, 'yyyy-MM-dd') + " " + "23:59:59";
     this.getProfitLoss();
    
  }

  onChange(value) {
    this.sportsId = value;
  }

  getStartDate(data) {
    this.startDate = data + " " + "00:00:00";
  }

  getEndDate(data) {
    this.endDate = data + " " + "23:59:59";
  }

  /* desiable date work start */
  desabledate(){
    this.dtToday = new Date();
    this.month = this.dtToday.getMonth();
    this.day = this.dtToday.getDate();
    this.year = this.dtToday.getFullYear();
   if(this.month < 10)
       this.month = '0' + this.month.toString();
   if(this.day < 10)
       this.day = '0' + this.day.toString();
    this.minDate= this.year + '-' + this.month + '-' + this.day;
   $('#sdate').attr('min', this.minDate);
    $('#edate').attr('min', this.minDate);
}
 /* end */

  getProfitLoss() {
    this.profitLossObj = [];
    if (this.startDate != "" && this.endDate != "") {
      this.uISERVICE.loader = true;
      this.accountService
        .GetProfitLoss(
          this.role,
          this.userId,
          this.sportsId,
          this.startDate,
          this.endDate
        )
        .then((response) => {
          if (response.Status) {
            this.profitLossObj = response.Result;
            this.uISERVICE.loader = false;
          } else {
            this.uISERVICE.loader = false;
            this.profitLossObj = [];
          }
        });
    } else {
      this.uISERVICE.Message = "Plase select start date and end date";
      this.uISERVICE.Error = true;
      setTimeout(() => {
        this.uISERVICE.Error = false;
      }, 2500);
    }
  }

  getEventId(eId){
    this.eventId = eId;
    this.getEventBets();
  }

  getEventBets() {
    this.eventBetObj = [];    
    this.uISERVICE.loader = true;
    this.accountService
      .GetEventBets(this.userName,this.role, this.userId, this.marketName, this.eventId)
      .then((response) => {
        
        if (response.Status) {
          this.eventBetObj = response.Result;
          this.uISERVICE.loader = false;
        } else {
          this.uISERVICE.loader = false;
        }
      });
  }

  serachMarket(data) {   
    this.marketName = data;
   this.getEventBets();
  }

  reset(){
    this.marketName="All";
  }
  exportexcel(): void
  {
    let element = document.getElementById('excel-table2');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'BettingProfit .xlsx');
  }
}
