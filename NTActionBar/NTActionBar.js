import { CSSType, Property } from "tns-core-modules/ui/core/view";
import { ActionBar } from "tns-core-modules/ui/action-bar";
import { parse } from "tns-core-modules/ui/builder";
import template from "./NTActionBar.template.xml";
import { isAndroid } from "tns-core-modules/platform";
import { decorate } from "../utils/utils";

export const titleProperty = new Property({name: "title", defaultValue: undefined});

export class NTActionBar extends ActionBar {
    static get menuEvent() { return "menu" }
    static get backEvent() { return "back" }

    constructor() {
        super();

        this.titleView = parse(template);

        this.once('loaded', ({ object }) => {
            object.bindingContext = object;

            if (isAndroid) {
                object.nativeViewProtected.setContentInsetsAbsolute(0, 0);
            }
        });
    }

    onTap(args) {
        this.notify(Object.assign(args,{ eventName: this.back ? 'back' : this.menu ? 'menu' : 'custom' }));
    }
}

titleProperty.register(NTActionBar);

decorate(CSSType, NTActionBar);

