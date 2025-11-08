import Control from "sap/ui/core/Control";
import BaseController from "./BaseController";
import { FilterBar$ClearEvent, FilterBar$SearchEvent } from "sap/ui/comp/filterbar/FilterBar";
import Input from "sap/m/Input";
import ComboBox from "sap/m/ComboBox";
import RatingIndicator from "sap/m/RatingIndicator";
import RangeSlider from "sap/m/RangeSlider";
import TextArea from "sap/m/TextArea";
import Select from "sap/m/Select";
import MultiComboBox from "sap/m/MultiComboBox";
import SearchField from "sap/m/SearchField";
import Filter from "sap/ui/model/Filter";
import Table from "sap/m/Table";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import Event from "sap/ui/base/Event";
import ColumnListItem from "sap/m/ColumnListItem";
import Context from "sap/ui/model/odata/v4/Context";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.logaligroup.products.controller
 */

export default class Main extends BaseController {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {

    }

    public onSearchPress (event : FilterBar$SearchEvent) : void {
        let controls = event.getParameter("selectionSet") as Control[];

        // let controls = [Input,Select,ComboBox,MultiComboBox,SearchField];
        // controls.forEach((control)=> {
        //     if (control instanceof TextArea) {
        //         console.log("Aquí estoy");
        //     }
        // });

        let input = (controls[0] as Input).getValue();
        let category = (controls[1] as ComboBox).getSelectedKey();
        let rating = (controls[2] as RatingIndicator).getValue();
        let min = (controls[3] as RangeSlider).getValue();
        let max = (controls[3] as RangeSlider).getValue2();
        let stock = (controls[4] as ComboBox).getSelectedKey();

        let aFilters = [];

        if (input) {
            aFilters.push(new Filter({
                filters:[
                    new Filter("product","Contains",input),
                    new Filter("productName","Contains", input)
                ],
                and: false
            }));
        }

        if (category) {
            aFilters.push(new Filter("category_ID","EQ", category))
        }

        if (rating) {
            aFilters.push(new Filter("rating","EQ",rating));
        }

        if (min || max) {
            aFilters.push(new Filter("price","BT", min, max));
        }

        if (stock) {
            aFilters.push(new Filter("stock_code","EQ",stock))
        }

        this.applyFilters(aFilters);
    }

    private applyFilters (filters : Filter[]) : void {
        const table = this.byId("table") as Table;
        const context = table.getBinding("items") as ODataListBinding;
        context.filter(filters);
    }

    public onClearPress (event: FilterBar$ClearEvent) : void {
        let controls = event.getParameter("selectionSet") as Control[];

        (controls[0] as Input).setValue("");
        (controls[1] as ComboBox).setSelectedKey("");
        (controls[2] as RatingIndicator).setValue("");
        (controls[3] as RangeSlider).setValue(0,{});
        (controls[3] as RangeSlider).setValue2(100);
        (controls[4] as ComboBox).setSelectedKey("");

        this.applyFilters([]);
    }

    public onNavToDetails (event : Event) : void {
        let item = (event.getSource()) as ColumnListItem;
        const bindingContext = item.getBindingContext() as Context;
        const id = bindingContext.getProperty("ID");

        const model = this.getModel("view") as JSONModel;
        model.setProperty("/layout","TwoColumnsMidExpanded");
        
        const router = this.getRouter();
        router.navTo("RouteDetails",{
            key: id
        });
    }
}