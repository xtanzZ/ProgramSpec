import { FormType } from "./formtype";
import { PageImage } from "./pageimage";
import { ServiceSpec } from "./serviceSpec";

export interface UISpec {
    uispecId: number,
    label:string,
    attribure:string,
    formType:FormType,
    detail:string,
    event:string,
    pageimage:PageImage,
    service:ServiceSpec,
}