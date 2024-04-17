import { Injectable } from "@angular/core";
import { BaseHttpService } from "./base-http-service";
import { environment } from "../../environments/environment";
import { SignInModel } from "../Model/signin-model";
import { PlaceBetModel } from "../Model/placebet_model";
import { CardDetails } from "../Model/CardsModel";
import { SignUpModel } from "../Model/Sign_Up_Model";
import { promise } from "protractor";
import { promises } from "dns";

@Injectable()
export class AccountService {
  constructor(private baseHttpService: BaseHttpService) {}
  private signInUrl = environment.apiBaseUrl + "SignUp/Valid_Login";
  private getSrsListUrl = environment.apiBaseUrl + "Event/GetSeriesList";
  private getUsrDtlUrl = environment.apiBaseUrl + "SignUp/GetUserDetails";
  private getDetailLstUrl = environment.apiBaseUrl + "Event/GetDetail";
  private getEvntDtlUrl = environment.apiBaseUrl + "Event/GetEventDetail";
  private getEventDtlLstUrl = environment.apiBaseUrl + "Event/GetDashboardEvents";
  private placeBetUrl = environment.apiBaseUrl + "Bets/CreateBet";
  private placeFancyBetUrl = environment.apiBaseUrl + "Bets/CreateFancyBet";
  private getBetHistoryUrl = environment.apiBaseUrl + "Bets/GetBetsHistory";
  private getTransactionHistoryUrl =
    environment.apiBaseUrl + "Transaction/TranHistory";
  private updateUserUrl = environment.apiBaseUrl + "SignUp/Update_User";
  private updateRecValUrl = environment.apiBaseUrl + "Chip/Update_TakeRecord";
  private getCsnoDtlUrl = environment.apiBaseUrl + "Event/getCasinoDetail";
  private getProfitLossUrl = environment.apiBaseUrl + "Transaction/ProfitLoss";
  private getEventBetsUrl = environment.apiBaseUrl + "Bets/GetEventBets";
  private getMarketBetsUrl = environment.apiBaseUrl + "Bets/GetMarketBets";
  private getCasinoBetsUrl = environment.apiBaseUrl + "Bets/GetCasinoBets";
  private getCompetitionListUrl =
    environment.apiBaseUrl + "Event/getCompetitionList";
  private getComMarketListUrl =
    environment.apiBaseUrl + "Event/GetComMarketList";

  private getChipsUrl = environment.apiBaseUrl + "Chip/GetChips";
  private fancyBookUrl = environment.apiBaseUrl + "Bets/getFancyBook";
  private pendingBetUrl = environment.apiBaseUrl + "Bets/GetPendingBets";
  private updateChipUrl = environment.apiBaseUrl + "Chip/AddChips";
  private saveCardsUrl = environment.apiBaseUrl + "Market/saveGameCards";
  private chkLogIdUrl = environment.apiBaseUrl + "SignUp/CheckLoginId";
  private addUserUrl = environment.apiBaseUrl + "SignUp/Create_User";
  private getLobbyUrl = environment.apiBaseUrl + "balance/getLobby";
  private GetBannerUrl = environment.apiBaseUrl + "Chip/GetBanners";
  private GetCasinoProviderUrl =
    environment.apiBaseUrl + "CasinoSettings/GetCasinoProviders";
  // private GetCasinoGamesUrl =
  //   environment.apiBaseUrl + "CasinoSettings/GetCasinoGames";
  private GetCasinoDetailsUrl =
    environment.apiBaseUrl + "CasinoSettings/GetCasinoSettings";
  private GetTableGamesUrl =
    environment.apiBaseUrl + "CasinoSettings/GetTableGames";
  private GetLogoUrl = environment.apiBaseUrl + "Chip/GetLogo";
  private GetApiUrlsUrl = environment.apiBaseUrl + "Event/GetApiUrls";
  private changePwdUrl = environment.apiBaseUrl + "SignUp/SetIsPwd";
  private getCompListUrl = environment.apiBaseUrl + "Event/GetCompetitionList";
  private getEventListUrl = environment.apiBaseUrl + "Event/GetEventListBySportsId";
  private GetPopularGamesUrl =
    environment.apiBaseUrl + "Casino/get_popular_games";
    private GetCasinoCategoryUrl =
    environment.apiBaseUrl + "Casino/getAllCategory";
    private getProvidersByCategoryIdUrl =
    environment.apiBaseUrl + "Casino/getProvidersByCategoryId";
    private GetLobbyLaunchUrl = environment.apiBaseUrl + "Casino/getLobbyUrl";
    private GetCasinoGamesUrl =
    environment.apiBaseUrl + "Casino/getGamesByProviderId";

