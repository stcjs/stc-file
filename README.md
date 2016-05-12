# stc-file

Virtual File for stc

## How to use

```js
import File from 'stc-file';

let file = new File({
  cwd: '', //current work path
  base: '', //base name
  path: 'path/to/file', //file path
  stat: null //file stat
});
```

## API

### extname

get or set file extname.

```js
file.extname; // .html
file.extname = '.txt'; //
```

### content

get or set file content.

```js
file.content; //buffer
file.content = new Buffer('xxx'); //set file content
```

### tokens

get or set file tokens.

```js
file.tokens; // file content tokens
file.tokens = []; //set file tokens
```

### stat

get or set file stat.

```js
let stat = file.stat;
file.stat = stat;
```

### isFile()

```js
let isFile = file.isFile();
```

### isDirectory()

```js
let isDirectory = file.isDirectory();
```

### pipe(stream, opt)

pipe file stream to another stream.

```js
file.pipe(stream, {
  end: true
});
```