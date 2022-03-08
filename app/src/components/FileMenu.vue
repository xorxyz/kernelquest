<template>
  <div class="mr1">
    <select @change="onSelect">
      <option value="file">-- File --</option>
      <option value="new_file">New File</option>
      <option value="open_file">Open File</option>
      <option value="save_as">Save As...</option>
    </select>
    <input
      ref="input"
      type="file"
      class="dn"
      accept=".json"
      @change="onFileOpen">
  </div>
</template>

<script lang="ts">
import { Engine } from 'xor4-game/engine';
import { debug } from 'xor4-lib/logging';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    engine: {
      type: Engine,
      required: true,
    },
  },
  data() {
    return {
      selectedIndex: 0,
    };
  },
  methods: {
    reset() {
      this.$data.selectedIndex = 0;
    },
    onSelect(e) {
      const options = {
        file: () => {},
        new_file: this.newFile.bind(this),
        open_file: this.openFile.bind(this),
        save_as: this.saveAs.bind(this),
      };

      const selected = (e.target as HTMLSelectElement).selectedOptions[0];
      const method = options[selected.value];

      if (!method || !Object.values(options).includes(method)) {
        console.error(`'${selected.value}': option does not exist.`);
        return;
      }

      method();
    },
    async onFileOpen(e) {
      debug((e.target as HTMLInputElement).files);

      const { files } = e.target as HTMLInputElement;
      if (!files) {
        debug('no file in input element');
        return;
      }

      const file = files[0];
      if (!file) {
        debug('no file in filelist');
        return;
      }

      try {
        const text = await file.text();
        const json = JSON.parse(text);

        debug(json);

        this.$emit('grid:load', json);
      } catch (err) {
        debug(err);
      }
    },
    newFile() {
      this.reset();
      debug('in new_file');
      // eslint-disable-next-line no-alert
      const confirmed = window.confirm('Make sure you saved.');
      if (confirmed) {
        this.$emit('grid:reset');
      }
    },
    openFile() {
      this.reset();
      debug('in open_file');
      (this.$refs.input as HTMLInputElement).click();
    },
    saveAs() {
      this.reset();
      debug('in save_as');
      const text = JSON.stringify(this.$props.engine.world.rooms[0].toJSON());
      const blob = new Blob([text], {
        type: 'application/json',
      });
      const objectURL = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectURL;
      a.download = 'level.json';
      a.type = 'json';
      a.target = '_blank';
      a.click();
    },
  },
});

</script>
