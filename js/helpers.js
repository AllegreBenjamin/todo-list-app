/*global NodeList */
/* Liste de nœuds globale */

(function (window) {
	'use strict';

	// Get element(s) by CSS selector:
	// Récupère le (s) élément (s) par le sélecteur CSS:
	window.qs = function (selector, scope) {
		return (scope || document).querySelector(selector);
	};
	window.qsa = function (selector, scope) {
		return (scope || document).querySelectorAll(selector);
	};

	// addEventListener wrapper:
	// wrapper addEventListener:
	window.$on = function (target, type, callback, useCapture) {
		target.addEventListener(type, callback, !!useCapture);
	};

	// Attach a handler to event for all elements that match the selector,
	// now or in the future, based on a root element
	// Attache un gestionnaire à l'événement pour tous les éléments qui correspondent au sélecteur,
	// maintenant ou dans le futur, basé sur un élément racine

	window.$delegate = function (target, selector, type, handler) {
		function dispatchEvent(event) {
			var targetElement = event.target;
			var potentialElements = window.qsa(selector, target);
			var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

			if (hasMatch) {
				handler.call(targetElement, event);
			}
		}

		// https://developer.mozilla.org/en-US/docs/Web/Events/blur
		var useCapture = type === 'blur' || type === 'focus';

		window.$on(target, type, dispatchEvent, useCapture);
	};

	// Find the element's parent with the given tag name:
	// $parent(qs('a'), 'div');
	// Trouver le parent de l'élément avec le nom de balise donné:
	// $ parent (qs ('a'), 'div');
	window.$parent = function (element, tagName) {
		if (!element.parentNode) {
			return;
		}
		if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
			return element.parentNode;
		}
		return window.$parent(element.parentNode, tagName);
	};

	// Allow for looping on nodes by chaining:
	// qsa('.foo').forEach(function () {})
	// Autorise le bouclage sur les nœuds en chaînant:
	// qsa ('. foo'). forEach (fonction () {})
	NodeList.prototype.forEach = Array.prototype.forEach;
})(window);
