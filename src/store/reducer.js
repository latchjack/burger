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

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
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
        },
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
      };
    case actionTypes.REMOVE_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]: state.ingredients[action.ingredientName] - 1
        },
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
      };
    default:
      return state;
  }
}

export default reducer;

/*
| To update the price we could either add more actions for it in our actions
| file (INCREASE_PRICE & DECREASE_PRICE) or the route we choose here, where
| we update it alongside our ingredient in the same actions.
*/