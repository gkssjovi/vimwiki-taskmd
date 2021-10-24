## Description

Create new task in markdown format using vimwiki

## Requirements

You must install this plugin for neovim
https://github.com/vimwiki/vimwiki

## Installation

``` sh
git clone https://github.com/gkssjovi/vimwiki-taskmd.git
cd vimwiki-taskmd
npm run app:install

vimwiki-taskmd --help
```


## Configuration

Open the file `~/.config/nvim/init.vim` and insert the following lines to the bottom of the file.

``` sh
function! VimwikiCreateNewTask()
  :echo system('vimwiki-taskmd  --absolute-path $HOME/vimwiki/src/ --dest ./tasks/ --index ./tasks.md --format "task_{index}_{date}"')
endfunction

command! VimwikiCreateNewTask :call VimwikiCreateNewTask()
nmap <leader>wt :VimwikiCreateNewTask<CR>
```

## Optional Configuration

Add in your `~/.zshrc` file
``` sh
alias task="vim ~/vimwiki/src/tasks.md"
```

Copy the task template `./assets/template.md` into the configuration file

``` sh
cp ./assets/template.md ~/.config/vimwiki-taskmd/template.md
```


## Usage
- `task` - Create a new wiki file when you are in terminal
- `<leader>ww` - Create new wiki file when you are in vim
- `<leader>wt` - Create a new task and add a new line to `tasks.md` file


## Demo

![Demo](./images/demo.gif)

