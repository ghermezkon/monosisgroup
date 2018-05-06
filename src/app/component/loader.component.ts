import { Component } from "@angular/core";

@Component({
    selector: 'loader',
    styles:[`
    .centered {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 999;
      }
      .cdk-overlay-dark-backdrop {
        background: rgba(0,0,0,.15) !important;
      }
    `],
    template: `
        <div class="cdk-overlay-backdrop cdk-overlay-dark-backdrop cdk-overlay-backdrop-showing" 
            style="width:100%;height:100%;min-width:100%;z-index:10001;">
            <div class="centered">
                <img src="assets/images/loading-2.svg">
            </div>
        </div>
    `
})
export class LoaderComponent{
    //---------------------------------------------------
    constructor(){}
    //---------------------------------------------------
}