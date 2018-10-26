## redux-magic-reducer

[![NPM](https://img.shields.io/npm/v/redux-magic-reducer.svg)](https://www.npmjs.com/package/redux-magic-reducer) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.org/saurabhnemade/redux-magic-reducer.svg?branch=master)](https://travis-ci.org/saurabhnemade/redux-magic-reducer) [![Greenkeeper badge](https://badges.greenkeeper.io/saurabhnemade/redux-magic-reducer.svg)](https://greenkeeper.io/)

This library aims at solving the problem dynamic reducer problem (please read: https://stackoverflow.com/questions/32968016/how-to-dynamically-load-reducers-for-code-splitting-in-a-redux-application). This implementation is based on answer provided by @[gaearon](https://github.com/gaearon) .

### Why?
To make redux applications simpler by allowing dynamic state creation, specifically in cases where code splitting is done.

### Install
```bash
npm install --save redux-magic-reducer
```

### How to use
#### 1. Create a Store
```jsx
    import { createStore } from 'redux-magic-reducer';
    const globalReducer = {
          app: () => {
            return {
              appName: 'redux-magic-reducer'
            };
          }
    };
    let store = createStore(reducers);
```

#### 2. Attach a dynamic Reducer
```jsx
    const dynamicReducer = (state = { subReducerKey: "subReducerValue" }, action) {
    	switch(action.type) {
    	default:
    		return state;
    	}
    };

    store.attachReducer('this.is.your.dynamic.path', dynamicReducer);
```

## License
MIT © [saurabhnemade](https://github.com/saurabhnemade)
