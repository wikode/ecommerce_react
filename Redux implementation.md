# Redux implementation

## Principe
Redux sert de store global pour une app. Il permet d'éviter de passer les données de components parents aux components enfants, des fois bien que ces components n'aient pas besoin des données.
Au contraire, Redux va permettre de connecter chaque component qui en a besoin au store et d'avoir accès directement aux données.
## Redux Flow Logique
- Sur le site, en fonction d'une interaction utilisateur (un clic, un input rempli ou autre ...), on va déclencher une action.
- Cette action peut être interceptée par un Middleware : une fonction qui va manipuler les données avant de relancer l'action initiale (avec les données modifiées). C'est optionnel.
- Cette action est une fonction pure qui va renvoyer un objet contenant au minimum une key `type` qui est une chaine de caractère et va indiquer un type précis d'action (ce type peut être n'importe quoi, au choix). L'action peut aussi contenir une key `payload` qui contient des données supplémentaires.
- L'action est envoyée vers tous les Reducers existants. Les reducers sont des fonctions qui prennent en paramètre le store (celui avant application de l'action pour le modifier) et l'action. Un reducer va vérifier le `type` de l'action dans un `switch()` et s'il possède ce type comme `case` alors il retourne un nouvel objet qui représentera le nouveau state du store.
- Il peut exister plusieurs Reducers. Il est conseillé d'en créer un par catégorie de données : par exemple un `userReducer` sera chargé de gérer toutes les actions qui impactent les données du user.
- Tous les Reducers sont assemblés dans un `rootReducer` qui sera passé en paramètre du store Redux pour avoir le droit d'y modifier les données.
- Le store se retrouvera alors modifié. Les components connectés au store et qui disposent de certaines données dans leurs props seront automatiquement `render()` à nouveau.

## Mise en place
1. Installer `redux`, `react-redux` (et en option `redux-logger`) avec npm (redux-logger permet de loguer à la console le state avant, l'action et le state après l'action).
2. Il faut donner accès au store Redux à toute l'application : aller sur `index.js` et importer `Provider` depuis react-redux :
	```javascript
	import { Provider } from  'react-redux'
	```
	Puis englober toute l'application avec :
	```javascript
	ReactDOM.render(
		<React.StrictMode>
			<Provider>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</Provider>
		</React.StrictMode>,
		document.getElementById('root')
	);
	```
3. Dans le dossier `src` créer un dossier `redux` puis un fichier `root-reducer.js` dedans. On créer aussi un dossier par catégorie du store : par exemple un dossier user qui gère les informations du user, un dossier shop pour tout ce qui concerne les informations de produits à vendre et la gestion du panier, etc...
4. Dans ces dossiers, on créer à chaque fois un fichier reducer (par exemple `user-reducer.js`).
5. Ce fichier contiendra une fonction reducer qui s'occupera de gérer toutes les actions qui affecteront les donnée du state du user. Il faudra toujours donner un state initial en paramètre par défaut; et on retourne toujours soit un nouvel objet qui correspond au nouveau state, soit le state actuel. **Exemple :**
	```javascript
	const INITIAL_STATE = {
	    currentUser: null
	}

	const userReducer = (state = INITIAL_STATE, action) => {
	    switch (action.type) {
	        case 'SET_CURRENT_USER':
	            return {
	                ...state,
	                currentUser: action.payload
	            }
	        default:
	            return state;
	    }
	}

	export default userReducer;
	```
	*Note :*
	Quand on rencontre un case qui correspond au type de l'action, on retourne  un objet dans lequel on met la nouvelle valeur souhaitée (si elle existe déjà elle sera modifiée avec les nouvelles données), et on spread le state actuel pour y ajouter toutes les autres valeurs.

	*Note :*
	Une meilleure pratique consiste à créer un fichier pour les types (ex: user.types.js) pour y stocker tous les types afin de garder une homogénéité et éviter les fautes de frappes. Ainsi, dans ce fichier :
	```javascript
	export const UserActionTypes = {
    	SET_CURRENT_USER: 'SET_CURRENT_USER'
	}
	```
	Et donc dans le reducer et l'action associé, on modifie `'SET_CURRENT_USER'` par `UserActionTypes.SET_CURRENT_USER`.

