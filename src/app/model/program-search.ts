import { Program } from "./program";
import { Status } from "./status";

export interface ProgramSearch {
    program: Program,
    employeeName: String,
    status: Status
}