import fs from "fs";
import path from "path";
import _ from "lodash";
import { throwMetaError } from "@cmtv/error-meta";

import { canGetProperty, parseYamlFile } from "src/util";

export type TBooks = {
    [id: string]: string | { [bookId: string]: string }
}

export interface IConfig
{
    language: string;
    books: TBooks;
}

export function loadRawConfig(fromDir: string): IConfig
{
    let configFile = path.join(fromDir, 'erudit.yml');
    let errMeta = { 'Config file': configFile };

    if (!fs.existsSync(configFile))
        throwMetaError('Config file not found!', errMeta);

    let rawConfig;

    try { rawConfig = parseYamlFile(configFile); }
    catch { throwMetaError('Error when reading config file!', errMeta); }

    return rawConfig;
}

export function validateConfig(rawConfig: IConfig)
{
    if (!canGetProperty(rawConfig))
        throwMetaError('Config is not an accessable object!');

    validate_language(rawConfig);
    validate_books(rawConfig);
}

function missingProperty(property: string)
{
    throwMetaError('Missing config property!', { 'Property': property });
}

function validate_language(rawConfig: IConfig)
{
    let language = _.get(rawConfig, 'language');

    if (!language)
        missingProperty('language');

    if (typeof language !== 'string')
        throwMetaError('Language property must be a string!');

    if (language.length !== 2)
        throwMetaError('Language property must be 2 characters long!');
}

function validate_books(rawConfig: IConfig)
{
    let books = _.get(rawConfig, 'books');

    if (!books)
        missingProperty('books');

    if (typeof books !== 'object')
        throwMetaError('Books property must be an object!');

    if (!canGetProperty(books))
        throwMetaError('Books property in not an accessable object!');
}