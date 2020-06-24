import {useReducer, useCallback} from 'react';

const initialState = {loading: false, error: null, data:null, extra:null, identifier: null};

const httpReducer = (httpState, action) => {
    switch(action.type) {
      case 'SEND':
        return {loading: true, error: null, data: null, extra: null, identifier: action.identifier};
      case 'RESPONSE':
        return {...httpState, loading: false, data: action.responseData, extra: action.extra};
      case 'ERROR':
        return {loading: false, error: action.error};
      case 'CLEAR':
        return initialState;
      default:
        throw new Error('Error action type');
    }
  };

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null, data:null, extra:null, identifier: null});

    const clear = useCallback(() => dispatchHttp({type: 'CLEAR'}), []);

    const sendRequest = useCallback((url, method, body, extra, identifier) => {
        dispatchHttp({type: 'SEND', identifier: identifier});
        fetch(url, {
        method: method,
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }
        }).then(response => {
            return response.json();
        }).then(responseData => {
            dispatchHttp({type: 'RESPONSE', responseData: responseData, extra: extra})
        }).catch(error => {
        dispatchHttp({type: 'ERROR', error: error});
        });
    }, []);

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest,
        reqExtra: httpState.extra,
        reqIdentifier: httpState.identifier,
        clear: clear
    };
};

export default useHttp;