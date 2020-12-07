import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {

  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  }

  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  }

  render() {
    let summary = <Redirect to="/" />
    if (this.props.ings) {
      summary = (
        <div>
          <CheckoutSummary 
            ingredients={this.props.ings}
            checkoutCancelled={this.checkoutCancelledHandler}
            checkoutContinued={this.checkoutContinuedHandler}
          />
          <Route 
            path={this.props.match.path + '/contact-data'} 
            component={ContactData} 
          />
        </div>
      )
    }
    return summary;
  }
}

const maptStateToProps = state => {
  return {
    // must be named state.ingredients as ingredients
    // is what we have store in our Reducer's state
    ings: state.ingredients
  }
}

export default connect(maptStateToProps)(Checkout);

/*
|========================================
| we don't need to dispatch anything from here so we haven't used
| mapDispatchToProps. So when we use connect we can ommit passing
| it to the connect method 'connect(maptStateToProps)(ComponentName)'
| However, if we needed to use dispatch but not maptStateToProps we 
| would have to pass null as the first argument to connect...
| 'connect(null, mapDispatchToProps)(ComponentName)'
| maptStateToProps must always be the first argument and 
| mapDispatchToProps must always be the second.
|========================================
*/