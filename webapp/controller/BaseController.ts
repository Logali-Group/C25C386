import Controller from "sap/ui/core/mvc/Controller";
import Router from "sap/ui/core/routing/Router";
import Component from "../Component";
import Model from "sap/ui/model/Model";
import View from "sap/ui/core/mvc/View";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";

/**
 * @namespace com.logaligroup.products.controller
 */

export default class BaseController extends Controller {

    public getRouter () : Router {
        return (this.getOwnerComponent() as Component).getRouter();
    }

    public getModel (name? : string) : Model {
        return this.getView()?.getModel(name) as Model;
    }

    public setModel (model : Model, name? : string) : View | undefined {
        return this.getView()?.setModel(model, name);
    }

    public getResourceBundle () : ResourceBundle {
        let model = (this.getOwnerComponent() as Component).getModel("i18n") as ResourceModel;
        return model.getResourceBundle() as ResourceBundle;
    }

}