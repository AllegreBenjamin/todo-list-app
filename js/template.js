/*jshint laxbreak:true */
(function (window) {
	'use strict';

	var htmlEscapes = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		'\'': '&#x27;',
		'`': '&#x60;'
	};

	var escapeHtmlChar = function (chr) {
		return htmlEscapes[chr];
	};

	var reUnescapedHtml = /[&<>"'`]/g;
	var reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

	var escape = function (string) {
		return (string && reHasUnescapedHtml.test(string))
			? string.replace(reUnescapedHtml, escapeHtmlChar)
			: string;
	};

	/**
	 * Sets up defaults for all the Template methods such as a default template
	 * Définit les valeurs par défaut pour toutes les méthodes de modèle telles qu'un modèle par défaut
	 * @constructor
	 */
	function Template() {
		this.defaultTemplate
		=	'<li data-id="{{id}}" class="{{completed}}">'
		+		'<div class="view">'
		+			'<input class="toggle" type="checkbox" {{checked}}>'
		+			'<label>{{title}}</label>'
		+			'<button class="destroy"></button>'
		+		'</div>'
		+	'</li>';
	}

	/**
	 * Creates an <li> HTML string and returns it for placement in your app.
	 * Crée une chaîne HTML <li> et la renvoie pour la placer dans votre application.
	 * 
	 * NOTE: In real life you should be using a templating engine such as Mustache
	 * or Handlebars, however, this is a vanilla JS example.
	 *
     * REMARQUE: dans la vraie vie, vous devriez utiliser un moteur de création de modèles tel que Moustache
	 * ou Handlebars, cependant, ceci est un exemple JS vanilla.
	 * @param {object} data The object containing keys you want to find in the
	 *                      template to replace.
	 * 						L'objet contenant les clés que vous souhaitez trouver dans le
	 * 						modèle à remplacer.
	 * @returns {string} HTML String of an <li> element - Chaîne HTML d'un élément <li>
	 *
	 * @example
	 * view.show({
	 *	id: 1,
	 *	title: "Hello World",
	 *	completed: 0,
	 * });
	 */
	Template.prototype.show = function (data) {
		var i, l;
		var view = '';

		for (i = 0, l = data.length; i < l; i++) {
			var template = this.defaultTemplate;
			var completed = '';
			var checked = '';

			if (data[i].completed) {
				completed = 'completed';
				checked = 'checked';
			}

			template = template.replace('{{id}}', data[i].id);
			template = template.replace('{{title}}', escape(data[i].title));
			template = template.replace('{{completed}}', completed);
			template = template.replace('{{checked}}', checked);

			view = view + template;
		}

		return view;
	};

	/**
	 * Displays a counter of how many to dos are left to complete
	 * Affiche un compteur du nombre de tâches qu'il reste à terminer
	 * 
	 * @param {number} activeTodos The number of active todos. - Le nombre de todos actifs.
	 * @returns {string} String containing the count - Chaîne contenant le nombre
	 */
	Template.prototype.itemCounter = function (activeTodos) {
		var plural = activeTodos === 1 ? '' : 's';

		return '<strong>' + activeTodos + '</strong> item' + plural + ' left';
	};

	/**
	 * Updates the text within the "Clear completed" button
	 * Chaîne contenant le nombre
	 * 
	 * @param  {[type]} completedTodos The number of completed todos. - Le nombre de todos terminés.
	 * @returns {string} String containing the count - Chaîne contenant le nombre
	 */
	Template.prototype.clearCompletedButton = function (completedTodos) {
		if (completedTodos > 0) {
			return 'Clear completed';
		} else {
			return '';
		}
	};

	// Export to window
	window.app = window.app || {};
	window.app.Template = Template;
})(window);
