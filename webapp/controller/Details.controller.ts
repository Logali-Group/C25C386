import BaseController from "./BaseController";
import View from "sap/ui/core/mvc/View";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import JSONModel from "sap/ui/model/json/JSONModel";
import Button from "sap/m/Button";
import VBox from "sap/m/VBox";
import FlexBox from "sap/m/FlexBox";
import Context from "sap/ui/model/odata/v4/Context";
import Fragment from "sap/ui/core/Fragment";
import Utils from "../utils/Utils";
import SimpleFormValidator from "../utils/Validator";
import Control from "sap/ui/core/Control";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import MessageBox from "sap/m/MessageBox";

/**
 * @namespace com.logaligroup.products.controller
 */

export default class Details extends BaseController {

    formFragments : VBox[] = [];

    public onInit () : void | undefined {
        const router = this.getRouter();
        router.getRoute("RouteDetails")?.attachPatternMatched(this.onBindingContext.bind(this));
        this.loadModel();
    }

    private loadModel () : void {
        const data = {
            product: "",
            productName: "",
            description: "",
            supplier: "",
            category: "",
            subCategory: "",
            stock: "",
            rating: null,
            currency: '',
            price: null
        };
        const model = new JSONModel(data);
        this.setModel(model, "form");
    }

    private onBindingContext (event : Route$PatternMatchedEvent) : void {
        let arg = event.getParameter("arguments") as any;
        let key = arg.key;
        let view = this.getView() as View;
        let model = this.getModel("view") as JSONModel;
        
        view.bindElement({
            path: `/ProductsSet(ID=${key})`,
            parameters: {
                $select: 'product,productName,description,supplier_ID,category_ID,subCategory_ID,stock_code,rating,price,currency'
            },
            events: {
                dataRequested : () => {
                    view.setBusy(true);
                },
                dataReceived: () => {
                    view.setBusy(false);
                    if (model.getProperty("/action") === 'create') {
                        this.toggleButtonAndView(true);
                    } else {
                        this.showFormFragment('Display');
                    }
                }
            }
        });
    }

    public toggleFullScreen () : void {
        const view = this.getModel("view") as JSONModel;
        const bFullScreen = view.getProperty("/actionButtonsInfo/midColumn/fullScreen");    //false
        view.setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen );         //true

        if (!bFullScreen) {     //false
            view.setProperty("/previousLayout", view.getProperty("/layout"));       //TwoColumnsMidExpanded
            view.setProperty("/layout","MidColumnFullScreen");
        } else {    //true
            view.setProperty("/layout", view.getProperty("/previousLayout"));       //TwoColumnsMidExpanded
        }
    }

    public onCloseDetailsPress () : void {
        const model = this.getModel("view") as JSONModel;
        model.setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
        model.setProperty("/layout","OneColumn");
        this.getRouter().navTo("RouteMaster");
    }

    public handleEditPress () : void {
        const bindingContext = this.getView()?.getBindingContext() as Context;
        const form = this.getModel("form") as JSONModel;
        const utils = new Utils();
        form.setData(utils.copy(bindingContext));
        this.toggleButtonAndView(true);
    }

    public async handleDeletePress () : Promise<void> {
        const bindingContext = this.getView()?.getBindingContext() as Context;
        const utils = new Utils();
        await utils.crud(this,'delete',bindingContext);
        this.onCloseDetailsPress();
    }

    public async handleSavePress () : Promise<void> {
        const resourceBundle = this.getResourceBundle();

        if (!this.validate()) {
            MessageBox.error(resourceBundle.getText("vilidateError") || 'no text defined');
        } else {
            const bindingContext = this.getView()?.getBindingContext() as Context;
            const form = this.getModel("form") as JSONModel;
            const utils = new Utils();
            await utils.crud(this,'update',bindingContext,form);
            this.toggleButtonAndView(false);
        }
        
    }

    public handleCancelPress () : void {
        this.toggleButtonAndView(false);
    }

    public toggleButtonAndView (bEdit : boolean) : void {
        (this.byId("edit") as Button).setVisible(!bEdit);
        (this.byId("save") as Button).setVisible(bEdit);
        (this.byId("cancel") as Button).setVisible(bEdit);

        this.showFormFragment(bEdit? 'Change' : 'Display');
    }

    private async showFormFragment (sFramentName : string) : Promise<void> {
        const flexbox = this.byId("formInformation") as FlexBox;
        flexbox.removeAllItems();

        const vbox = await this.getFormFragment(sFramentName);
        flexbox.addItem(vbox);
    }

    private async getFormFragment(sFragmentName : string) : Promise<VBox> {
        const index = (sFragmentName === 'Display')?  0 : 1;
        const view = this.getView() as View;
        let pFormFragment = this.formFragments[index];

        if (!pFormFragment) {

            // pFormFragment = await Fragment.load({
            //     id: view.getId(),
            //     name:  'com.logaligroup.products.fragment.'+sFragmentName,
            //     controller: this
            // }) as VBox;

            pFormFragment = await <Promise<VBox>> this.loadFragment({
                id: view.getId(),
                name: 'com.logaligroup.products.fragment.'+sFragmentName
            });

            this.formFragments[index] = pFormFragment;
        }

        return pFormFragment;
    }

    private validate () : boolean {
        const formValidator = new SimpleFormValidator();
        const change =  this.formFragments[1] as VBox;
        const aggregations = change.getAggregation("items") as Control[];
        const simpleForm = aggregations[0] as SimpleForm;
        return formValidator.validate(simpleForm);
    }




}