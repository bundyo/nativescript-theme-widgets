import { Property, CSSType } from "tns-core-modules/ui/core/view";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout";
import { parse } from "tns-core-modules/ui/builder";
import { decorate, updateClasses } from "../utils/utils";
import template from "./NTInput.template.xml";

export const labelProperty = new Property({ name: "label", defaultValue: undefined });
export const validProperty = new Property({ name: "valid", defaultValue: true });

export class NTInput extends GridLayout {
    static get changeEvent() { return "change" }

    constructor() {
        super();

        this.className = "nt-input";
        this.rows = "*, *";

        let component = parse(template);
        while (component.getChildrenCount() !== 0) {
            const child = component._subViews[component.getChildrenCount() - 1];

            component.removeChild(child);
            this.addChild(child);
        }

        this.once("loaded", ({ object }) => {
            object.bindingContext = object;
        });
    }

    showPopup(args) {
        args.object.showModal(parse(`<Page>
    <Label text="{{ text }}" />
</Page>`), {
            context: {
                text: "Remember, remember the fifth of November!"
            },
            ios: {
                presentationStyle: 7
            }
        });

        // debugger;
        // if (this.className.indexOf("-validation-popup") > -1) {
        //     updateClasses(this, null, ["-validation-popup"]);
        // } else {
        //     updateClasses(this, ["-validation-popup"]);
        // }
    }
}

labelProperty.register(NTInput);
validProperty.register(NTInput);

decorate(CSSType, NTInput);
