import ControllerExtension from 'sap/ui/core/mvc/ControllerExtension';
import ExtensionAPI from 'sap/fe/templates/ObjectPage/ExtensionAPI';
import JSONModel from 'sap/ui/model/json/JSONModel';
import View from 'sap/ui/core/mvc/View';
import Dialog from 'sap/m/Dialog';
import Fragment from 'sap/ui/core/Fragment';
import { DatePicker$ChangeEvent } from 'sap/m/DatePicker';
import { ComboBox$ChangeEvent } from 'sap/m/ComboBox';
import ListItem from 'sap/ui/core/ListItem';
import Context from 'sap/ui/model/odata/v4/Context';
import SinglePlanningCalendar from 'sap/m/SinglePlanningCalendar';
import ODataListBinding from 'sap/ui/model/odata/v4/ODataListBinding';

/**
 * @namespace therapist.ext.controller
 * @controller
 */
export default class ObjectPage extends ControllerExtension<ExtensionAPI> {

	_pDialog : Dialog;

	static overrides = {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf therapist.ext.controller.ObjectPage
		 */
		onInit(this: ObjectPage) {
			// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
			const model = this.base.getExtensionAPI().getModel();
			this.loadForm();
		}
	}

	private loadForm () : void {
		let data = {
			patient_ID: "",
			typeAppointment_ID: "",
			title: "",
			description: "",
			beginDate: null,
			endDate: null,
			startDate: "",
			endDate2: "",
			block_ID: "",
			beginTime: "",
			endTime: ""
		};
		const model = new JSONModel(data);
		//@ts-ignore
		(this.base.getView() as View).setModel(model,"form");
	}

	public async onOpenForm () : Promise<void> {
		//@ts-ignore
		const view = (this.base.getView() as View);

		this._pDialog??= await Fragment.load({
			id: view.getId(),
			name: 'therapist.ext.fragment.Form',
			controller: this
		}) as Dialog;

		view.addDependent(this._pDialog);
		this._pDialog.open();
	}

	public onClosePress () : void {
		this._pDialog.close();
	}

	public onChangeDatePickerPress (event : DatePicker$ChangeEvent) : void {
		const sDate = event.getParameter("value") as string;
		// @ts-ignore
		const form = (this.base.getView() as View).getModel("form") as JSONModel;
		form.setProperty("/endDate",sDate);
		form.setProperty("/startDate",sDate);
		form.setProperty("/endDate2",sDate);
	}

	public onChangeBlockPress (event : ComboBox$ChangeEvent) : void {
		let item = event.getSource().getSelectedItem() as ListItem;
		let context = item.getBindingContext() as Context;
		let sTimeText = context.getProperty("timeText") as string;
		let aTimes = sTimeText.split("  - ");
		let sBeginTime = aTimes[0];
		let sEndTime = aTimes[1];

		// @ts-ignore
		const form = (this.base.getView() as View).getModel("form") as JSONModel;
		form.setProperty("/startDate",form.getProperty("/startDate")+"T"+sBeginTime+"Z");
		form.setProperty("/endDate2",form.getProperty("/endDate2")+"T"+sEndTime+"Z");

		form.setProperty("/beginTime",sBeginTime);
		form.setProperty("/endTime",sEndTime);
	}

	public async onSavePress () : Promise<void> {
		// @ts-ignore
		const form = (this.base.getView() as View).getModel("form") as JSONModel;
		const body = form.getData();

		let planningCalendar = this.base.getExtensionAPI().byId("fe::CustomSubSection::PlanningCalendar--calendar") as SinglePlanningCalendar;
		let bindList = planningCalendar.getBinding("appointments") as ODataListBinding;
		await bindList.create(body).created();

		this.reset();
	}

	private reset () : void {
		this.loadForm();
		this.onClosePress();
	}
}