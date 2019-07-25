# Change Log

## 8.0.0

### Potentially breaking changes

- Switched from lodash to deepmerge to keep bundle size small and avoid lodash security issues. This is intended to have no impact. However we cannot guarantee merging old state from localstorage with new state will function 100% the same.

### Features

- Angular Universal support [#127](https://github.com/btroncone/ngrx-store-localstorage/pull/127)
- Slightly reduced bundle size by avoiding lodash.merge

## 5.0.0 (2018-02-17)

### Bug Fixes

- Support rehydration for feature modules

### Features

- Upgrade @ngrx/store peer dependency to v5
