import React, { Component } from 'react';
import axios from '../../../axios-orders';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import classes from './ContactData.module.css';

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: ''
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street Name'
        },
        value: ''
      },
      postCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Postal Code'
        },
        value: ''
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: ''
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your Email'
        },
        value: ''
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fastest', displayValue: 'Fastest' },
            { value: 'regular', displayValue: 'Regular' }
          ]
        },
        value: ''
      }
    },
    loading: false
  }

  orderHandler = (event) => {
    event.preventDefault();
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
      ingredients: this.props.ingredients,
      price: this.props.price
    }
    axios.post('/orders.json', order)
      // .then(response => console.log(response))
      // .catch(err => console.log(err));
      .then(response => {
        this.setState({ loading: false });
        this.props.history.push('/');
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  }

  inputChangedHandler = (event, inputIdentifier) => {
    /*
    |=======================================================
    | We want to store our inputted values into state. To do
    | so we capture each event in the 'changed' attribute in
    | the mapped Input tag within the render function. Along 
    | with the event itself we also want to pass on the 
    | identifier (formElement.id). The element id is the key
    | from our state object (name, street, email). 
    | We don't want to mutate the state so we create a copy.
    | We have to create a deep clone in this case, as in our
    | state, we have nested objects within objects. Not using
    | our method to deep clone would have us cloning the 
    | object but losing the nested objects (the data and keys 
    | inside of the elementConfig object). Instead we would 
    | just be copying a pointer to the storage location of
    | that data, which would cause us to mutate the original
    | state when we use setState.
    | So we clone the state of orderForm into updatedOrderForm
    | and then we clone updatedOrderForm and its data (type &
    | placeholder - by accessing it with [inputIdentifier]) 
    | into the updatedFormElement.
    | We then get the updatedFormElement's value and set it to
    | the event target value. Then we access the input 
    | identifier and set it equel to the updatedFormElement.
    | Lastly we set the state of orderForm to updatedOrderForm.
    |=======================================================
    */
    const updatedOrderForm = {
      ...this.state.orderForm
    };
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    };
    updatedFormElement.value = event.target.value;
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    this.setState({ orderForm: updatedOrderForm })
  }

  render() {
    const formElementsArray = []
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }
    let form = (
      <form>
        {formElementsArray.map(formElement => (
          <Input 
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            changed={(event) => this.inputChangedHandler(event, formElement.id)}
          />
        ))}
        <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />
    }
    return(
      <div className={classes.ContactData}>
        <h4>Enter your contact data</h4>
        {form}
      </div>
    );
  }
};

/*
|=======================================================
| For the form we want to create all of the Inputs components dynamically. 
| The orderForm in state is an object, so we want to transform it into 
| an array so we can loop through it (our formElementsArray array).
| The array will contain JS objects, where the key is the identifier property
| (name, street, postCode) whilst still maintaining the other keys 
| (elementConfig & value).
| We use the For loop to do this whilst pushing the elements into the array 
| , then mapping over the array to produce the Input component tags.
|=======================================================
*/

export default ContactData;