import * as actionTypes from './actions';

const initialState = {
  ingredients: {
    salad: 0,
    bacon: 0,
    cheese: 0,
    meat: 0
  },
  totalPrice: 4
};

/*
|=====================================
| Below we're creating a deep clone of the ingredients object that is in 
| state. First we clone the ingredients - ...ingredients - and then we go
| a level down and clone again using ...state.ingredients.
| We then use an es6 feature, 
|=====================================
*/

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]
        }
      };
    case actionTypes.REMOVE_INGREDIENT:
      return {

      };
    default:
      return state;
  }
}

export default reducer;