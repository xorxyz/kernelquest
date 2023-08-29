import { esc, Keys, Style } from '../../shared';
import { componentFrom } from '../component';
import { VirtualTerminal } from '../pty';
import { View } from '../view';
import { PlayerSelectScreen } from './player-select-screen';

const str = `
  _,▄▄        
  ▀████▀ ▀███'                                 ███▌        
   ▐███ ▄██\`   ,▄▄▄▄▄ ▄▄▄▄▄█▄,▄▄▄,▄█▄_  ,▄▄▄▄, ▐██▌        
   ▐██████▄   ███ ▐██▌ ███▀▀▀ ███▀▐██▌ ▄█▌ ▐██ ▐██▌        
   ▐███ ▐███  ███▀▀  _ ███    ███ ▐██▌ ███▀▀   ▐██▌        
  ▄████▄ ▀███W ▀████▀ ▄███▄  ▄███▄▐███.▀█████▀ ████        
         ▄▄█████▄_                             ▄▌        
       ,███   ▀███▄ ▄▄▄r▄▄▄▄   ▄▄▄▄,  ,▄▄▄▄, ▄███▄▄      
       ███▌    ▐███ ███▌▐███ ▄██ ▐██▌▐██▄▄█▀ ▐███        
       ▐███▄   ▐███ ███▌ ███ ████▀\`   ▀█████ ▐███        
         ███████▀▀  ▐███████▄ ▀█████▀▐██▄▄█▀  █████      
        ]█▀███▄▄▄█                                       
             ▀▀▀▀  
`

export class TitleScreen extends View {
  components = {
    title: componentFrom(18, 3, str.split('\n')),
    copyright: componentFrom(31, 24, [`${esc(Style.Dim)}© 2019-2023 Jonathan Dupré `]),
    prompt: componentFrom(37, 20, ['Press any key ']),
  };
  handleInput(str, pty: VirtualTerminal) {
    if (str === Keys.ESCAPE) {
      if (global.electron) global.electron.exit();
      return;
    }
    pty.clear();
    pty.view = new PlayerSelectScreen(pty.engine.saveGames);
  }
}
