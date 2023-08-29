declare module '*.vue' {
  import { defineComponent } from '@vue/runtime-core';

  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}
