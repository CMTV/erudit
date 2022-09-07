import fs from "fs";
import YAML from "yaml";
import _ from "lodash";
import { throwMetaError } from "@cmtv/error-meta";

import { canGetProperty } from "src/util";

export class Language
{
    langCode: string;

    private langObj: object;

    constructor(langCode: string, langObj: object)
    {
        this.langCode = langCode;

        if (!canGetProperty(langObj))
            throwMetaError('Language is not an accessable object!');

        this.langObj = langObj;
    }

    phrase(key: string, ...values: (string|object)[])
    {
        let phrase = _.get(this.langObj, key);

        if (typeof phrase !== 'string')
            return key;

        let valuesObj = {};
        let strI = 0;

        values.forEach(value =>
        {
            if (typeof value === 'string')
                valuesObj[strI++] = value;
            else
                valuesObj = {...valuesObj, ...value};
        });

        let i = 0;

        return phrase.replace(/{(\w+)}/gm, (match, paramKey) =>
        {
            return valuesObj[paramKey] ?? valuesObj[i++] ?? `<${paramKey}>`;
        });
    }
}

export function loadLangObj(langPath: string) : Language
{
    let errMeta = { 'Language file': langPath };

    if (!fs.existsSync(langPath))
        throwMetaError('Missing language file!', errMeta);

    let langObj;

    try
    {
        langObj = YAML.parse(fs.readFileSync(langPath, 'utf-8'));
    }
    catch { throwMetaError('Failed to parse language file!', errMeta); }

    return langObj;
}