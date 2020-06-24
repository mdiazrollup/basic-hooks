import React, {useReducer, useState, useEffect, useCallback, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from '../Ingredients/IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Error action type');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear} = useHttp();
//  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});
 // const [userIngredients, setUserIngredients] = useState([]);
 // const [isLoading, setIsLoading] = useState(false);
 // const [error, setError] = useState();

  // useEffect(() => {
  //   fetch('https://react-hooks-update-c4fc1.firebaseio.com/ingredients.json').then(
  //   response => response.json()
  //   ).then(responseData => {
  //     const loadedIngredients = [];
  //     for (const key in responseData) {
  //       loadedIngredients.push({
  //         id: key,
  //         title: responseData[key].title,
  //         amount: responseData[key].amount
  //       })
  //     }

  //    setUserIngredients(loadedIngredients);
  //   });
  // }, []); // as componentDidMount

  useEffect(() => {
    if(!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({type:'DELETE', id: reqExtra})
    } else if(!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({type: 'ADD', ingredient: {id: data.name, ...reqExtra}});
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const filterIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({type: 'SET', ingredients: filteredIngredients});
  }, []); //Catch the function so it is not created again on the rerendered

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest('https://react-hooks-update-c4fc1.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT');
    //setIsLoading(true);
    // dispatchHttp({type: 'SEND'});
    // fetch('https://react-hooks-update-c4fc1.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: {'Content-Type': 'application/json'}
    // }).then(response => {
    //   dispatchHttp({type: 'RESPONSE'});
    //   return response.json();
    // }).then(responseData => {
    //   dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}});
    //   // setUserIngredients(prevIngredients => 
    //   //   [...prevIngredients, 
    //   //   {id: responseData.name, ...ingredient}]);
    // });
  }, [sendRequest])

  const removeIngredientHandler = useCallback((ingredientId) => {
    sendRequest(
      `https://react-hooks-update-c4fc1.firebaseio.com/ingredients/${ingredientId}.json`, 
      'DELETE',
      null,
      ingredientId,
      'REMOVE_INGREDIENT'
    );
    // dispatchHttp({type: 'SEND'});
    // fetch(`https://react-hooks-update-c4fc1.firebaseio.com/ingredients/${ingredientId}.json`, {
    //   method: 'DELETE'
    // }).then(response => {
    //   dispatchHttp({type: 'RESPONSE'});
    //   dispatch({type: 'DELETE', id: ingredientId});
    //   // setUserIngredients(prevIngredients => 
    //   //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
    //   //   );
    // }).catch(error => {
    //   //setError('Something went wrong!');
    //   dispatchHttp({type: 'ERROR', error: error});
    // });
  }, [sendRequest]);

  const clearError= useCallback(() => {
    // setError(null);
    // setIsLoading(false);
   // dispatchHttp({type: 'CLEAR'});
   clear();
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} 
      loading={isLoading}/>

      <section>
        <Search  onLoadIngredients={filterIngredientsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
