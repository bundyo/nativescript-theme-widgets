import { CSSType, Property } from "tns-core-modules/ui/core/view";
import { Span } from "tns-core-modules/text/span";
import { Label } from "tns-core-modules/ui/label";
import { decorate, updateClasses } from "../utils/utils";

const lastIcon = {
    className: "",
    variant: ""
};

function updateIcon(component) {
    if (!component._styleScope) {
        return;
    }

    if (!component.lastIcon) {
        component.lastIcon = lastIcon;
    }

    const newIcon = {
        className: `${component.ns}-${component.name}`,
        variant: component.variant
    };
    const icon = component._styleScope._selectors.class[newIcon.className];

    icon && icon
        .flatMap((value) => value.sel.ruleset.declarations)
        .reverse()
        .some((dec) => {
            if (dec.property === "content") {
                const value = dec.value.replace(/^"|"$/g, "");

                component.text = value.startsWith("\\") ?
                    String.fromCharCode(`0x${(value.match(/[a-f\d]{2,4}/i) || [])[0]}`) :
                    value;

                updateClasses(component, ["nt-icon", newIcon.variant, newIcon.className],
                    [component.lastIcon.variant, component.lastIcon.className]);

                component.lastIcon = newIcon;

                return true;
            }
        });
}

const ExtendIcon = (Base) => {
    class IconBase extends Base {
        onLoaded() {
            super.onLoaded();

            updateIcon(this);
        }
    }

    new Property({
        name: "ns",
        defaultValue: "fa",
        valueChanged: (target, oldValue, newValue) => {
            updateClasses(target, newValue, oldValue);
        }
    }).register(IconBase);

    new Property({
        name: "name",
        defaultValue: undefined,
        valueChanged: updateIcon
    }).register(IconBase);

    new Property({
        name: "variant",
        defaultValue: "fa",
        valueChanged: updateIcon
    }).register(IconBase);

    return IconBase;
};

export class NTIcon extends ExtendIcon(Label) {}
export class NTSpanIcon extends ExtendIcon(Span) {}

decorate([
    CSSType("NTIcon")
], NTIcon);

decorate([
    CSSType("NTSpanIcon")
], NTSpanIcon);
