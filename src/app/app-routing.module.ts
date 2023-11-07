import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetBetComponent } from './components/set-bet/set-bet.component';
import { GamesComponent } from './components/games/games.component';
import { BetsComponent } from './components/bets/bets.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CashComponent } from './components/cash/cash.component';
import { StatementComponent } from './components/statement/statement.component';
import { ProfitLossComponent } from './components/profit-loss/profit-loss.component';
import { TeenpattiComponent } from './components/teenpatti/teenpatti.component';
import { LiveGamesComponent } from './components/live-games/live-games.component';
import { CasinoComponent } from './components/casino/casino.component';
import { CupRateComponent } from './components/cup-rate/cup-rate.component';
import { MatchListComponent } from './components/match-list/match-list.component';

const routes: Routes = [
  {path:'', redirectTo: '/games', pathMatch:'full'},
  {path:'games', component:GamesComponent},
  {path:'set-bet/:sportsId/:eventId', component:SetBetComponent},
  {path:'bets', component:BetsComponent},
  {path:'profile', component:ProfileComponent},
  {path:'cash', component:CashComponent},
  {path:'statement', component:StatementComponent},
  {path:'profit-loss', component:ProfitLossComponent},
  {path:'table-games/:marketId', component:TeenpattiComponent},
  {path:'live-games/:page/:system', component:LiveGamesComponent},
  {path:'casino/:type', component:CasinoComponent},
  {path:'casino/:type/:index/:systemId', component:CasinoComponent},
  {path:'cup-rate/:sportsId/:eventId', component:CupRateComponent},
  {path:'match-list/:sportsId', component:MatchListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
