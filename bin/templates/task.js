const path = require('path');
const os = require('os');
const fs = require('fs');

const template = [
    '[Back]({index})',
    '',
    '# {name}',
    '',
].join('\n');

const render = (vars) => {
    let tpl = template;
    const templatePath = path.join(os.homedir(), '.config/vimwiki-taskmd/template.md');


    if (fs.existsSync(templatePath)) {
        tpl = fs.readFileSync(templatePath, 'utf-8');
    }

    for (let [key, value] of Object.entries(vars)) {
        tpl = tpl.replace(new RegExp(`\{${key}\}`, 'g'), value);
    }

    return tpl;
};

module.exports = {
    render,
}
