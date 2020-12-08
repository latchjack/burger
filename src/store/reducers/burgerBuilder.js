import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: false,
  building: false
};

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

const addIngredient = (state, action) => {
  const updatedIngredient = {[action.ingredientName]: state.ingredients[action.ingredientName] + 1}
  const updatedIngredients = updateObject(state.ingredients, updatedIngredient);
  const updatedState = {
    ingredients: updatedIngredients,
    totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
    building: true
  }
  return updateObject(state, updatedState);
}

const removeIngredient = (state, action) => {
  const updatedIng = {[action.ingredientName]: state.ingredients[action.ingredientName] - 1}
  const updatedIngs = updateObject(state.ingredients, updatedIng);
  const updatedSt = {
    ingredients: updatedIngs,
    totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
    building: true
  }
  return updateObject(state, updatedSt);
}

const setIngredients = (state, action) => {
  return updateObject(state, {
    ...state,
    ingredients: {
      salad: action.ingredients.salad,
      bacon: action.ingredients.bacon,
      cheese: action.ingredients.cheese,
      meat: action.ingredients.meat
    },
    totalPrice: 4,
    error: false,
    building: false
  });
}

const fetchIngredientsFailed = (state, action) => {
  return updateObject(state, { error: true });
}

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
    case actionTypes.ADD_INGREDIENT: return addIngredient(state, action);
    case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action);
    case actionTypes.SET_INGREDIENTS: return setIngredients(state, action);
    case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredientsFailed(state, action);
    default: return state;
  }
}

export default reducer;

/*
| To update the price we could either add more actions for it in our actions
| file (INCREASE_PRICE & DECREASE_PRICE) or the route we choose here, where
| we update it alongside our ingredient in the same actions.
*/