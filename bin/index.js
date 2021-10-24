#!/usr/bin/env node

import fs, { promises as fsp } from 'fs';
import path from 'path';
import yargs from 'yargs';
import moment from 'moment';

const options = yargs
    .usage('Usage: -n <name>')
    .option('absolute-path', { alias: 'p', describe: 'Absolute path directory "$HOME/Desktop/taskmd"', type: 'string', demandOption: true, })
    .option('dest', { alias: 'd', describe: 'Destination directory "./tasks"', type: 'string', demandOption: true, })
    .option('index', { alias: 'i', describe: 'Index file "./tasks.md"', type: 'string', demandOption: true, })
    .option('format', { describe: 'Task file filename "\'task_{index}_{date}\'"', type: 'string', demandOption: true, })
    .argv;

const main = async () => {
    const { dest, index, format, absolutePath } = options;
    
    const absoluteDest = () => {
        return path.join( absolutePath, dest);
    }
    
    const getNewTaskFilename = async (index = 1) => {
        const files = await fsp.readdir(absoluteDest());

        
        const name = format.replace(/\{date\}/g, moment(new Date()).format('YYYY_MM_DD'))
            .replace(/\{index\}/g, index) + '.md';
        
        const pathname = path.join(absoluteDest(), name);
        if (fs.existsSync(pathname)) {
            return getNewTaskFilename(++index);
        }
        
        return {
            name,
            pathname,
        };
    }
    
    const formatTaskName = (name) => {
        let indexName = name.replace(/\_/g, ' ').replace(/\.md$/, '');
        indexName = indexName.charAt(0).toUpperCase() + indexName.slice(1);
        indexName = indexName.replace(/(\d{4}) (\d{2}) (\d{2})$/gi, '/ $1-$2-$3');
        return indexName;
    };
    
    const createNewTask = async ({name, pathname}) => {
        const template = [
            `[Back](${path.join('..', index)})`,
            '',
            `# ${formatTaskName(name)}`,
            '',
        ];
        
        await fsp.writeFile(pathname, template.join('\n'));
        
        let indexName = formatTaskName(name);
        
        const absoluteIndex = path.join(absolutePath, index);

        fsp.appendFile(absoluteIndex, [
            ``,
            `[${indexName}](${path.join(dest, name)})`
        ].join('\n'))
        
        return {
            name,
            pathname
        }
    }
        
    if (!fs.existsSync(absoluteDest())) {
        await fsp.mkdir(absoluteDest(), { mode: 0o755 });
    }

    const { name, pathname } = await createNewTask(await getNewTaskFilename());
}

main();
