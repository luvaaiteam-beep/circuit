const fs = require('fs');
let code = fs.readFileSync('src/components/UI.tsx', 'utf8');

const startIndex = code.indexOf('<div className="flex px-4 border-b border-zinc-800 shrink-0">');
const endIndex = code.indexOf('              <div className="flex flex-col gap-4">', startIndex) + '              <div className="flex flex-col gap-4">'.length;

const replaceStr = `<div className="flex px-4 py-3 border-b border-zinc-800 shrink-0">
            <h3 className="text-zinc-100 font-bold text-sm">Inspector</h3>
          </div>
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col gap-4">`;

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + replaceStr + code.substring(endIndex);
  fs.writeFileSync('src/components/UI.tsx', code);
  console.log('Fixed 3');
} else {
  console.log('Not found');
}