    GetCasinoGames(game_provider_id: string): Promise<any> {
      return this.baseHttpService
        .Get(
          this.GetCasinoGamesUrl + "?game_provider_id=" + game_provider_id + "&domain=" + location.origin
        )
        .then(function (response) {
          return response.json();
        });
    }
    GetLobbyLaunch(game_code: any): Promise<any> {
      return this.baseHttpService
        .Get(this.GetLobbyLaunchUrl + "?game_code=" + game_code + "&website_domain=" + "leopardexch247.com")
        .then(function (response) {
          return response.json();
        });
    }

  GetCasinoProvider(game_category_id: any): Promise<any> {
    return this.baseHttpService
      .Get(this.getProvidersByCategoryIdUrl + "?game_category_id=" + game_category_id + "&domain=" + location.origin)
      .then(function (response) {
        return response.json();
      });
  }
    GetCasinoCategory(): Promise<any> {
      return this.baseHttpService
        .Get(this.GetCasinoCategoryUrl + "?domain=" + location.origin)
        .then(function (response) {
          return response.json();
        });
    }


  GetPopularGames(providers: any): Promise<any> {
    return this.baseHttpService
      .Get(this.GetPopularGamesUrl + "?providers=" + providers + "&domain=" + location.origin)
      .then(function (response) {
        return response.json();
      });
  }

  getCompList(sportsId): Promise<any> {
    return this.baseHttpService
      .Get(this.getCompListUrl + "?sportsId=" + sportsId)
      .then(function (response) {
        return response.json();
      });
  }

  getEventList(sportsId, seriesId): Promise<any> {
    return this.baseHttpService
      .Get(
        this.getEventListUrl + "?sportsId=" + sportsId + "&seriesId=" + seriesId
      )
      .then(function (response) {
        return response.json();
      });
  }

  SignIn(signInModel: SignInModel): Promise<any> {
    return this.baseHttpService
      .Post(this.signInUrl, signInModel)
      .then(function (response) {
        return response.json();
      });
  }

  GetLogo(): Promise<any> {
    return this.baseHttpService.Get(this.GetLogoUrl).then(function (response) {
      return response.json();
    });
  }

  getCompetitionList(sportsId): Promise<any> {
    return this.baseHttpService
      .Get(this.getCompetitionListUrl + "?sportsId=" + sportsId)
      .then(function (response) {
        return response.json();
      });
  }

  getComMarketList(seriesId, sportsId): Promise<any> {
    return this.baseHttpService
      .Get(
        this.getComMarketListUrl +
          "?sportsId=" +
          sportsId +
          "&seriesId=" +
          seriesId
      )
      .then(function (response) {
        return response.json();
      });
  }

  getSrsList(sportsId): Promise<any> {
    return this.baseHttpService
      .Get(this.getSrsListUrl + "?sportsId=" + sportsId)
      .then(function (response) {
        return response.json();
      });
  }

  getUsrDtl(id, role, token): Promise<any> {
    return this.baseHttpService
      .Get(
        this.getUsrDtlUrl + "?id=" + id + "&role=" + role + "&token=" + token
      )
      .then(function (response) {
        return response.json();
      });
  }
  getEventDtl(evtType): Promise<any> {
    return this.baseHttpService
      .Get(
        this.getEventDtlLstUrl +
          "?evtType=" +
          evtType
      )
      .then(function (response) {
        return response.json();
      });
  }

  getDetailLst(sportsId, reqType, chckCnd): Promise<any> {
    return this.baseHttpService
      .Get(
        this.getDetailLstUrl +
          "?sportsId=" +
          sportsId +
          "&reqType=" +
          reqType +
          "&chckCnd=" +
          chckCnd
      )
      .then(function (response) {
        return response.json();
      });
  }

