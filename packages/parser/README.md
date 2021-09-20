# Parser

A basic browser friendly .slp file parser.

Current fields up to `3.9.0.0` are supported. The .slp file specification can be found [here](https://github.com/project-slippi/slippi-wiki/blob/master/SPEC.md).

If a field is not present, likely because the format was expanded after the replay was created, it is left `undefined` instead of throwing an error. This is intentionally not reflected in the types to make it more convenient to work with, but will be occasionally inaccurate. If these missing data cases are important to you, consider checking the Game.formatVersion string for the replay or wrapping the parser types in [Partial\<T>](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype) or [DeepPartial\<T>](https://github.com/krzkaczor/ts-essentials#deep-wrapper-types).

## Install

### Yarn

```
yarn add @slippilab/parser
```

### Npm

```
npm install @slippilab/parser
```

### Url import from a CDN

```
import { Game } from 'https://cdn.skypack.dev/@slippilab/parser';
```

## Example

```
<html>
  <script type="module">
    import { Game } from 'https://cdn.skypack.dev/@slippilab/parser';
    const input = document.querySelector('#replayInput');
    input.onchange = async () =>
      console.log(new Game(await input.files[0].arrayBuffer()));
  </script>
  <input id="replayInput" type="file"/>
</html>
```

## Future work ideas

1. Finish exposing various fields from the file. Many less important fields are still left as TODOs.
1. Re-organize the data structures to be more convenient. Right now it more or less follows the spec format.
1. Offer enums/helpers for working with the IDs.
