# nuxt-query-sync

## Overview

This module is a utility designed for Nuxt applications that seamlessly synchronizes Nuxt `Ref` or `Reactive` objects with URL query parameters. This ensures that the state of your application can be persisted and retrieved via the URL, enhancing the user experience by allowing state to be shared or restored through URLs.

## Features

- **Automatic Synchronization**: Keeps `Ref` or `Reactive` objects in sync with URL query parameters.
- **Initial Load Support**: Initializes objects with values from query parameters if they exist on initial load.
- **Flexible Usage**: Supports both `Ref` and `Reactive` objects with minimal configuration.

## Installation

To use this module in your Nuxt application, follow these steps:

1. **Install the package** (assuming it's published on npm, adjust the command if necessary):

    ```bash
    # Using npm
    $ npm add -D nuxt-query-sync

    # Using pnpm
    $ pnpm add -D nuxt-query-sync

    # Using yarn
    $ yarn add -D nuxt-query-sync

    # Using bun
    $ bun add -D nuxt-query-sync
    ```

2. **Add the module to your Nuxt configuration**:

    ```javascript
    // nuxt-config.ts
    export default defineNuxtConfig({
      modules: ['nuxt-query-sync'],
    })
    ```

## Usage

### With `Ref`

To persist a `Ref` in the URL query parameters, use the `usePersistence` function. You need to provide a `key` which will be used as the query parameter key.

```javascript
import usePersistence from 'nuxt-query-sync';

const count = ref(0);
usePersistence(count, 'count');
```

In this example, the `count` `Ref` will be synchronized with the `count` query parameter. Any changes to `count` will update the URL, and any changes to the URL will update `count`.

### With `Reactive`

To persist a `Reactive` object, simply pass it to `usePersistence` without a `key`. The keys of the `Reactive` object will be used as query parameter keys.

```typescript
import usePersistence from 'nuxt-query-sync';

const state = reactive({ name: 'John', age: 30 });
usePersistence(state);
```

Here, the `state` object will be synchronized with corresponding query parameters (e.g., `name` and `age`).

## API

### `usePersistence<T>(item: T, key?: string): T`

- **Parameters**:
  - `item`: The Nuxt `Ref` or `Reactive` object to be persisted. If a `Ref`, `key` must be provided.
  - `key` (optional): The query parameter key for `Ref` items. Not applicable for `Reactive` items.

- **Returns**: The original `Ref` or `Reactive` object with persistence logic applied.

- **Throws**: An error if an unsupported type is provided or if a `Ref` is used without a `key`.

## Example

```typescript
import usePersistence from 'nuxt-query-sync';

// Example with Ref
const count = ref(0);
usePersistence(count, 'count');

// Example with Reactive
const state = reactive({ name: 'John', age: 30 });
usePersistence(state);
```

## License

This module is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributing

Contributions are welcome! Please submit issues or pull requests via GitHub.

## Support

For questions or support, please open an issue on GitHub
