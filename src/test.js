import { createStore } from './'

describe('create a store', () => {
  it('is truthy', () => {
    const reducers = {
      app: (state = {}, action) => {
        return {
          appName: 'redux-magic-reducer'
        };
      }
    };

    let store = createStore(reducers);
    expect(store.getState().app.appName).toBe('redux-magic-reducer');
  });
});

describe('create a store & add dynamic reducer', () => {
  it('is truthy', () => {
    const reducers = {
      app: () => {
        return {
          appName: 'redux-magic-reducer'
        };
      }
    };

    const dynamicReducer = (state = { dynamicKey: "I am dynamic" }, action) => {
      switch(action.type) {
        default:
          return state;
      }
    };

    let store = createStore(reducers);
    expect(store.getState().app.appName).toBe('redux-magic-reducer');
    store.attachReducer('abc', dynamicReducer);
    expect(store.getState().abc.dynamicKey).toBe('I am dynamic');
  });
});

describe('create a store & add dynamic reducer at sub key', () => {
  it('is truthy', () => {
    const reducers = {
      app: () => {
        return {
          appName: 'redux-magic-reducer'
        };
      }
    };

    const dynamicReducer = (state = { dynamicKey: "I am dynamic" }, action) => {
      switch(action.type) {
        default:
          return state;
      }
    };

    let store = createStore(reducers);
    expect(store.getState().app.appName).toBe('redux-magic-reducer');
    store.attachReducer('abc', dynamicReducer);
    expect(store.getState().abc.dynamicKey).toBe('I am dynamic');
    store.attachReducer('abc.xyz', dynamicReducer);
    expect(store.getState().abc.xyz.dynamicKey).toBe('I am dynamic');
    //This should not get removed
    expect(store.getState().abc.dynamicKey).toBe('I am dynamic');
  });
});
