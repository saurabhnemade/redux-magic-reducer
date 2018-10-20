import React, { Component } from 'react';
import { createStore as _createStore, combineReducers } from 'redux';
import get from 'lodash/get';
import set from 'lodash/set';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';

let rootAsyncReducers = {};

/**
 * To create dynamic action creator
 */
const dynamicActionGenerator = () => {
    return '@@TEST-REDUCER-VALIDITY/' + Math.random().toString(36).substring(7).split('').join('\\');
};

/**
 * To check validity of a given reducer
 *
 * @param {function} reducer
 * @param {boolean} throwError
 */
const isValidReducer = (reducer, throwError = false) => {
    if (typeof reducer !== 'function') {
        if (throwError) {
            throw new Error('You did not passed a valid reducer. A reducer must be a function with two parameters state and action');
        } else {
            return false;
        }
    }

    const initialState = reducer(undefined, {type: dynamicActionGenerator()});
    if (typeof initialState === 'undefined') {
        if (throwError) {
            throw new Error('Reducer must return state!!!.');
        } else {
            return false;
        }
    }

    return true;
}

/**
 * Returns root reducer from passed reducer object / root reducer
 * @param {*} reducers
 */
const buildCombineReducers = (reducers) => {
   /** Check is reducers are of type json object and not already combineReducers */
   if (typeof reducers !== 'function') {
      reducers = combineReducers(reducers);
   }
   return reducers;
};

const copy = (source, deep) => {
   var o, prop, type;

  if (typeof source != 'object' || source === null) {
    // What do to with functions, throw an error?
    o = source;
    return o;
  }

  o = new source.constructor();

  for (prop in source) {

    if (source.hasOwnProperty(prop)) {
      type = typeof source[prop];

      if (deep && type == 'object' && source[prop] !== null) {
        o[prop] = copy(source[prop]);

      } else {
        o[prop] = source[prop];
      }
    }
  }
  return o;
}

/**
 * Wrapper for reducer at given path
 * @param {path} key
 * @param {function} reducer
 */
const pathMapReducer = (key, reducer) => {
    return (state, action) => {
        const newSubState = {...reducer(get(state, key), action)};
        if (typeof newSubState === 'undefined') {
            throw new Error(`The '${key}' reducer must not return undefined.`);
        }

        /** Make sure not to mutate the state here. Tried using Object.assign, but diff didn't computed anything which I suspect is a mutation  */
        let newState = copy(state, true);
        set(newState, key,  newSubState);
        return newState;
    };
};

const dynamicRootReducer = (rootReducer) => (state, action) => {
    let hasChanged = false;
    let nextState = Object.assign({}, state);
    let reducer;
    let previousStateForKey;
    let nextStateForKey;

    Object.keys(rootAsyncReducers).forEach((key) => {
        nextState = pathMapReducer(key, rootAsyncReducers[key])(state, action);
    });

    Object.keys(rootReducer).forEach(key => {
      reducer = rootReducer[key];
      previousStateForKey = state[key];
      nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    });

    return nextState;
}

/**
 * Creates enchanced version of store with asyncReducers properties
 * This is to keep track of initialReducers and dynamic reducers which will be pushed to asyncReducers
 * @param {*} reducer
 * @param {*} initialState
 * @param {*} enhancers
 */
const createStore = (initialReducer, initialState, enhancers) => {
    let correctedReducer = buildCombineReducers(initialReducer);
    let store = _createStore(dynamicRootReducer(initialReducer), initialState = {}, enhancers);
    store.asyncReducers = {};

    store.attachReducer = (storeKeyPath, dynamicReducer) => {
        if (isValidReducer(dynamicReducer)) {
            store.asyncReducers = { ...store.asyncReducers, [storeKeyPath]: dynamicReducer };
            rootAsyncReducers = {...rootAsyncReducers, [storeKeyPath]: dynamicReducer};
            store.replaceReducer(dynamicRootReducer(initialReducer));
        } else {
            throw new Error(`The reducer at "${storeKeyPath}" is not a valid reducer`);
        }
    };

    return store;
};

export { createStore }
