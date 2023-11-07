"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var ng2_cookies_1 = require('ng2-cookies');
var BaseHttpService = (function () {
    function BaseHttpService(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.authHeaderAdded = false;
    }
    BaseHttpService.prototype.GetHeaders = function () {
        this.createAuthorizationHeader();
        return this.headers;
    };
    BaseHttpService.prototype.createAuthorizationHeader = function () {
        if (ng2_cookies_1.Cookie.check("usersCookies")) {
            this.headers.set('Authorization', 'Bearer ' + ng2_cookies_1.Cookie.get("usersCookies"));
        }
        // this.headers.set('Access-Control-Allow-Origin', '*');
    };
    BaseHttpService.prototype.Post = function (url, model) {
        this.createAuthorizationHeader();
        return this.http.post(url, model, { headers: this.headers }).toPromise();
    };
    BaseHttpService.prototype.Put = function (url, model) {
        this.createAuthorizationHeader();
        return this.http.put(url, model, { headers: this.headers }).toPromise();
    };
    BaseHttpService.prototype.Get = function (url) {
        this.createAuthorizationHeader();
        return this.http.get(url, { headers: this.headers }).toPromise();
    };
    BaseHttpService.prototype.Delete = function (url) {
        this.createAuthorizationHeader();
        return this.http.delete(url, { headers: this.headers }).toPromise();
    };
    BaseHttpService = __decorate([
        core_1.Injectable()
    ], BaseHttpService);
    return BaseHttpService;
}());
exports.BaseHttpService = BaseHttpService;
