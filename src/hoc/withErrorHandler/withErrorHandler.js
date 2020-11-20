import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

/*
|==========================================================
| We create this HOC to be used as a global error handler that 
| will wrap around any component in our applications.
|
| This is an Anonymous Class Component
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

    componentDidMount() {
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