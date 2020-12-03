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
| We then use an es6 feature, to dynamically override the ingredient. The
| square brackets will get ingredientName as a payload from the dispatch.
| We target that particular ingredient with the sqaures brackets and use 
| it to set the new value of the ingredient with state.ingredients[action.ingredientName] + 1
|=====================================
*/

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]: state.ingredients[action.ingredientName] + 1
        }
      };
    case actionTypes.REMOVE_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]: state.ingredients[action.ingredientName] - 1
        }
      };
    default:
      return state;
  }
}

export default reducer;