import EruditGroup from "src/process/EruditGroup";

// Processes
import PrepareSiteDir from "./PrepareSiteDir";
import MoveSiteFiles from "./MoveSiteFiles";
import BuildGlobalStyles from "./BuildGlobalStyles";
import BuildGlobalScripts from "./BuildGlobalScripts";
import BuildPageStyles from "./BuildPageStyles";
import BuildPageScripts from "./BuildPageScripts";

export default class BuildBaseGroup extends EruditGroup
{
    name = 'Build site base';

    getProcessTypes()
    {
        return [
            PrepareSiteDir,
            MoveSiteFiles,
            BuildGlobalStyles,
            BuildPageStyles,
            BuildGlobalScripts,
            BuildPageScripts
        ];
    }
}