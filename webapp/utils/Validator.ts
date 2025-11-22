import ComboBox from 'sap/m/ComboBox';
import Input from 'sap/m/Input';
import RatingIndicator from 'sap/m/RatingIndicator';
import Select from 'sap/m/Select';
import TextArea from 'sap/m/TextArea';
import { ValueState } from 'sap/ui/core/library';
import SimpleForm from 'sap/ui/layout/form/SimpleForm';

/**
 * @namespace com.logaligroup.products.utils
 */

export default class SimpleFormValidator {

    private isValid : boolean;

    constructor () {
        this.isValid = true;
    }

    public validate (simpleForm : SimpleForm) : boolean {
        this.validateForm(simpleForm);
        return this.isValid;
    } 

    private validateForm(oForm: SimpleForm): void {

        const aControls = oForm.getContent();

        aControls.forEach(control => {

            if (this.isValidatable(control)) {

                const value = this.getControlValue(control);
                
                if (!value) {
                    if (control instanceof RatingIndicator) {
                        control.addStyleClass("ratingError");
                        this.isValid = false;
                    } else {
                        (control as Input | TextArea | ComboBox | Select ).setValueState(ValueState.Error);
                        (control as Input | TextArea | ComboBox | Select ).setValueStateText("Este campo es obligatorio");
                        this.isValid = false;
                    }

                } else if (control instanceof RatingIndicator) {
                    control.removeStyleClass("ratingError");
                } else {
                    (control as Input | TextArea | ComboBox | Select ).setValueState(ValueState.None);
                }
            }
        });
    }

    private isValidatable(control: any): boolean {
        return control instanceof Input ||
               control instanceof TextArea ||
               control instanceof ComboBox ||
               control instanceof Select || 
               control instanceof RatingIndicator;
    }

    private getControlValue(control: any): string | number | null {
        if (control instanceof Input || control instanceof TextArea || control instanceof RatingIndicator) {
            return control.getValue();
        } else if (control instanceof ComboBox || control instanceof Select) {
            return control.getSelectedKey();
        }
        return null;
    }
}