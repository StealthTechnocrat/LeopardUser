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
  selector: "app-statement",
  templateUrl: "./statement.component.html",
  styleUrls: ["./statement.component.scss"],
})
export class StatementComponent implements OnInit {
  role: string = Cookie.get("c_Role");
  userId: number = parseInt(Cookie.get("c_id"));
  Ttype: string = "All";
  sportsId: number = 0;
  date: Date;
  startDate: string = "";
  endDate: string = "";
  mrktName: string = "All";
  TransactionObj: any = [];
  skipRec: number = 0;
  pageNo: number = 0;
  totalRec: number;
  marketName: string;
  BetMrktObj: any = [];
  eventId: string;
  runId: string;
  userName:string="Null";
  dtToday:any;
  month:any;
  day:any;
  year:any;
  minDate:any;
  betObj:any=[];
  last:string;
  latest_date:any;
  sportId:number;
  constructor(
    private http: HttpClient,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    public uISERVICE: UiService,
    public datepipe: DatePipe
  ) {}

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
     this.getTransactionHistory();
    
  }

  onChange(value, type) {
    
    switch (type) {
      case "Ttype":
        this.Ttype = value;
        break;
      case "sportsId":
        this.sportsId = value;
        break;
      case "market":
        this.mrktName = value;
        break;
    }
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
    this.month = this.dtToday.getMonth() ;
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

  pageChanged(pageNo) {
    this.pageNo = pageNo;
    this.skipRec = (pageNo - 1) * this.uISERVICE.take;
    this.getTransactionHistory();
  }

  getTransactionHistory() {
    this.TransactionObj=[];
    if (this.startDate != "" && this.endDate != "") {
      this.uISERVICE.loader = true;
      this.accountService.GetTransactionHistory(
        this.role,
        this.userId,
        this.skipRec,
        this.uISERVICE.take,
        this.Ttype,
        this.sportsId,
        this.mrktName,
        this.startDate,
        this.endDate
      )
      .then((response) => {
        
        if (response.Status) {
          this.TransactionObj = response.Result;         
          this.totalRec=response.Count;
          this.uISERVICE.loader = false;
        } else {
          this.uISERVICE.loader = false;
          this.TransactionObj = [];
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


   

  getMarketBets(data) {
    this.sportId=data.SportsId;
    this.BetMrktObj = [];
    this.marketName = data.MarketName;
    this.eventId = data.EventId;
    this.runId = data.SelectionId;
    this.uISERVICE.loader = true;
    if(data.SportsId==11){
      this.accountService
      .GetCasinoBets(
        this.role,
        data.Id,
        data.MarketId,
        this.eventId,
        this.startDate,
        this.endDate
      )
      .then((response) => {
        
        if (response.Status) {
          this.BetMrktObj = response.Result;
          this.totalRec = response.Count;
          this.uISERVICE.loader=false;
        } else {
          this.BetMrktObj = [];
          this.uISERVICE.loader=false;
        }
      });
    }else{
      this.accountService
      .GetMarketBets(
        this.userName,
        this.role,
        this.userId,
        this.marketName,
        this.eventId,
        this.runId,
        data.MarketId,
      )
      .then((response) => {
        
        this.BetMrktObj = [];
        if (response.Status) {
          this.BetMrktObj = response.Result;
          this.uISERVICE.loader = false;
        } else {
          this.uISERVICE.loader = false;
        }
      });
    }
  }

  updateRecValue(value) {
    
    this.accountService.UpdateRecVal(value).then((response) => {
      if (response.Status) {
       this.uISERVICE.take=value;
        this.getTransactionHistory();
      } else {
        this.uISERVICE.Error = true;
        this.uISERVICE.Message = response.Result;
        setTimeout(() => {
          this.uISERVICE.Error = false;
        }, 2000);
      }
    });
  }

  exportexcel(): void
  {
    let element = document.getElementById('excel-table2');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Actstatement.xlsx');
  }
}
