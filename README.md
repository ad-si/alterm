# Alterm

Find alternatives to apps, websites and programs right in your terminal!


## Installation

```sh
npm install -g alterm
```

Requires Node.js 20 or later.


## Usage

List alternatives to a program:

```sh
alterm chrome
```

Show help:

```sh
alterm --help
```


## Template

The file-name is the name of the tool.

```yaml
description: A short sentence which describes the command line tool.
tags:
  - editor
  - gui

links:
  - https://editor.com

alternatives:
  - another-editor
  - yet-another-editor
```
