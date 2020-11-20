import React, { Component } from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';


const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends Component {
  // constructor(props) {
  //     super(props);
  //     this.state = {...}
  // }

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
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
    },
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false
  }

  updatePurchaseState (ingredients) {
    /* ============================================
    | + We need the amounts of the ingredients not the names
    | 1. const sum = Object.keys(ingredients) makes an array of 
    | the ingredients.
    | 2. the map method receives the key, we return the property name,
    | then we get the value of the given key.
    | =============================================
    */
    const sum = Object.keys( ingredients )
      .map( igKey => {
        return ingredients[igKey];
      } )
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
      .reduce( ( sum, el ) => {
        return sum + el;
      }, 0 );
    /* ============================================
    | If sum is greater than 0, purchasable will be either True or False.
    | =============================================
    */
    this.setState( { purchasable: sum > 0 } );
  }

  addIngredientHandler = ( type ) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = ( type ) => {
    const oldCount = this.state.ingredients[type];
    if ( oldCount <= 0 ) {
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
    this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
    this.updatePurchaseState(updatedIngredients);
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    // alert('You continue!');
    this.setState({ loading: true });
    /*
    |======================================================
    | Create an object called order to send the order data saved 
    | in state, along with the hard-coded information. We then
    | send the info to the server via the axios POST method, to
    | handle the customer's order.
    |======================================================
    */
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Dexter Jack',
        address: {
          street: '21 Code Street',
          postCode: 'e12 6ld',
          country: 'UK'
        },
        email: 'dexter@hackerman.com'
      },
      deliveryMethod: 'fastest'
    }
    axios.post('/orders.json', order)
      // .then(response => console.log(response))
      // .catch(err => console.log(err));
      .then(response => {
        this.setState({ loading: false, purchasing: false });
      })
      .catch(err => {
        this.setState({ loading: false, purchasing: false });
      });
  }

  render () {
    const disabledInfo = {
      ...this.state.ingredients
    };
    for ( let key in disabledInfo ) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    /*
    |======================================================
    | We assigned the OrderSummary component to a variable
    | below so that we can conditionally render it or the
    | loading spinner component.
    | If the state of 'this.state.loading' is equal to true,
    | it will display the spinner in the modal component  
    | instead, by re-assigning the orderSummary variable to
    | the Spinner component. Conditionally rendering one or
    | one or the other.
    |======================================================
    */
    let orderSummary = <OrderSummary 
      ingredients={this.state.ingredients}
      price={this.state.totalPrice}
      purchaseCancelled={this.purchaseCancelHandler}
      purchaseContinued={this.purchaseContinueHandler}
    />

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }
    // {salad: true, meat: false, ...}
    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo}
          purchasable={this.state.purchasable}
          ordered={this.purchaseHandler}
          price={this.state.totalPrice} 
        />
      </Aux>
    );
  }
}

/*
|==========================================================
| For the withErrorHandler HOC to receive the information of
| whether or not it's error modal should be rendered it needs
| the information regarding if the request has failed and an error has been. issued we need to pass the the 
|==========================================================
 */

export default withErrorHandler(BurgerBuilder, axios);