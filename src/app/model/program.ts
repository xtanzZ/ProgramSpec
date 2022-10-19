import { Project } from "./project";
import { Status } from "./status";
import { System } from "./system";
import { SystemAnalyst } from "./systemanalyst";

export interface Program {
    programId: number,
    programName: string,
    project: Project,
    system: System,
    systemAnalyst: SystemAnalyst,
    status: Status
    
}
