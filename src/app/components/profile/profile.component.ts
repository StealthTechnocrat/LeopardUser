import { Component, OnInit } from "@angular/core";
import { Cookie } from "ng2-cookies";
import { ActivatedRoute, Router } from "@angular/router";
import { AccountService } from "src/app/service/account-service";
import { UiService } from "src/app/service/ui-service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  UserDetails: any = [];
  Hide1: boolean;
  Hide2: boolean;
  chkCnd: string = "Before";
  NewPwd: string="";
  CnfPwd: string="";
  OldPwd: string="";
  userId: number = parseInt(Cookie.get("c_id"));
  chipData: any = [];
  constructor(
    private http: HttpClient,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    public uISERVICE: UiService
  ) { }

  ngOnInit(): void {
    this.uISERVICE.sideBar = true;

    if (Cookie.check("usersCookies")) {
      this.chkCnd = "After";
      this.UserDetails = JSON.parse(localStorage.getItem("UserDetail"));
      this.getChips();
    } else {
      this.uISERVICE.Header = false;
    }
  }

  getChips() {
    this.uISERVICE.loader=true;
    this.accountService.getChips().then((response) => {
      if (response.Status) {
        this.uISERVICE.loader=false;
        this.chipData = response.Result;
      }else{
        this.chipData =[];
        this.uISERVICE.loader=false;
      }
    });
  }

  updateChips() {
    this.uISERVICE.loader=true;
    this.accountService.updateChip(this.chipData).then((response) => {
      if (response.Status) {
        this.uISERVICE.loader=false;
        this.uISERVICE.Success = true;
        this.uISERVICE.Message = "Executed Successfully";
        setTimeout(() => {
          this.uISERVICE.Success = false;
        }, 3000);
      } else {
        this.uISERVICE.loader=false;
        this.uISERVICE.Error = true;
        this.uISERVICE.Message = response.Result;
        setTimeout(() => {
          this.uISERVICE.Error = false;
        }, 3000);
      }
    });
  }

  ChangePwd() {
    if(this.NewPwd==""){
      this.uISERVICE.Error = true;
      this.uISERVICE.Message = "Enter New Password";
      setTimeout(() => {
        this.uISERVICE.Error = false;
      }, 3000);
    }else{
      if(this.CnfPwd==""){
        this.uISERVICE.Error = true;
        this.uISERVICE.Message = "Enter Confirm Password";
        setTimeout(() => {
          this.uISERVICE.Error = false;
        }, 3000);
      }else{
        if(this.OldPwd==""){
          this.uISERVICE.Error = true;
          this.uISERVICE.Message = "Enter Current Password";
          setTimeout(() => {
            this.uISERVICE.Error = false;
          }, 3000);
        }else{
          if (this.OldPwd == this.UserDetails.Password) {
            if (this.NewPwd == this.CnfPwd) {
              this.uISERVICE.loader=true;
              this.accountService
                .UpdateUser("Password", this.NewPwd, this.userId)
                .then((response) => {
                  
                  if (response.Status) {
                    this.uISERVICE.loader=false;
                    this.uISERVICE.Success = true;
                    this.uISERVICE.Message = "Executed Successfully";
                    document.getElementById('cls').click();
                    this.NewPwd="";
                    this.CnfPwd="";
                    this.OldPwd="";
                    setTimeout(() => {
                      this.uISERVICE.Success = false;
                    }, 3000);
                  } else {
                    this.uISERVICE.loader=false;
                    this.uISERVICE.Error = true;
                    this.uISERVICE.Message = response.Result;
                    setTimeout(() => {
                      this.uISERVICE.Error = false;
                    }, 3000);
                  }
                });
            } else {
              this.uISERVICE.Message = "Confirm Password not matched";
              this.uISERVICE.Error = true;
              setTimeout(() => {
                this.uISERVICE.Error = false;
              }, 2500);
            }
          } else {
            this.uISERVICE.Message = "Old Password not matched";
            this.uISERVICE.Error = true;
            setTimeout(() => {
              this.uISERVICE.Error = false;
            }, 2500);
          }
        }
      }
    }
  }

  pwdShowHide1(value) {
    this.Hide1 = value;
  }
  pwdShowHide2(value) {
    this.Hide2 = value;
  }
}
