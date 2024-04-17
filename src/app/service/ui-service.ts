import { Injectable, Input } from '@angular/core';
import {SafeResourceUrl } from '@angular/platform-browser';


@Injectable()
export class UiService {
    EventName:string;
    loader:boolean=false;
    Error:boolean=false;
    Success:boolean=false;
    Message:string;
    take:number;
    Header:boolean=false;
    News:any=[];
    casinoCategoryList:any=[];
    Bets:any=[];
    sportsData: any = [];
    sportsName: string;
    compData: any = [];
    matchData: any = [];
    casinoProvidersList:any=[];
    backUpBets:any=[];
    TopEvents:any=[];
    TopInplay:any=[];
    betSlip:any=[];
    showSlip:any=[false,false,false,false];
    fancySlip:any=[];
    logIn:boolean=false;
    Bal:number=0;
    Exp:number=0;
    sideBar:boolean=true;
    live:boolean=true;
    showClass:boolean=false;
    imageName:string;    
    UserName:string;    
    IframeUrl: SafeResourceUrl;
    tv:boolean=false;
    exposure:number=0;
    profit:number=0;
    betLoader:boolean=false;
    casinoStatus:boolean=false;
    liveGameStatus:boolean=false;
    //Bets Parameter
    odds:number;
    price:string;
    marketId:string;
    eventId:string;
    rnrId:string;
    rName:string;
    sportsId:number;
    maxMarkt:number;
    minMarkt:number;
    betDelay:number;
    stake:number=0;
    rIndx:number;
    mrktName:string;
    betType:string;
    apiUrl:string;
    gStatus:number;
    activeRoundId:string;
    categoryId: any;
    categoryName: any;
    developerId : any;
    developername:any;
    BetStatus: boolean = false;
    BackBook: number = 0;
    LayBook: number= 0;
}

