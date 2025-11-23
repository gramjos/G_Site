function getWordAtIndex(phrase, index) {
  // why not split by space?
  const pattern = /\b\w+\b/g;
  let match;
  var charCount =0;
  while ((match = pattern.exec(phrase)) !== null) {
    if (index >= match.index && index < pattern.lastIndex) {
		// slicing so i dont get the first occurrence if there is more
      return phrase.slice(0,charCount )+phrase.slice(charCount ).replace(match[0], match[0].toUpperCase());
    }
    charCount +=match[0].length;//
  }
  return "";
}

function CapitalizeWord() {
	const lineNo = editor.getCursor().line; 
	const charNo = editor.getCursor().ch; 
	const docu = editor.getValue().split('\n')
	const ch_ln = getWordAtIndex(docu[lineNo],charNo); 
	console.log(ch_ln); 
	if (ch_ln === ""){return;}
	editor.setLine(lineNo,ch_ln); 

 }

