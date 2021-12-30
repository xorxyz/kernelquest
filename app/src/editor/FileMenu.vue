<template>
  <div>
    <select @change="onSelect">
      <option value="file">-- File --</option>
      <option value="new_file">New File</option>
      <option value="open_file">Open File</option>
      <option value="save_as">Save As...</option>
    </select>
    <input ref="input" 
      type="file"
      class="dn"
      accept=".json"
      @change="onFileOpen" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { debug } from '../../../lib/logging';
import { Grid } from './grid';

export default defineComponent({
  props: {
    grid: {
      required: true,
      type: Grid 
    }
  },
  data () {
    return {
      selectedIndex: 0
    }
  },
  methods: {
    reset () {
      this.$data.selectedIndex = 0;
    },
    onSelect (e) {
      const options = {
        'file': () => {},
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
    },
    async onFileOpen (e) {
      debug((e.target as HTMLInputElement).files);

      const files = (e.target as HTMLInputElement).files;
      if (!files) return debug('no file in input element');

      const file = files[0];
      if (!file) return debug('no file in filelist');

      try {
        const text = await file.text();
        const json = JSON.parse(text);

        debug(json);

        this.$emit('grid:load', json);
      } catch (err) {
        debug(err);
      }
    },
    newFile () {
      this.reset();
      debug('in new_file');
      const confirmed = window.confirm('Make sure you saved.');
      if (confirmed) {
        this.$emit('grid:reset')
      }
    },    
    openFile () {
      this.reset();
      debug('in open_file');
      (this.$refs.input as HTMLInputElement).click();
    },    
    saveAs () {
      this.reset();
      debug('in save_as');
      const text = JSON.stringify(this.$props.grid.toJSON());
      const blob = new Blob([text], {
        type: 'application/json'
      });
      const objectURL = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectURL;
      a.download = 'level.json';
      a.type = "json";
      a.target = "_blank";
      a.click();
    }
  }
});

</script>
