#!/usr/bin/env node

import arg from "arg";
import chokidar from "chokidar";
import chalk from "chalk";
import express from "express";
import { WebSocketServer } from "ws";
import { enableMetaErrors, MetaError, throwMetaError } from "@cmtv/error-meta";

import { erudit, ERUDIT_INIT } from "src/erudit";
import FillGroup from "src/process/fill/FillGroup";
import BuildGroup from "src/process/build/BuildGroup";
import { upperFirst } from "src/util";
import { Config, SET_CONFIG } from "src/config";
import { SITEMAP } from "./process/build/WriteSitemap";

enableMetaErrors();

//#region Parsing CLI command

const args = arg({
    '--project': String,    // Working directory
    '-p': '--project',

    '--target': [String],   // Targets to compile
    '-t': '--target',

    '--data': Boolean,
    '--site': Boolean,
    '--dev': Boolean
});

if (args['_'].length < 1)
    throwMetaError('Command not specified!');

let command = args['_'][0];

if (!['build', 'watch'].includes(command))
    throwMetaError('Unknown command!', { 'Command': command });

let data = !!args['--data'];
let site = !!args['--site'];

if (!data && !site)
    data = site = true;

//#endregion

printStart();

ERUDIT_INIT(args['--project'] ?? '', args['--target'], !!args['--dev']);

printStartInfo();

if (command === 'build')
    build();

if (command === 'watch')
{
    let httpServer = express();
        httpServer.use(express.static(erudit.path.site()));
        httpServer.listen(3000, () => {});

    let wss = new WebSocketServer({ port: 8080 });
    let ws: WebSocket;
    
    wss.on('connection', socket => ws = socket);

    let delay = null;

    chokidar.watch([erudit.path.project(), erudit.path.package('site')], {
        ignored: [
            erudit.path.erudit(),
            erudit.path.site(),
        ]
    }).on('all', () =>
    {
        clearTimeout(delay);
        delay = setTimeout(async () =>
        {
            try
            {
                await build();
                
                if (ws)
                    ws.send('reload');
            }
            catch (e)
            {
                if (e instanceof MetaError) e.print();
                else console.log(e);

                console.log();
            }

            console.log(chalk.bgCyan.white.bold(' WAITING FOR CHANGES... '));
        }, 1000);
    });
}

//
//
//

async function build()
{
    console.log();

    if (data) await buildData();
    if (site) await buildSite();
}

async function buildData()
{
    if (erudit.db)
        await erudit.db.destroy();

    require('rimraf').sync(erudit.path.erudit());

    await erudit.setupDb();

    let fillGroup = new FillGroup(erudit, erudit.db);

    await fillGroup.run();
}

async function buildSite()
{
    if (!erudit.db)
        await erudit.setupDb();

    SET_CONFIG(Config.makeConfig(erudit.pConfig));

    SITEMAP.reset();

    let buildGroup = new BuildGroup(erudit, erudit.db);

    await buildGroup.run();
}

//#region Print functions
//
//

function printStart()
{
    console.log();
    console.log(`
███████╗██████╗ ██╗   ██╗██████╗ ██╗████████╗
██╔════╝██╔══██╗██║   ██║██╔══██╗██║╚══██╔══╝
█████╗  ██████╔╝██║   ██║██║  ██║██║   ██║   
██╔══╝  ██╔══██╗██║   ██║██║  ██║██║   ██║   
███████╗██║  ██║╚██████╔╝██████╔╝██║   ██║   
╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝   ╚═╝
`.trim());
}

function printStartInfo()
{
    console.log();

    printDataLine('Version', require(erudit.path.package('package.json')).version);
    printDataLine('Project', erudit.path.project());
    printDataLine('Mode', upperFirst(command) + (erudit.dev ? chalk.yellow.italic(' (Development)') : ''));

    let modes = [];
    
    if (data) modes.push('Data');
    if (site) modes.push('Site');
    
    printDataLine('Todo', modes.join(', '));
}

function printDataLine(label: string, data: string)
{
    console.log(chalk.gray(label + ':') + ' ' + chalk.whiteBright.bold(data));
}

//
//
//#endregion