#!/usr/bin/env node

const fs = require('fs');
const { promises: fsp } = fs;
const path = require('path');
const yargs = require('yargs');
const moment = require('moment');

const template = require('./templates/task');

const options = yargs
    .usage('Usage: -n <name>')
    .option('absolute-path', { alias: 'p', describe: 'Absolute path directory "$HOME/vimwiki/src"', type: 'string', demandOption: false, })
    .option('dest', { alias: 'd', describe: 'Destination directory "./tasks"', type: 'string', demandOption: true, })
    .option('index', { alias: 'i', describe: 'Index file "./tasks.md"', type: 'string', demandOption: true, })
    .option('format', { describe: 'Task file filename "\'task_{index}_{date}\'"', type: 'string', demandOption: true, })
    .argv;

const main = async () => {
    const { dest, index, format } = options;
    const absolutePath = options.absolutePath || process.cwd();
    const absoluteDest = path.join(absolutePath, dest);

    const createNewTaskName = async (index = 1) => {
        const name = format
            .replace(/\{date\}/g, moment(new Date()).format('YYYY_MM_DD'))
            .replace(/\{index\}/g, index) + '.md';

        const pathname = path.join(absoluteDest, name);

        if (fs.existsSync(pathname)) {
            return createNewTaskName(++index);
        }

        return {
            name,
            pathname,
        };
    }

    const formatTaskName = (name) => {
        let indexName = (name.replace(/\_/g, ' ').replace(/\.md$/, ''));

        return (indexName.charAt(0).toUpperCase() + indexName.slice(1))
            .replace(/(\d{4}) (\d{2}) (\d{2})$/gi, '/ $1-$2-$3');
    };

    const createNewTask = async () => {
        const { name, pathname } = await createNewTaskName();
        const tpl = template.render({
            index: path.join('..', index),
            name: formatTaskName(name),
        });

        await fsp.writeFile(pathname, tpl);

        let indexName = formatTaskName(name);

        const absoluteIndex = path.join(absolutePath, index);

        fsp.appendFile(absoluteIndex, [
            ``,
            `[${indexName}](${path.join(dest, name)})`
        ].join('\n'))

        return {
            name,
            pathname
        };
    }

    if (!fs.existsSync(absoluteDest)) {
        await fsp.mkdir(absoluteDest, { mode: 0o755 });
    }

    await createNewTask();
}

main();
