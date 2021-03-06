/*jshint eqeqeq:false */

(function (window) {
	'use strict';

	/**
	 * Creates a new client side storage object and will create an empty
	 * collection if no collection already exists.
	 * Crée un nouvel objet de stockage côté client et créera un vide
	 * collection si aucune collection n'existe déjà.
	 * 
	 * @param {string} name The name of our DB we want to use - Le nom de notre base de données que nous voulons utiliser
	 * @param {function} callback Our fake DB uses callbacks because in
	 * 							  real life you probably would be making AJAX calls
	 * 							  Notre fausse base de données utilise des rappels car dans
	 * 							  dans la vraie vie, vous feriez probablement des appels AJAX
	 */
	function Store(name, callback) {
		callback = callback || function () {};

		this._dbName = name;

		if (!localStorage[name]) {
			var data = {
				todos: []
			};

			localStorage[name] = JSON.stringify(data);
		}

		callback.call(this, JSON.parse(localStorage[name]));
	}

	/**
	 * Finds items based on a query given as a JS object 
	 * Recherche des éléments en fonction d'une requête donnée en tant qu'objet JS
	 *
	 * @param {object} query The query to match against (i.e. {foo: 'bar'}) - The query to match against (i.e. {foo: 'bar'})
	 * @param {function} callback The callback to fire when the query has completed running - Le rappel à déclencher lorsque l'exécution de la requête est terminée
	 * 
	 *
	 * @example
	 * db.find({foo: 'bar', hello: 'world'}, function (data) {
	 *	 // data will return any items that have foo: bar and
	 *	 // hello: world in their properties
	 * });
	 * @Exemple
	 * db.find ({foo: 'bar', hello: 'world'}, fonction (data) {
	 * // les données renverront tous les éléments qui ont foo: bar et
	 * // bonjour: le monde dans ses propriétés
	 * });
	 */
	Store.prototype.find = function (query, callback) {
		if (!callback) {
			return;
		}

		var todos = JSON.parse(localStorage[this._dbName]).todos;

		callback.call(this, todos.filter(function (todo) {
			for (var q in query) {
				if (query[q] !== todo[q]) {
					return false;
				}
			}
			return true;
		}));
	};

	/**
	 * Will retrieve all data from the collection
	 * Récupérera toutes les données de la collection
	 * 
	 * @param {function} callback The callback to fire upon retrieving data - Le rappel à déclencher lors de la récupération des données
	 */
	Store.prototype.findAll = function (callback) {
		callback = callback || function () {};
		callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
	};

	/**
	 * Will save the given data to the DB. If no item exists it will create a new
	 * item, otherwise it'll simply update an existing item's properties
	 * Sauvegardera les données données dans la base de données. Si aucun élément n'existe, il créera un nouveau
	 * élément, sinon il mettra simplement à jour les propriétés d'un élément existant
	 * 
	 * @param {object} updateData The data to save back into the DB - Les données à sauvegarder dans la base de données
	 * @param {function} callback The callback to fire after saving - Le rappel au feu après l'enregistrement
	 * @param {number} id An optional param to enter an ID of an item to update - Un paramètre facultatif pour saisir l'ID d'un élément à mettre à jour
	 */
	Store.prototype.save = function (updateData, callback, id) {
		var data = JSON.parse(localStorage[this._dbName]);
		var todos = data.todos;

		callback = callback || function () {};

		// Generate an ID
	    var newId = Date.now(); 

		// If an ID was actually given, find the item and update each property 
		// Si un identifiant a été effectivement donné, recherchez l'élément et mettez à jour chaque propriété
		if (id) {
			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id === id) {
					for (var key in updateData) {
						todos[i][key] = updateData[key];
					}
					break;
				}
			}

			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, todos);
		} else {

    		// Assign an ID
			updateData.id = parseInt(newId);
    

			todos.push(updateData);
			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, [updateData]);
		}
	};

	/**
	 * Will remove an item from the Store based on its ID
	 * Supprime un article du magasin en fonction de son identifiant
	 *
	 * @param {number} id The ID of the item you want to remove - L'ID de l'élément que vous souhaitez supprimer
	 * @param {function} callback The callback to fire after saving - Le callback après l'enregistrement
	 */
	Store.prototype.remove = function (id, callback) {
		var data = JSON.parse(localStorage[this._dbName]);
		var todos = data.todos;
		var todoId;
		
		for (var i = 0; i < todos.length; i++) {
			if (todos[i].id == id) {
				todoId = todos[i].id;
			}
		}

		for (var i = 0; i < todos.length; i++) {
			if (todos[i].id == todoId) {
				todos.splice(i, 1);
			}
		}

		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, todos);
	};

	/**
	 * Will drop all storage and start fresh 
	 * Va abandonner tout le stockage et recommencer à zéro
	 *
	 * @param {function} callback The callback to fire after dropping the data - Le rappel à déclencher après la suppression des données
	 */
	Store.prototype.drop = function (callback) {
		var data = {todos: []};
		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, data.todos);
	};

	// Export to window
	window.app = window.app || {};
	window.app.Store = Store;
})(window);