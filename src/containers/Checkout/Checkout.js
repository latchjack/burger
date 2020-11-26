import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
  state = {
    ingredients: {
      salad: 1,
      meat: 1,
      cheese: 1,
      bacon: 1
    }
  }

  componentDidMount() {
    /*
    |===========================================
    | This will extract the ingredients from our URL so that
    | we can render the burger again in this component.
    |===========================================
    */
    const query = new URLSearchParams(this.props.location.search);
    const ingredients = {};
    for (let param of query.entries()) {
      // ['salad', '1] - this is the format that each entry will have
      ingredients[param[0]] = +param[1];
    }
    this.setState({ ingredients: ingredients })
    // set state of the ingredients to the ingredients we extracted here.
  }

  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  }

  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  }

  render() {
    return(
      <div>
        <CheckoutSummary 
          ingredients={this.state.ingredients}
          checkoutCancelled={this.checkoutCancelledHandler}
          checkoutContinued={this.checkoutContinuedHandler}
        />
        <Route 
          path={this.props.match.path + '/contact-data'} 
          render={() => (<ContactData ingredients={this.state.ingredients} />)} />
      </div>
    );
  }
}

export default Checkout;