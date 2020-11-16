import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BurgerIngredient from '../../components/Burger/BurgerIngredient/BurgerIngredient';

class BurgerBuilder extends Component {
  render() {
    return (
      <Aux>
        <Burger />
        <div>Build Controls</div>
      </Aux>
    );
  }
}

export default BurgerBuilder;