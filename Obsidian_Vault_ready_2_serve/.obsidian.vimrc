" short cut back to Normal mode 
imap ;; <Esc>

" <Space> Namespace
" a d h j k c m q w 
unmap <Space>

" save and close the vim way
exmap vimSaveCloseSingle jsfile .vim_tricks/vimSaveClose.js {main()}
map <Space>q :vimSaveCloseSingle<CR>
" set the obsidian Ex command
exmap wq vimSaveCloseSingle

" save and close the vim way ALL
exmap vimSaveClose jsfile .vim_tricks/vimSaveCloseAll.js {main('all')}
map <Space>a :vimSaveClose<CR>
exmap wqa vimSaveClose

" close a single tab
exmap q obcommand workspace:close

exmap splitVertical obcommand workspace:split-vertical
"nmap <C-w>v :splitVertical
nmap <Space>v :splitVertical

" Quickly remove search highlights
map <Space>h :nohl<CR>

" insert dataview code block
map <Space>d :insertDataviewBlock<CR>
exmap insertDataviewBlock jsfile .vim_tricks/insertDataviewBlock.js {insertDataviewBlock()}

" let ee = $OWK
" let n= getenv('OWK')
exmap whereSpaceStation jsfile .vim_tricks/iss.js {main()}
map <Space>s :whereSpaceStation<CR>

exmap loadWS jsfile .vim_tricks/workspace.js {main()}
map <Space>w :loadWS<CR>

exmap addLineDown jsfile .vim_tricks/addLineSpace.js {addLine('down')}
map <Space>j :addLineDown<CR>

exmap addLineUp jsfile .vim_tricks/addLineSpace.js {addLine('up')}
map <Space>k :addLineUp<CR>

" Create Callout Section with the current line as the title.
exmap createCallout jsfile .vim_tricks/createCallout.js {createCallout()}
map <Space>c :createCallout<CR>

" Reference for alt/option combinations to produce special characters
"alt key then c returns ç ALSO attainable :dig code i_ctrl_k c,
" c -> ç  		c,
" p -> π  		p*	
" j -> ∆  		DE
" u -> ¨		':
exmap surround_backlink surround [[ ]]
" alt/opt w
map ∑ :surround_backlink<CR> 

exmap surround_backticks surround ` `
" alt/opt c
map ç :surround_backticks<CR> 

exmap ExPDf obcommand workspace:export-pdf
" alt/opt p
map π :ExPDf

exmap logCursor jscommand { console.log(editor.getCursor());  ed_obj=editor;}
" alt/opt j
nmap ∆ :logCursor

exmap nextHeading jsfile mdHelpers.js {jumpHeading(true)}
exmap prevHeading jsfile mdHelpers.js {jumpHeading(false)}
nmap ]] :nextHeading
nmap [[ :prevHeading

exmap mkCap jsfile mkCap.js {CapitalizeWord()}
" alt/opt u
nmap ¨ :mkCap

" insert mode 'shortcuts' 
" turn <space>b.c<space> into becuase
" _-cancelled bc of interference. Need to make a little smarter. like check
" its surroundings before a change is made.
" imap bc because 

" Yank to system clipboard
set clipboard=unnamed

exmap focusRight obcommand editor:focus-right
nmap <C-w>l :focusRight

exmap focusLeft obcommand editor:focus-left
nmap <C-w>h :focusLeft

exmap focusTop obcommand editor:focus-top
nmap <C-w>k :focusTop

exmap focusBottom obcommand editor:focus-bottom
nmap <C-w>j :focusBottom


exmap splitHorizontal obcommand workspace:split-horizontal
nmap <C-w>s :splitHorizontal

" Tabs
exmap nextTab obcommand workspace:next-tab
exmap prevTab obcommand workspace:previous-tab
nnoremap gt :nextTab<CR>
nnoremap gT :prevTab<CR>


