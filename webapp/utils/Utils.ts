import Context from "sap/ui/model/odata/v4/Context";
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import UIComponent from "sap/ui/core/UIComponent";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import MessageBox from "sap/m/MessageBox";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import Component from "../Component";
import View from "sap/ui/core/mvc/View";


/**
 * @namespace com.logaligroup.products.utils
 */


export default class Utils {

    public copy(bindingContext: Context): object {

        let data = {
            product: bindingContext.getProperty("product"),
            productName: bindingContext.getProperty("productName"),
            description: bindingContext.getProperty("description"),
            supplier: bindingContext.getProperty("supplier_ID"),
            category: bindingContext.getProperty("category_ID"),
            subCategory: bindingContext.getProperty("subCategory_ID"),
            stock: bindingContext.getProperty("stock_code"),
            rating: bindingContext.getProperty("rating"),
            currency: bindingContext.getProperty("currency"),
            price: bindingContext.getProperty("price")
        }

        return data;
    }

    private refresh (controller : Controller) : void {
        const model = (controller.getOwnerComponent() as Component).getModel() as ODataModel;
        model.refresh();
    }

    // create, update, delete
    public async crud(controller: Controller, action: string, bindingContext?: Context, model?: JSONModel): Promise<void | string> {

        const resourceBundle = ((controller.getOwnerComponent() as UIComponent).getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;

        if (action === 'create') {
            return await this.create(controller);
        }
        
        return new Promise((resolve,reject) => {
            MessageBox.confirm(resourceBundle.getText("question") || 'no text defined', {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: async (response: string) => {
                    if (response === MessageBox.Action.OK) {
                        switch (action) {
                            case 'update':  await this.update(controller, bindingContext, model); break;
                            case 'delete':  await this.delete(controller, bindingContext); break;
                        }
                        resolve();
                    }
                }
            });
        });

    }

    private async create(controller: Controller): Promise<string> {
        const model = (controller.getOwnerComponent()?.getModel() as ODataModel);
        const bindList = model.bindList("/ProductsSet") as ODataListBinding;
        const context = bindList.create() as Context;
        await context.created();
        this.refresh(controller);
        const id = context.getProperty("ID");
        return id;
    }

    private async update(controller: Controller, bindingContext?: Context, model?: JSONModel): Promise<void> {
        const view = controller.getView() as View;
        view.setBusy(true);

        return new Promise(async (resolve, reject) => {
            try {
                await bindingContext?.setProperty("product", model?.getProperty("/product"));
                await bindingContext?.setProperty("productName", model?.getProperty("/productName"));
                await bindingContext?.setProperty("description", model?.getProperty("/description"));
                await bindingContext?.setProperty("category_ID", model?.getProperty("/category"));
                await bindingContext?.setProperty("subCategory_ID", model?.getProperty("/subCategory"));
                await bindingContext?.setProperty("supplier_ID", model?.getProperty("/supplier"));
                await bindingContext?.setProperty("stock_code", model?.getProperty("/stock"));
                await bindingContext?.setProperty("price", model?.getProperty("/price"));
                await bindingContext?.setProperty("rating", model?.getProperty("/rating"));
                await bindingContext?.setProperty("currency", model?.getProperty("/currency"));
                this.refresh(controller);
                view.setBusy(false);
                resolve();
            } catch (error) {
                view.setBusy(false);
                reject();
            }
        });

    }

    private async delete(controller: Controller, bindingContext?: Context): Promise<void> {

        const view = controller.getView() as View;
        view.setBusy(true);


        return new Promise (async (resolve, reject) => {
            try {
                await bindingContext?.delete();
                this.refresh(controller);
                resolve();
            } catch (error) {
                view.setBusy(false);
                reject();
            }
        });

    }

}