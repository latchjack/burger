import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../../axios-orders';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import classes from './ContactData.module.css';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

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
        value: 'regular',
        validation: {},
        valid: true
      }
    },
    formIsValid: false
  }

/*
|======================================================
| React doesn't have built in validation so we have to 
| build our own. The way we have done it in this comp is
| to add the state of validation to state and set it's
| required field to 'true'.
| validation: {
|   required: true
| }
| To check it we create a new method called checkValidity,
| where we get the value and the rules as arguments, it 
| will return True or False to determine if it is valid
| or not. We add the Valid property to state and set it
| to False (we also could have added this as another field
| in the validation state).
| If rules has a required rule then we want to adjust the
| isValid variable. isValid is initially set to False.
| We want to set isValid equal to true or false (trim removes
| the white space) if the value of its input box is not
| equal to the empty string ''(no space between). If it is
| not equal to '' isValid will be True. We then return 
| isValid (be it True or False).
|======================================================
*/  

  orderHandler = (event) => {
    event.preventDefault();

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
      ingredients: this.props.ings,
      price: this.props.price,
      orderData: formData
    }
    this.props.onOrderBurger(order);
  }
  
  checkValidity (value, rules) {
    let isValid = true;
    if (!rules) {
      return true;
    }
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

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }

    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid })
  }
  /*
  |=======================================================
  | We set formIsValid in state so that we can check all inputs are valid.
  | We have a variable called formIsValid and initially set it to true,
  | we then will loop through the form, treating each input box as the
  | inputIdentifier. So for each input box we check to see if it valid
  | 'updatedOrderForm[inputIdentifier].valid' using the valid property, to
  | stop the last value from setting the state to true if the previous checked
  | boxes were false we add the '&& formIsValid' check to make sure that the
  | previous have also passed.
  | This was formIsValid is only updated to true if both fields are true.
  | We then set the state of formIsValid to the variable of formIsValid.
  | We use this to enable the ORDER button to work. Using the disabled
  | attribute, if the formIsValid returns false the disabled attribute
  | will apply the disabled state to the button using props.
  | disabled={props.disabled} (this is because we're using our created
  | button -  <Button/> - and not the typical html button).
  |
  | Note - Undefined is always treated as False but it can never be change
  | to True.
  |=======================================================
  */

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
            valueType={formElement.config.elementConfig.placeholder}
            changed={(event) => this.inputChangedHandler(event, formElement.id)}
          />
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
      </form>
    );
    if (this.props.loading) {
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

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    price: state.totalPrice,
    loading: state.loading
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData) => dispatch(actions.purchaseBurger(orderData))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));