import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
    },
    totalPrice: 4,
    purchasable: false
  }

  updatePurchaseState(ingredients) {
    /* ============================================
    | We want to sum up all the values in the ingredients object,
    | so that we can control if the burger is able to be purchased,
    | or not.
    | Below converts the object into an array, so that we can use
    | the map and reduce functions on our ingredients list. 
    | This function will give us the combined amount of ingredients
    | (sum) at the end, to see if the burger has had ingredients 
    | added so it is able to be purchased (enabling the order button).
    | =============================================
    */

    /* ============================================
    | + We need the amounts of the ingredients not the names
    | 1. const sum = Object.keys(ingredients) makes an array of 
    | the ingredients.
    | 2. the map method receives the key, we return the property name,
    | then we get the value of the given key.
    | =============================================
    */
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      /* ============================================
      | We use reduce to get the sum of all the ingredients.
      | REMEMBER - this is not for the price but to see if the
      | burger has had ingredients added so it is able to be purchased.
      |
      | We have set the starting number of 0 at the end of the reduce method.
      | We then have a function that executes on each element(which isigKey) 
      | in the array. We get the new sum and the individual element, and then
      | return the current sum plus the element.
      | =============================================
      */
      .reduce((sum, element) => {
        return sum + element;
      }, 0);
    /* ============================================
    | If sum is greater than 0, purchasable will be either True or False.
    | =============================================
    */
    this.setState({ purchasable: sum > 0 });
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    };
    return (
      <Aux>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo}
          purchasable={this.state.purchasable}
          price={this.state.totalPrice}
        />
      </Aux>
    );
  }
}

export default BurgerBuilder;