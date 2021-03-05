import $ from 'jquery';

const userDetailsReducer = function (state = {signed_in: false, checked: false}, action) {
    switch (action.type) {
      case "SAVEUSER":
          $.extend(action.payload, {signed_in: true})
        return action.payload;
        case "SAVEGUEST":
            return {signed_in: false, checked: true}
      default:
        return state;
    }
  }

export default userDetailsReducer