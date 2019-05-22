import { CSSType, Property } from "tns-core-modules/ui/core/view";
import { Label } from "tns-core-modules/ui/label";
import { decorate, updateClasses } from "../utils/utils";

const updateIcon = (target) => target.updateIcon();

let lastIcon = {
    className: "",
    variant: ""
};

export const nameProperty = new Property({
    name: "name",
    defaultValue: undefined,
    valueChanged: updateIcon
});

export const nsProperty = new Property({
    name: "ns",
    defaultValue: "fa",
    valueChanged: (target, oldValue, newValue) => {
        updateClasses(target, newValue, oldValue);
    }
});

export const variantProperty = new Property({
    name: "variant",
    defaultValue: "fa",
    valueChanged: updateIcon
});

export class NTIcon extends Label {
    updateIcon() {
        if (!this._styleScope) {
            return;
        }

        const newIcon = {
            className: `${this.ns}-${this.name}`,
            variant: this.variant
        };
        const icon = this._styleScope._selectors.class[newIcon.className];

        icon && icon
            .flatMap((value) => value.sel.ruleset.declarations)
            .reverse()
            .some((dec) => {
                if (dec.property === "content") {
                    const value = dec.value.replace(/^"|"$/g, "");

                    this.text = value.startsWith("\\") ?
                                String.fromCharCode(`0x${(value.match(/[a-f\d]{2,4}/i) || [])[0]}`) :
                                value;

                    updateClasses(this, ["nt-icon", newIcon.variant, newIcon.className],
                                     [lastIcon.variant, lastIcon.className]);

                    lastIcon = newIcon;

                    return true;
                }
            });
    }

    onLoaded() {
        super.onLoaded();

        this.updateIcon();
    }
}

nsProperty.register(NTIcon);
nameProperty.register(NTIcon);
variantProperty.register(NTIcon);

decorate([
    CSSType("NTIcon")
], NTIcon);
