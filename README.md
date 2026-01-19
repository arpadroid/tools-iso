<link rel="stylesheet" href="docs-styles.css">

# README - **_`@arpadroid/tools-iso`_**

![version](https://img.shields.io/badge/version-1.0.0-lightblue)
![node version](https://img.shields.io/badge/node-%3E%3D16.0.0-lightyellow)
![npm version](https://img.shields.io/badge/npm-%3E%3D8.0.0-pink)

>**_Links:_** 📖 [API](API.md) | 📝[Changelog](docs/CHANGELOG.md) | 🤝 [Contributing](#contributing)

> Isomorphic utility functions shared across Arpadroid packages. Designed to run in both browser and Node environments.

## ✨ Features

🧰 **Shared Utilities** - Small, focused helpers used across the ecosystem.  
🌐 **Isomorphic** - Works in Node and the browser.  
🧪 **Tested** - Includes unit tests and CI-friendly scripts.

<div id="installation"></div>

## 📦 Installation

```bash
npm install @arpadroid/tools-iso
```

## 🚀 Quick Start

```js
import { mergeObjects, countProps } from '@arpadroid/tools-iso';

const merged = mergeObjects({ a: 1 }, { b: 2 });
const size = countProps(merged);
```

## 📚 API

Exported helpers include:

- `mergeObjects`
- `countProps`

See the source in `src/` for full details.

## 🧑‍💻 Development

- Build and test scripts are available in `package.json`.

<div id="contributing"></div>

## 🤝 Contributing

1. **Open an issue** describing your proposal
2. Wait for maintainer feedback before coding
3. PRs without prior discussion may be closed

## 📄 License

MIT License - see LICENSE file for details.
