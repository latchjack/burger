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
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street Name'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      postCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Postal Code'
        },
        value: '',
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your Email'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
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
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
      /*
      |======================================================
      | We just want to grab the key (name, street, email, country) 
      | and the value from our form's state so we can submit it.
      | We create key, value pairs where we add a new property to
      | formData and we set the value of that property to the value
      | the user entered.
      |======================================================
      */
    }

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
      price: this.props.price,
      orderData: formData
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
  
  checkValidity (value, rules) {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }
    /*
    |======================================================
    | By chaining the '&& isValid' condition to the end of 
    | each rule, it is checking to make sure that all the 
    | rules pass. Otherwise, without it, even if all the prior
    | checks fail but the last If check passes it would let
    | the whole validity check pass.
    |======================================================
    */
    return isValid;
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
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
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
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map(formElement => (
          <Input 
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => this.inputChangedHandler(event, formElement.id)}
          />
        ))}
        <Button btnType="Success">ORDER</Button>
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