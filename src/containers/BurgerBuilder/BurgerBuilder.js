import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionTypes from '../../store/actions';

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
    return sum > 0;
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    this.props.history.push('/checkout');
    /*
    |================================================
    | No longer needed the queryParams are we are now managing
    | the state of the ingredients with Redux.
    |================================================
    */ 
  }

  render () {
    const disabledInfo = {
      ...this.props.ings
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

    if(this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            purchasable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHandler}
            price={this.props.price} 
          />
        </Aux>
      );
      orderSummary = (
        <OrderSummary 
          ingredients={this.props.ings}
          price={this.props.price}
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

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    price: state.totalPrice
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
    onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));

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