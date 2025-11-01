import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.logaligroup.products.controller
 */
export default class App extends BaseController {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        this.loadView();
    }

    private loadView () : void {
        let data = {
            title: "",
            layout: "OneColumn"
        };
        let model = new JSONModel(data);
        this.setModel(model, "view");
    }
}