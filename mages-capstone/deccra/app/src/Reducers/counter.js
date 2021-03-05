import React from 'react';
import ReactDOM from 'react-dom';

const counterReducer = function (state = 0, action) {
    switch (action.type) {
      case "INCREMENT":
        return state + 1;
      case "DECREMENT":
        return state - 1;
      default:
        return state;
    }
  }

export default counterReducer