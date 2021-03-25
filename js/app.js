/*global app, $on */
/* app globale, $on */
(function () {
	'use strict';

	/**
	 * Sets up a brand new Todo list.
	 * Configure une toute nouvelle liste Todo
	 * @param {string} name The name of your new to do list. Le nom de votre nouvelle liste de tâches.
	 * 
	 * Met en place une toute nouvelle liste Todo.
	 * Configurer une toute nouvelle liste Todo
	 * @param {string} name Le nom de votre nouvelle liste de tâches. Le nom de votre nouvelle liste de tâches.
	 */
	function Todo(name) {
		this.storage = new app.Store(name);
		this.model = new app.Model(this.storage);
		this.template = new app.Template();
		this.view = new app.View(this.template);
		this.controller = new app.Controller(this.model, this.view);
	}

	var todo = new Todo('todos-vanillajs');

	function setView() {
		todo.controller.setView(document.location.hash);
	}
	$on(window, 'load', setView);
	$on(window, 'hashchange', setView);
})();
