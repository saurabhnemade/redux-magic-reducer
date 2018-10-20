import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
import { diff } from 'deep-object-diff';

export default class App extends Component {
  static propTypes = {
    store: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
       reducerKey: "",
       storeHistory: []
    };
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      storeHistory: [
        ...this.state.storeHistory,
        {...this.props.store.getState()}
      ]
    });
  }

  onAddRandomReducerButtonClick() {
    const randomKey = Math.random().toString(36).substring(8) + "." + Math.random().toString(36).substring(8);
    const randomReducer = (state = { subReducer: randomKey }, action) => {
      switch(action.type) {
        default:
          return state;
      }
    };
    this.props.store.attachReducer(randomKey, randomReducer);
    this.setState({
      ...this.state,
      storeHistory: [
        ...this.state.storeHistory,
        {...this.props.store.getState()}
      ]
    }, () => {
        this.refs.stateRef.scrollTop = this.refs.stateRef.scrollHeight;
    });
  }

  onAddReducerAtSepecificKey(key) {
    const specificReducer = (state = { specificReducer: key, otherProp: "a value"}, action) => {
      switch(action.type) {
        default:
          return state;
      }
    }
    this.props.store.attachReducer(key, specificReducer);
    this.setState({
      ...this.state,
      reducerKey: "",
      storeHistory: [
        ...this.state.storeHistory,
        {...this.props.store.getState()}
      ]
    }, () => {
        this.refs.stateRef.scrollTop = this.refs.stateRef.scrollHeight;
    });
  }

  getDiff(obj1, array, index) {
     let state = {};
     if (index !== -1) {
        state = {...array[index]};
     }
     return diff(state, {...obj1});
  }

  onStateKeyChange(event) {
    this.setState({
      ...this.state,
      reducerKey: event.target.value
    })
  }

  render () {
    return (
      <div>
        <div className="menu">
          <button onClick={this.onAddRandomReducerButtonClick.bind(this)}>Add Random Reducer</button>
          <input placeholder="Specific Json Path" value={this.state.reducerKey} onChange={this.onStateKeyChange.bind(this)}/>
          <button disabled={this.state.reducerKey === ""} onClick={this.onAddReducerAtSepecificKey.bind(this, this.state.reducerKey)}>Add Reducer At Key</button>
        </div>

        <div className="state-wrapper">
          <div className="header">
              <div className="header-cell">State</div>
              <div className="header-cell">Difference</div>
          </div>
          <div className="wrap-width" ref="stateRef">
            {this.state.storeHistory.map((store, key, array) => {
              return (
                <div className="state" key={key}>
                  <div className="state-container">
                    <JSONPretty id={`json-pretty-${key}`} json={store}></JSONPretty>
                  </div>
                  <div className="diff">
                    <JSONPretty id={`json-pretty-${key}`} json={this.getDiff(store, array, key-1)}></JSONPretty>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
          <div className="desc-container">
            <div className="desc-item">
              <div className="desc-item-prev"/>
              <div>Previous State before change</div>
            </div>
            <div className="desc-item">
              <div className="desc-item-diff"/>
              <div>Difference between state after change</div>
            </div>
            <div className="desc-item">
              <div className="desc-item-current"/>
              <div>Current State</div>
            </div>
            <div className="desc-item">
              <div className="desc-item-current-diff"/>
              <div>Different between current state and previous state</div>
            </div>
          </div>
      </div>
    )
  }
}
