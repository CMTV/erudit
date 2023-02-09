import EruditGroup from "src/process/EruditGroup";

// Processes
import PrepareSiteDir from "./PrepareSiteDir";
import MoveSiteFiles from "./MoveSiteFiles";
import BuildGlobalStyles from "./BuildGlobalStyles";
import BuildGlobalScripts from "./BuildGlobalScripts";
import BuildPageStyles from "./BuildPageStyles";
import BuildPageScripts from "./BuildPageScripts";
import MoveFiles from "./MoveFiles";
import BuildCName from "./BuildCName";

export default class BuildBaseGroup extends EruditGroup
{
    name = 'Build site base';

    getProcessTypes()
    {
        return [
            PrepareSiteDir,
            MoveSiteFiles,
            BuildCName,
            BuildGlobalStyles,
            BuildPageStyles,
            BuildGlobalScripts,
            BuildPageScripts,

            MoveFiles,
        ];
    }
}