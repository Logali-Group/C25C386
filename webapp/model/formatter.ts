import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Table from "sap/m/Table";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.logaligroup.products
 */

export default {
    titleFormatter : function (this : Controller) {
        let resourceModel = (this.getOwnerComponent() as UIComponent).getModel("i18n") as ResourceModel;
        let resourceBundle = resourceModel.getResourceBundle() as ResourceBundle;
        let items = ((this.byId("table") as Table).getBinding("items")) as ODataListBinding;

        if (!items) {
            return resourceBundle.getText("title",[0])
        }

        const sTitle = resourceBundle.getText("title",[items.getLength()]);


        items.attachChange(()=>{
            let view = this.getView()?.getModel("view") as JSONModel;
            view.setProperty("/title", resourceBundle.getText("title", [items.getLength()]));
        });

        return sTitle;
    }
}