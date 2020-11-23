import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

/*
|==========================================================
| We create this HOC to be used as a global error handler that 
| will wrap around any component in our applications.
|
| This is an Anonymous Class Component. This is set up this way
| because we never use the class. We just return the component.
| This is a "Class Factory".
|
| We're using this to create an error modal that will pop up when
| an error occurs. It is wrapped around the BurgerBuilder export
| to handle any errors that may occur with requests that pass
| through that application.
| To get the request information we pass the second argument
| into the withErrorHandler function which is exported to the.
|==========================================================
 */

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null
    }

    UNSAFE_componentWillMount() {
      /*
      |==========================================================
      | The first interceptor listen for the request, so it can clear any
      | errors, so when the request is sent we make sure we are getting new
      | information, and not rendering the old error.
      | The second interceptor first returns the response (res => res), then
      | it sets the error we get from Firebase/Server, to the error in state. 
      | This will allow us to render the message.
      |==========================================================
      */
      axios.interceptors.request.use(req => {
        this.setState({ error: null });
        return req;
      });
      axios.interceptors.response.use(res => res, error => {
        this.setState({ error: error });
      })
    }

    errorConfirmedHandler = () => {
      this.setState({ error: null });
    }

    render() {
      /*
      |==========================================================
      | The modal will only show if this.state.error is not null.
      | It will then render the error message as the json object 
      | returned from Firebase.
      | The modalClosed sets the state to null again to help us 
      | remove the modal from the UI once clicked.
      |========================================================== 
      */
      return(
        <Aux>
          <Modal 
            show={this.state.error} 
            modalClosed={this.errorConfirmedHandler}
          >
            {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </Aux>
      );
    };
  }
}

export default withErrorHandler;