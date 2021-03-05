const redirectReducer = function (state = "http://localhost:3000/", action) {
    switch (action.type) {
        case "RESTART":
            return state;
        case "SIGNIN":
            return window.location.href;
        case "REGISTER":
            return window.location.href;
      default:
            return state;
    }
  }

export default redirectReducer