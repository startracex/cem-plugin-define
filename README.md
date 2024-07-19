# cem-plugin-define

Add a `custom-element-definition` export through jsdoc.

custom-elements-manifest.config.js
```js
import _ from "cem-plugin-define";

export default {
  plugins: [
    _("define")
  ]
};
```