  getEvntDetail(eventId, type): Promise<any> {
    return this.baseHttpService
      .Get(this.getEvntDtlUrl + "?eventId=" + eventId + "&type=" + type)
      .then(function (response) {
        return response.json();
      });
  }

  getCasinoDetail(marketId, type): Promise<any> {
    return this.baseHttpService
      .Get(this.getCsnoDtlUrl + "?marketId=" + marketId + "&type=" + type)
      .then(function (response) {
        return response.json();
      });
  }

  placeBet(placeBetModel: PlaceBetModel): Promise<any> {
    if (placeBetModel.MarketName == "Fancy") {
      return this.baseHttpService
        .Post(this.placeFancyBetUrl, placeBetModel)
        .then(function (response) {
          return response.json();
        });
    } else {
      return this.baseHttpService
        .Post(this.placeBetUrl, placeBetModel)
        .then(function (response) {
          return response.json();
        });
    }
  }
  GetBetHistory(
    usrName,
    sportsId,
    mrktName,
    betType,
    role,
    skipRec,
    takeRec,
    startDate,
    endDate
  ): Promise<any> {
    return this.baseHttpService
      .Get(
        this.getBetHistoryUrl +
          "?skipRec=" +
          skipRec +
          "&takeRecord=" +
          takeRec +
          "&sportsId=" +
          sportsId +
          "&marketName=" +
          mrktName +
          "&betStatus=" +
          betType +
          "&role=" +
          role +
          "&userId=" +
          usrName +
          "&startDate=" +
          startDate +
          "&endDate=" +
          endDate
      )
      .then(function (response) {
        return response.json();
      });
  }

  GetTransactionHistory(
    role,
    userId,
    skipRec,
    take,
    type,
    sportsId,
    marketName,
    sDate,
    eDate
  ): Promise<any> {
    return this.baseHttpService
      .Get(
        this.getTransactionHistoryUrl +
          "?role=" +
          role +
          "&userId=" +
          userId +
          "&skipRec=" +
          skipRec +
          "&take=" +
          take +
          "&type=" +
          type +
          "&sportsId=" +
          sportsId +
          "&marketName=" +
          marketName +
          "&sDate=" +
          sDate +
          "&eDate=" +
          eDate
      )
      .then(function (response) {
        return response.json();
      });
  }

  GetApiUrls(sportId): Promise<any> {
    return this.baseHttpService
      .Get(this.GetApiUrlsUrl + "?sportsId=" + sportId + "&role=" + true)
      .then(function (response) {
        return response.json();
      });
  }

  UpdateUser(type, value, userId): Promise<any> {
    return this.baseHttpService
      .Get(
        this.updateUserUrl +
          "?type=" +
          type +
          "&Value=" +
          value +
          "&userId=" +
          userId
      )
      .then(function (response) {
        return response.json();
      });
  }

  UpdateRecVal(value): Promise<any> {
    return this.baseHttpService
      .Get(this.updateRecValUrl + "?value=" + value)
      .then(function (response) {
        return response.json();
      });
  }

  GetProfitLoss(role, userId, sportsId, sDate, eDate): Promise<any> {
    return this.baseHttpService
      .Get(
        this.getProfitLossUrl +
          "?role=" +
          role +
          "&userId=" +
          userId +
          "&sportsId=" +
          sportsId +
          "&sDate=" +
          sDate +
          "&eDate=" +
          eDate
      )
      .then(function (response) {
        return response.json();
      });
  }

  GetEventBets(userName, role, userId, marketName, eventId) {
    return this.baseHttpService
      .Get(
        this.getEventBetsUrl +
          "?userName=" +
          userName +
          "&role=" +
          role +
          "&userId=" +
          userId +
          "&marketName=" +
          marketName +
          "&eventId=" +
          eventId +
          "&skipRec=0&take=0"
      )
      .then(function (response) {
        return response.json();
      });
  }

