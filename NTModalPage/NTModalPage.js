import { decorate } from "../utils/utils";
import { CSSType } from "tns-core-modules/ui/core/view";
import { Page } from "tns-core-modules/ui/page";

export class NTModalPage extends Page {}

decorate(CSSType, NTModalPage);
