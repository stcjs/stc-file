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

### path

get or set file path.

```js
file.path = 'xxx';
file.path; 
```

### extname

get or set file extname.

```js
file.extname; // html
file.extname = 'txt'; //
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

### isPath(filepath)

check file path

### getContent(encoding)

get file content,

* `encoding` default is `null`

### setContent(content)


### hasAst()

check file aleady have ast

### getAst()

### setAst(ast)

### prop(name, value)

get or set other property for file