  GetMarketBets(
    userName,
    role,
    userId,
    marketName,
    eventId,
    runId,
    marketId
  ): Promise<any> {
    return this.baseHttpService
      .Get(
        this.getMarketBetsUrl +
          "?userName=" +
          userName +
          "&role=" +
          role +
          "&userId=" +
          userId +
          "&marketName=" +
          marketName +
          "&eventId=" +
          eventId +
          "&runId=" +
          runId +
          "&skipRec=0&take=0" +
          "&marketId=" +
          marketId
      )
      .then(function (response) {
        return response.json();
      });
  }

  GetCasinoBets(role, userId, marketId, systemId, sDate, eDate): Promise<any> {
    return this.baseHttpService
      .Get(
        this.getCasinoBetsUrl +
          "?role=" +
          role +
          "&userId=" +
          userId +
          "&marketId=" +
          marketId +
          "&systemId=" +
          systemId +
          "&sDate=" +
          sDate +
          "&eDate=" +
          eDate
      )
      .then(function (response) {
        return response.json();
      });
  }

  getChips(): Promise<any> {
    return this.baseHttpService.Get(this.getChipsUrl).then(function (response) {
      return response.json();
    });
  }

  getFancyBook(selId, mrktId): Promise<any> {
    return this.baseHttpService
      .Get(this.fancyBookUrl + "?RunnerId=" + selId + "&marketId=" + mrktId)
      .then(function (response) {
        return response.json();
      });
  }

  getPendingBets(
    usrName,
    sportId,
    marketName,
    betType,
    skip,
    take
  ): Promise<any> {
    return this.baseHttpService
      .Get(
        this.pendingBetUrl +
          "?usrName=" +
          usrName +
          "&sportsId=" +
          sportId +
          "&mrktName=" +
          marketName +
          "&betType=" +
          betType +
          "&skipRec=" +
          skip +
          "&takeRec=" +
          take
      )
      .then(function (response) {
        return response.json();
      });
  }

  updateChip(chipData): Promise<any> {
    return this.baseHttpService
      .Post(this.updateChipUrl, chipData)
      .then(function (response) {
        return response.json();
      });
  }

  saveCard(cardModel: CardDetails): Promise<any> {
    return this.baseHttpService
      .Post(this.saveCardsUrl, cardModel)
      .then(function (response) {
        return response.json();
      });
  }

  chkLogId(LogId): Promise<any> {
    return this.baseHttpService
      .Get(this.chkLogIdUrl + "?userId=" + LogId)
      .then(function (response) {
        return response.json();
      });
  }

  changePwd(oldpwd, newpwd): Promise<any> {
    return this.baseHttpService
      .Get(this.changePwdUrl + "?oldpwd=" + oldpwd + "&newpwd=" + newpwd)
      .then(function (response) {
        return response.json();
      });
  }

  addUser(sign_Up_Model: SignUpModel): Promise<any> {
    return this.baseHttpService
      .Post(this.addUserUrl, sign_Up_Model)
      .then(function (response) {
        return response.json();
      });
  }

  getLobby(gameCode): Promise<any> {
    return this.baseHttpService
      .Get(this.getLobbyUrl + "?gameCode=" + gameCode)
      .then(function (response) {
        return response.json();
      });
  }

  GetBanner(type: string): Promise<any> {
    return this.baseHttpService
      .Get(this.GetBannerUrl + "?type=" + type)
      .then(function (response) {
        return response.json();
      });
  }

  GetCasinoProviders(): Promise<any> {
    return this.baseHttpService
      .Get(this.GetCasinoProviderUrl + "?role=" + "Client")
      .then(function (response) {
        return response.json();
      });
  }

  // GetCasinoGames(systemId: string): Promise<any> {
  //   return this.baseHttpService
  //     .Get(
  //       this.GetCasinoGamesUrl + "?systemId=" + systemId + "&role=" + "Client"
  //     )
  //     .then(function (response) {
  //       return response.json();
  //     });
  // }

  GetCasinoDetails(): Promise<any> {
    return this.baseHttpService
      .Get(this.GetCasinoDetailsUrl)
      .then(function (response) {
        return response.json();
      });
  }

  GetTableGames(): Promise<any> {
    return this.baseHttpService
      .Get(this.GetTableGamesUrl + "?role=" + "Client")
      .then(function (response) {
        return response.json();
      });
  }
}
