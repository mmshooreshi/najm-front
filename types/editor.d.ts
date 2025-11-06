// types/editor.d.ts
import type { EditorState } from '~/plugins/ui-editor.client'

declare module '#app' {
  interface NuxtApp {
    $editor: {
      state: EditorState
      [key: string]: any
    }
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $editor: NuxtApp['$editor']
  }
}