6. Combiner les reducers en les important `root-reducer.js`. Pour cela, il faut également importer `combineReducers` depuis redux. On combinera les reducers dans un objet, dans lequel chaque key représentera une portion du state global, et en valeur on met le reducer associé. **Exemple :** 
	```javascript
	import { combineReducers } from 'redux';
	import userReducer from './user/user.reducer';

	export default combineReducers({
	    user: userReducer
	})
	```
	*Note :*
	Dans cet exemple le store ne contient qu'une seule portion sous `user` pour le moment. Mais dans cette portion on a accès à currentUser, qui est fixé par le `userReducer`. On y accèderait donc par :
	```javascript
	const userInfos = state.user.currentUser;
	```
	
7. Dans le dossier redux, créer un fichier `store.js` dans lequel nous allons créer le store. Nous devont importer plusieurs choses :
	```javascript
	import { createStore, applyMiddleware } from 'redux';
	import logger from 'redux-logger'; //optionnel
	import rootReducer from './root-reducer';
	```
8. Créer un `array` dans lequel on stockera tous les `middlewares` :
	```javascript
	const middlewares = [logger]; //en rajouter dans l'array
	```
9. Créer le store en passant en paramètres le rootReducer et les middlewares :
	```javascript
	const store = createStore(rootReducer, applyMiddleware(...middlewares));
	``` 
	Exporter store.
10. Importer le store dans `index.js` pour fournir le store à l'application en passant `store={store}` en props du `<Provider>`.

	**AUTRE OPTION : avec Redux devTools**
	Pour mieux visualiser le store, installer l'extension chrome `redux devTools`. On pourra alors procéder comme ceci pour l'implémenter :
	```javascript
	import React from 'react';
	import ReactDOM from 'react-dom';
	import { Provider } from "react-redux";
	import logger from  'redux-logger';  //optionnel
	import { createStore, applyMiddleware, compose } from "redux";

	import App from './App';
	import rootReducer from "./redux/reducers/rootReducer";
	import * as serviceWorker from './serviceWorker';

	const middlewares = [logger];
	const composeEnhancers = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose);

	const store = createStore( rootReducer, composeEnhancers(applyMiddleware(...middlewares)) )

	ReactDOM.render(  
		<React.StrictMode>  
			<Provider>  
				<BrowserRouter>  
					<App /> 
				</BrowserRouter>  
			</Provider> 
		</React.StrictMode>, 
		document.getElementById('root')  
	);
	``` 
	11. Il faut encore créer les actions ! Dans les dossiers des reducers (comme `src\redux\user`) créer à chaque fois un fichier pour gérer les actions associées (dans l'exemple : `user.actions.js`).
	12.  Un action sera simplement une fonction qui pourra prendre un ou des paramètre(s) et renverra un objet, avec au minimum un `type` et éventuellement un `payload` : 
	```javascript
	export const setCurrentUser = user => ({
	    type: 'SET_CURRENT_USER',
	    payload: user
	})
	``` 
	*Note :*
	Par convention on écrit les type en `SNAKE_CASE`.


## Connecter le store Redux aux components
Pour pouvoir donner accès au state aux différents components, on va devoir les connecter. On utilisera `connect()` qui est une fonction qui retournera un `HOC` (higher order component - un component avec plus de fonctionnalités). 

Cette fonction connect peut prendre deux paramètres :

-  `mapStateToProps `qui est une fonction qui a accès au state et permettra de renvoyer des morceaux du state en props au component.
- `mapDispatchToProps `qui est une fonction qui a accès à la fonction `dispatch` et qui permettra de déclencher des actions en les passant en props au component.

**Exemple de structure :**
```javascript
import React from "react";
import { connect } from "react-redux";
import { setCurrentUser } from './redux/user/user.actions'

const Header = ({ currentUser, setCurrentUser }) => {
  return (
    //component qui a accès à currentUser du state
    //component qui pourra changer le state en déclenchant l'action setCurrentUser
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})


export default connect(mapStateToProps, mapDispatchToProps)(Header);
```

