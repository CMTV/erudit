import { throwMetaError } from "@cmtv/error-meta";
import fs from "fs";

import DataTopicConfig from "src/entity/topic/data";

export function ensureConfigExists(path: string)
{
    if (!fs.existsSync(path))
        throwMetaError('Missing topic config file!', { Config: path });
}

export function ensureConfigValid(config: DataTopicConfig)
{
    if (!config.title)
        throwMetaError(`Missing 'title' config property!`);
}