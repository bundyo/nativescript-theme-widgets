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

const nsArgs = {
    name: "ns",
    defaultValue: "fa",
    valueChanged: (target, oldValue, newValue) => {
        updateClasses(target, newValue, oldValue);
    }
};

const nameArgs = {
    name: "name",
    defaultValue: undefined,
    valueChanged: updateIcon
};

const variantArgs = {
    name: "variant",
    defaultValue: "fa",
    valueChanged: updateIcon
};

export class NTIcon extends Label {
    onLoaded() {
        super.onLoaded();

        updateIcon(this);
    }
}

export class NTSpanIcon extends Span {
    onLoaded() {
        super.onLoaded();

        updateIcon(this);
    }
}

new Property(nsArgs).register(NTIcon);
new Property(nameArgs).register(NTIcon);
new Property(variantArgs).register(NTIcon);

new Property(nsArgs).register(NTSpanIcon);
new Property(nameArgs).register(NTSpanIcon);
new Property(variantArgs).register(NTSpanIcon);

decorate([
    CSSType("NTIcon")
], NTIcon);

decorate([
    CSSType("NTSpanIcon")
], NTSpanIcon);
