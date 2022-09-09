import { withErrorMeta } from "@cmtv/error-meta";
import { DataSource } from "typeorm";

import Path from "src/erudit/Path";
import Targets from "src/erudit/Targets";
import { IProjectConfig, loadRawConfig, TBooks, validateConfig } from "src/erudit/config";
import { Language, loadLangObj } from "src/erudit/i18n";

import getDb from "src/erudit/db";
import { Config, SET_CONFIG } from "./config";

export class Erudit
{
    pConfig:    IProjectConfig;

    path:       Path;
    targets:    Targets;
    lang:       Language;
    books:      TBooks;
    db:         DataSource;
    dev:        boolean;

    constructor(projectPath: string, targets: string[], dev: boolean)
    {
        this.path = new Path(projectPath);
        this.targets = new Targets(targets);
        this.dev = dev;

        let config = loadRawConfig(this.path.project());

        this.pConfig = config;

        withErrorMeta(() =>
        {
            validateConfig(config);

            // Language
            
            let langPath = this.path.package('languages', config.language + '.yml');
            let langObj = loadLangObj(langPath);
            this.lang = withErrorMeta(() => { return new Language(config.language, langObj) }, { 'Language file': langPath });

            // Books
            
            this.books = config.books;            
        },
        {
            'Config file': this.path.project('erudit.yml')
        });
    }

    async setupDb()
    {
        this.db = await getDb(this.path.erudit('data.db'));
    }
}

//
//
//

export let erudit: Erudit = null;

export function ERUDIT_INIT(projectPath: string, targets: string[], dev: boolean)
{
    erudit = new Erudit(projectPath, targets, dev);
}