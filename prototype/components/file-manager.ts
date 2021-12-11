import { debug } from "../lib/utils";
import { Grid } from "./grid";

export class FileManager {
  selectEl: HTMLSelectElement
  fileInputEl: HTMLInputElement
  grid: Grid

  constructor (selectEl: HTMLSelectElement, fileInputEl: HTMLInputElement, grid: Grid) {
    this.selectEl = selectEl;
    this.fileInputEl = fileInputEl;
    this.grid = grid;

    selectEl.addEventListener('change', this.onSelect.bind(this));
    fileInputEl.addEventListener('change', this.onFileOpen.bind(this));
  }

  reset () {
    this.selectEl.selectedIndex = 0;
  }

  onSelect (e) {
    const options = {
      'file': this.noop.bind(this),
      'new_file': this.newFile.bind(this),
      'open_file': this.openFile.bind(this),
      'save_as': this.saveAs.bind(this)
    };

    const selected = (e.target as HTMLSelectElement).selectedOptions[0];
    const method = options[selected.value];

    if (!method || !Object.values(options).includes(method)) {
      return console.error('\'' + selected.value + '\': option does not exist.');
    }

    method();
  }

  async onFileOpen (e) {
    debug((e.target as HTMLInputElement).files);

    const files = (e.target as HTMLInputElement).files;
    if (!files) return debug('no file in input element');

    const file = files[0];
    if (!file) return debug('no file in filelist');

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      console.log(json);

      this.grid.load(json);
    } catch (err) {
      debug(err);
    }
  }

  newFile () {
    this.reset();
    debug('in new_file');
    const confirmed = window.confirm('Make sure you saved.');
    if (confirmed) {
      this.grid.reset();
    }
  }
  
  openFile () {
    this.reset();
    debug('in open_file');
    this.fileInputEl.click();
  }
  
  saveAs () {
    this.reset();
    debug('in save_as');
    const text = JSON.stringify(this.grid.toJSON());
    const blob = new Blob([text]);
    const objectURL = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectURL;
    a.type = "json";
    a.target = "_blank";
    a.click();
  }

  noop () {
    return true;
  }
}