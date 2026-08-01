const fs = require('fs');
let code = fs.readFileSync('src/components/UI.tsx', 'utf8');

const targetStr = `                ) : (
                  <div className="text-center p-4 text-zinc-500 text-xs">No component selected.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile AI Sheet */}`;

const replaceStr = `                ) : (
                  <div className="text-center p-4 text-zinc-500 text-xs">No component selected.</div>
                )}
              </div>
            </div>
          </div>
      )}

      {/* Mobile AI Sheet */}`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replaceStr);
  fs.writeFileSync('src/components/UI.tsx', code);
  console.log('Fixed 4');
} else {
  console.log('Not found');
}
