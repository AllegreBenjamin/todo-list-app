/*global app, jasmine, describe, it, beforeEach, expect */

describe('controller', function () {
	'use strict';

	var subject, model, view;

	var setUpModel = function (todos) {
		model.read.and.callFake(function (query, callback) {
			callback = callback || query;
			callback(todos);
		});

		model.getCount.and.callFake(function (callback) {

			var todoCounts = {
				active: todos.filter(function (todo) {
					return !todo.completed;
				}).length,
				completed: todos.filter(function (todo) {
					return !!todo.completed;
				}).length,
				total: todos.length
			};

			callback(todoCounts);
		});

		model.remove.and.callFake(function (id, callback) {
			callback();
		});

		model.create.and.callFake(function (title, callback) {
			callback();
		});

		model.update.and.callFake(function (id, updateData, callback) {
			callback();
		});
	};

	var createViewStub = function () {
		var eventRegistry = {};
		return {
			render: jasmine.createSpy('render'),
			bind: function (event, handler) {
				eventRegistry[event] = handler;
			},
			trigger: function (event, parameter) {
				eventRegistry[event](parameter);
			}
		};
	};

	beforeEach(function () {
		model = jasmine.createSpyObj('model', ['read', 'getCount', 'remove', 'create', 'update']);
		view = createViewStub();
		subject = new app.Controller(model, view);
	});

	it('should show entries on start-up - devrait afficher les entrées au démarrage', function () {
		// test ajouter 3
		// todos est vide
		var todo = {};

		// initialise le model avec mes datas
		setUpModel([todo]);
		// Charge et initialise la vue
		subject.setView('');
		// vérifie que le controller a bien appelé view.render avec les bons params : 'showEntries' et le tableau vide
		expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
	});

	describe('routing', function () {

		it('should show all entries without a route - devrait afficher toutes les entrées sans itinéraire', function () {
			var todo = {title: 'my todo'};
			setUpModel([todo]);

			subject.setView('');

			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
		});

		it('should show all entries without "all" route - devrait afficher toutes les entrées sans route "all"', function () {
			var todo = {title: 'my todo'};
			setUpModel([todo]);

			subject.setView('#/');

			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
		});

		it('should show active entries - devrait afficher les entrées actives', function () {
			// test ajouter 1
			////////// ln 74 controller.js ////////////
			/*
				Controller.prototype.showActive = function () {
					var self = this;
					self.model.read({ completed: false }, function (data) {
						self.view.render('showEntries', data);
					});
				};
			*/
			var todo = {title: 'my todo', completed: false};
			setUpModel([todo]);

			// définit la vue pour afficher les éléments actifs
			subject.setView('#/active');

			// appelle la méthode model.read avec la valeur completed: false et la function comme parametre
			expect(model.read).toHaveBeenCalledWith({completed: false}, jasmine.any(Function));

			// La méthode render montre ensuite les entrées et le tableau todos
			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);

			// La tâche complètée devrait toujours être fausse !
			expect(todo.completed).toEqual(false);
		});

		it('should show completed entries - devrait afficher les entrées terminées', function () {
			// test ajouter 2
			/////////// ln 84 controller.js /////////////
			/*
				Controller.prototype.showCompleted = function () {
					var self = this;
					self.model.read({ completed: true }, function (data) {
						self.view.render('showEntries', data);
					});
				};
			*/
			var todo = {title: 'my todo', completed:true};
			setUpModel([todo]);

			// défini la vue pour afficher les éléments complets
			subject.setView('#/completed');

			expect(model.read).toHaveBeenCalledWith({ completed: true}, jasmine.any(Function));

			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);

			expect(todo.completed).toEqual(true);
		});
	});

	it('should show the content block when todos exists - devrait afficher le bloc de contenu lorsque todos existe', function () {
		setUpModel([{title: 'my todo', completed: true}]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
			visible: true
		});
	});

	it('should hide the content block when no todos exists - devrait masquer le bloc de contenu lorsqu il n y a pas de todos', function () {
		setUpModel([]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
			visible: false
		});
	});

	it('should check the toggle all button, if all todos are completed - devrait cocher le bouton bascule tout, si toutes les tâches sont terminées', function () {
		setUpModel([{title: 'my todo', completed: true}]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('toggleAll', {
			checked: true
		});
	});

	it('should set the "clear completed" button - devrait définir le bouton "Effacer terminé"', function () {
		var todo = {id: 42, title: 'my todo', completed: true};
		setUpModel([todo]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('clearCompletedButton', {
			completed: 1,
			visible: true
		});
	});

	it('should highlight "All" filter by default - doit mettre en évidence le filtre "Tous" par défaut', function () {
		// TODO: write test
		////////// ln 52 view.js ////////
		/*
			View.prototype._setFilter = function (currentPage) {
				qs('.filters .selected').className = '';
				qs('.filters [href="#/' + currentPage + '"]').className = 'selected';
				};
		*/
		var currentPage = '';
		setUpModel([]);
		subject.setView('');
		// Configuration de l'environnement par défaut
		expect(view.render).toHaveBeenCalledWith('setFilter', currentPage);
	});

	it('should highlight "Active" filter when switching to active view - doit mettre en évidence le filtre "Actif" lors du passage à la vue active', function () {
		// TODO: write test
			////////// ln 52 view.js ////////
		/*
			View.prototype._setFilter = function (currentPage) {
				qs('.filters .selected').className = '';
				qs('.filters [href="#/' + currentPage + '"]').className = 'selected';
				};
		*/
		var currentPage = 'active';

		setUpModel([]);
		subject.setView('#/active');

		expect(view.render).toHaveBeenCalledWith('setFilter', currentPage);
	});

	describe('toggle all', function () {
		it('should toggle all todos to completed - devrait basculer toutes les tâches à terminer', function () {
			// TODO: write test
				///////// ln 194 view.js /////////
			/*	else if (event === 'toggleAll') {
					$on(self.$toggleAll, 'click', function () {
						handler({completed: this.checked});
					});
			*/
			var todo = {id:42, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			// établit le toggleAll comme 'true'
			view.trigger('toggleAll', {completed: true});
			// completed besion etre vrai
			expect(model.update).toHaveBeenCalledWith(42,{completed: true}, jasmine.any(Function));
		});

		it('should update the view - devrait mettre à jour la vue', function () {
			// TODO: write test
			  ////////// ln 57 view.js /////////////
            /*
            View.prototype._elementComplete = function (id, completed) {
            var listItem = qs('[data-id="' + id + '"]');
            
            if (!listItem) {
                return;
            }
            listItem.className = completed ? 'completed' : '';
            qs('input', listItem).checked = completed;
            };
            */
		   var todo = {id: 42, title: 'my todo', completed: false};
		   setUpModel([todo]);
		   subject.setView('');
		   view.trigger('toggleAll', {completed: true});
		   expect(view.render).toHaveBeenCalledWith('elementComplete', {id:42, completed:true});
		});
	});

	describe('new todo', function () {
		it('should add a new todo to the model - devrait ajouter un nouveau todo au modèle', function () {
			// TODO: write test
				  ////////// ln 184 view.js /////////////
			/*
				if (event === 'newTodo') {
				$on(self.$newTodo, 'change', function () {
					handler(self.$newTodo.value);
				});
			*/
			setUpModel([]);
			subject.setView('');
			
			view.trigger('newTodo','a new todo');

			// utilise l'espion "model.create" avec le 'a new todo' utilisant jasmine.any pour la comparaison booléenne
			expect(model.create).toHaveBeenCalledWith('a new todo', jasmine.any(Function));

		});

		it('should add a new todo to the view - should add a new todo to the view', function () {
			setUpModel([]);

			subject.setView('');

			view.render.calls.reset();
			model.read.calls.reset();
			model.read.and.callFake(function (callback) {
				callback([{
					title: 'a new todo',
					completed: false
				}]);
			});

			view.trigger('newTodo', 'a new todo');

			expect(model.read).toHaveBeenCalled();

			expect(view.render).toHaveBeenCalledWith('showEntries', [{
				title: 'a new todo',
				completed: false
			}]);
		});

		it('should clear the input field when a new todo is added - devrait effacer le champ de saisie lorsqu un nouveau todo est ajouté', function () {
			setUpModel([]);

			subject.setView('');

			view.trigger('newTodo', 'a new todo');

			expect(view.render).toHaveBeenCalledWith('clearNewTodo');
		});
	});

	describe('element removal', function () {
		it('should remove an entry from the model - devrait supprimer une entrée du modèle', function () {
			// TODO: write test
			 //////// ln 204 view.js /////////////
			/*
			else if (event === 'itemRemove') {
			$delegate(self.$todoList, '.destroy', 'click', function () {
				handler({id: self._itemId(this)});
			});
			*/
			var todo = {id: 42, title: 'my todo', completed: true};

			setUpModel([todo]);
			subject.setView('');

			view.trigger('itemRemove', {id: 42});

			expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
		});

		it('should remove an entry from the view - devrait supprimer une entrée de la vue', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('itemRemove', {id: 42});

			expect(view.render).toHaveBeenCalledWith('removeItem', 42);
		});

		it('should update the element count - devrait mettre à jour le nombre d éléments', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('itemRemove', {id: 42});

			expect(view.render).toHaveBeenCalledWith('updateElementCount', 0);
		});
	});

	describe('remove completed', function () {
		it('should remove a completed entry from the model - devrait supprimer une entrée terminée du modèle', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('removeCompleted');

			expect(model.read).toHaveBeenCalledWith({completed: true}, jasmine.any(Function));
			expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
		});

		it('should remove a completed entry from the view - devrait supprimer une entrée terminée de la vue', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('removeCompleted');

			expect(view.render).toHaveBeenCalledWith('removeItem', 42);
		});
	});

	describe('element complete toggle - bascule complète de l élément', function () {
		it('should update the model - devrait mettre à jour le modèle', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);
			subject.setView('');

			view.trigger('itemToggle', {id: 21, completed: true});

			expect(model.update).toHaveBeenCalledWith(21, {completed: true}, jasmine.any(Function));
		});

		it('should update the view - devrait mettre à jour la vue', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);
			subject.setView('');

			view.trigger('itemToggle', {id: 42, completed: false});

			expect(view.render).toHaveBeenCalledWith('elementComplete', {id: 42, completed: false});
		});
	});

	describe('edit item', function () {
		it('should switch to edit mode - devrait passer en mode édition', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEdit', {id: 21});

			expect(view.render).toHaveBeenCalledWith('editItem', {id: 21, title: 'my todo'});
		});

		it('should leave edit mode on done - devrait quitter le mode d édition sur terminé', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: 'new title'});

			expect(view.render).toHaveBeenCalledWith('editItemDone', {id: 21, title: 'new title'});
		});

		it('should persist the changes on done - devrait persister les changements sur fait', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: 'new title'});

			expect(model.update).toHaveBeenCalledWith(21, {title: 'new title'}, jasmine.any(Function));
		});

		it('should remove the element from the model when persisting an empty title - devrait supprimer l élément du modèle lors de la persistance d un titre vide', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: ''});

			expect(model.remove).toHaveBeenCalledWith(21, jasmine.any(Function));
		});

		it('should remove the element from the view when persisting an empty title - devrait supprimer l élément de la vue lors de la persistance d un titre vide', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: ''});

			expect(view.render).toHaveBeenCalledWith('removeItem', 21);
		});

		it('should leave edit mode on cancel - devrait quitter le mode d édition en cas d annulation', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditCancel', {id: 21});

			expect(view.render).toHaveBeenCalledWith('editItemDone', {id: 21, title: 'my todo'});
		});

		it('should not persist the changes on cancel - ne doit pas persister les modifications lors de l annulation', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditCancel', {id: 21});

			expect(model.update).not.toHaveBeenCalled();
		});
	});
});
