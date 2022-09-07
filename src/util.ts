import YAML, { stringify } from "yaml";
import fs from "fs";


export function parseYamlFile(path: string)
{
    return YAML.parse(fs.readFileSync(path, 'utf-8'));
}

export function canGetProperty(obj: any)
{
    try { obj['property']; return true; }
    catch { return false; }
}

export function skipFirstLine(str: string)
{
    return str.substring(str.indexOf('\n') + 1);
}

export function upperFirst(str: string)
{
    return str.charAt(0).toUpperCase() + str.slice(1);
}