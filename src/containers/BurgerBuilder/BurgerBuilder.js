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
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount() {
    // axios.get('https://burgerbuilder-7f999.firebaseio.com/ingredients.json')
    //   .then(response => {
    //     this.setState({ ingredients: response.data });
    //   })
    //   .catch(error => {
    //     this.setState({ error: true })
    //   });
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
    const queryParams = [];
    for (let i in this.state.ingredients) {
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    }
    queryParams.push('price=' + this.state.totalPrice);
    const queryString = queryParams.join('&')
    this.props.history.push({
      pathname: '/checkout',
      search: '?' + queryString 
    });
    /*
    |================================================
    | This^ will now move us to the checkout page 
    | when Continue is clicked in the purchase modal.
    | To pass the ingredients on to the rendered burger
    | on the Checkout page, we push a JS object to /checkout.
    | In the search parameter we use the queryParams array.
    | We want to add elements to the array, for this we'll
    | use a For loop. We loop through all the properties in
    | this.state.ingredients. Then we use encodeURIComponent
    | method to encode them so that we can use them in the URL.
    | The property name 'i' - encodeURIComponent(i) - then we 
    | add the equals sign because in queryParams we have 
    | "key=..." (with key being 'i') then the next value 
    | encoded with encodeURIComponent again (which is a number
    | - the quantity of the particular ingredient) on
    | this.state.ingredients[i] for the key that we are at.
    | This basically will put `${property}`=`${amount}` into
    | the URL.
    | To place it correctly into the URL we need to parse the
    | URL into the correct format so we use the join method on
    | queryParams and store it in the queryString const. We
    | then give it to the search parameter in the history.push
    | method.
    | Selecting...
    | 2x bacon, 1x cheese, 1x meat, 1x salad
    |
    | RESULT:
    | http://localhost:3000/checkout?bacon=2&cheese=1&meat=1&salad=1
    |================================================
    */ 
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
    | The orderSummary is set to null initially, as when the
    | app renders, the data from the server will not have
    | been received yet.
    |======================================================
    */
    let orderSummary = null; 

    /*
    |======================================================
    | The burger variable is assigned a ternary statement where
    | it first checks to see if error's state is set to true.
    | spinner as the axios
    | request is asynchronous and the data will not be ready
    | at the time of the get request. This will allow us to
    | dynamically render the app displaying the loading spinner
    | if the ingredients have not been fetched yet and then
    | when they have been received to render those instead.
    |
    | The order summary will also be set here so that it will
    | render only once the ingredients data has been fetched.
    | It will display the spinner if loading's state is
    | returned as true when it is checked in the if statement.
    |======================================================
    */
    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

    if(this.state.ingredients) {
      burger = (
        <Aux>
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
      orderSummary = (
        <OrderSummary 
          ingredients={this.state.ingredients}
          price={this.state.totalPrice}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
        />
      );
    }
    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    // {salad: true, meat: false, ...}
    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

/*
|==========================================================
| For the withErrorHandler HOC to receive the information of
| whether or not it's error modal should be rendered it needs
| the information regarding if the request has failed. To do
| this we also export axios from this component along with the
| BurgerBuilder component. This will pass the error to the 
| withErrorHandler component, which is listening for requests
| in second argument of the wEH component, which then passes it
| to the componentDidMount func which ready with it's 
| interceptors. Once an error has been issued, it will respond.
|==========================================================
 */

export default withErrorHandler(BurgerBuilder, axios);