import { View } from '../../shared/view';
import { ButtonComponent } from '../components/button';

const DELAY_MS_BEFORE_SKIP = 3000;

export class ConfirmButton extends ButtonComponent {}

export class IntroView extends View {
  components = {
    confirm: new ConfirmButton(),
  };
}
