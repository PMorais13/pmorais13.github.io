(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["features-features-module"],{

/***/ "0e1J":
/*!*****************************************************!*\
  !*** ./src/app/features/features-routing.module.ts ***!
  \*****************************************************/
/*! exports provided: FeaturesRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeaturesRoutingModule", function() { return FeaturesRoutingModule; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _features_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./features.component */ "mXFZ");
/* harmony import */ var _components_card_profile_card_profile_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/card-profile/card-profile.component */ "Pfh/");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");





const routes = [
    {
        path: '',
        component: _features_component__WEBPACK_IMPORTED_MODULE_1__["FeaturesComponent"],
        children: [
            {
                path: '',
                component: _components_card_profile_card_profile_component__WEBPACK_IMPORTED_MODULE_2__["CardProfileComponent"]
            }
        ]
    }
];
class FeaturesRoutingModule {
}
FeaturesRoutingModule.ɵfac = function FeaturesRoutingModule_Factory(t) { return new (t || FeaturesRoutingModule)(); };
FeaturesRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({ type: FeaturesRoutingModule });
FeaturesRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](FeaturesRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] }); })();


/***/ }),

/***/ "57qJ":
/*!**************************************************************************************!*\
  !*** ./src/app/features/components/card-profile/components/icons/icons.component.ts ***!
  \**************************************************************************************/
/*! exports provided: IconsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IconsComponent", function() { return IconsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class IconsComponent {
    constructor() { }
    ngOnInit() {
    }
}
IconsComponent.ɵfac = function IconsComponent_Factory(t) { return new (t || IconsComponent)(); };
IconsComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: IconsComponent, selectors: [["app-icons"]], decls: 0, vars: 0, template: function IconsComponent_Template(rf, ctx) { }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJpY29ucy5jb21wb25lbnQuc2NzcyJ9 */"] });


/***/ }),

/***/ "Pfh/":
/*!****************************************************************************!*\
  !*** ./src/app/features/components/card-profile/card-profile.component.ts ***!
  \****************************************************************************/
/*! exports provided: CardProfileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CardProfileComponent", function() { return CardProfileComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class CardProfileComponent {
    constructor() { }
    ngOnInit() {
    }
}
CardProfileComponent.ɵfac = function CardProfileComponent_Factory(t) { return new (t || CardProfileComponent)(); };
CardProfileComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: CardProfileComponent, selectors: [["app-card-profile"]], decls: 10, vars: 0, consts: [["id", "borderCard", 1, "card", "mx-auto", "mt-4", 2, "width", "28rem"], ["src", "./../../../../assets/img/fotoPerfil.png", "alt", "Foto de Perfil", 1, "img-fluid", "rounded-circle"], [1, "card-body"], [1, "card-title"], [1, "card-text"]], template: function CardProfileComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h5", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "Paulo Henrique Morais dos Santos");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "p", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Ol\u00E1! Sou estudante de Analise e Desenvolvimento de Sistemas e tamb\u00E9m estudo muito por fora da faculdade fazendo bootcamps e aplicando o conhecimento adquirido em projetos pr\u00F3prios.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](8, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " Tenho um bom conhecimento em Angular 8, sei desenvolver SPA's profissionais e estou buscando uma oportunidade para ingressar no mercado.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: ["#borderCard[_ngcontent-%COMP%] {\n  border-radius: 50% 50% 0 0/32% 32% 0 0;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcY2FyZC1wcm9maWxlLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksc0NBQUE7QUFDSiIsImZpbGUiOiJjYXJkLXByb2ZpbGUuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIjYm9yZGVyQ2FyZCB7XHJcbiAgICBib3JkZXItcmFkaXVzOiA1MCUgNTAlIDAgMC8zMiUgMzIlIDAgMDtcclxufSJdfQ== */"] });


/***/ }),

/***/ "hB0V":
/*!*********************************************!*\
  !*** ./src/app/features/features.module.ts ***!
  \*********************************************/
/*! exports provided: FeaturesModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeaturesModule", function() { return FeaturesModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _features_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./features-routing.module */ "0e1J");
/* harmony import */ var _features_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./features.component */ "mXFZ");
/* harmony import */ var _components_card_profile_card_profile_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/card-profile/card-profile.component */ "Pfh/");
/* harmony import */ var _components_card_profile_components_icons_icons_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/card-profile/components/icons/icons.component */ "57qJ");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "fXoL");






class FeaturesModule {
}
FeaturesModule.ɵfac = function FeaturesModule_Factory(t) { return new (t || FeaturesModule)(); };
FeaturesModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineNgModule"]({ type: FeaturesModule });
FeaturesModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjector"]({ imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
            _features_routing_module__WEBPACK_IMPORTED_MODULE_1__["FeaturesRoutingModule"],
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsetNgModuleScope"](FeaturesModule, { declarations: [_features_component__WEBPACK_IMPORTED_MODULE_2__["FeaturesComponent"],
        _components_card_profile_card_profile_component__WEBPACK_IMPORTED_MODULE_3__["CardProfileComponent"],
        _components_card_profile_components_icons_icons_component__WEBPACK_IMPORTED_MODULE_4__["IconsComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
        _features_routing_module__WEBPACK_IMPORTED_MODULE_1__["FeaturesRoutingModule"]], exports: [_features_component__WEBPACK_IMPORTED_MODULE_2__["FeaturesComponent"]] }); })();


/***/ }),

/***/ "mXFZ":
/*!************************************************!*\
  !*** ./src/app/features/features.component.ts ***!
  \************************************************/
/*! exports provided: FeaturesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeaturesComponent", function() { return FeaturesComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");


class FeaturesComponent {
    constructor() { }
    ngOnInit() {
    }
}
FeaturesComponent.ɵfac = function FeaturesComponent_Factory(t) { return new (t || FeaturesComponent)(); };
FeaturesComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FeaturesComponent, selectors: [["app-features"]], decls: 3, vars: 0, consts: [["id", "particles-js"], [1, "container-fluid"]], template: function FeaturesComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterOutlet"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJmZWF0dXJlcy5jb21wb25lbnQuc2NzcyJ9 */"] });


/***/ })

}]);
//# sourceMappingURL=features-features-module.js.map