import { Component,AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { Subscription }   from 'rxjs';
import { UiService } from './service/ui-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'app';
  constructor(public uISERVICE:UiService) {
    
  }

  ngOnInit(){
    
  }

 
}
