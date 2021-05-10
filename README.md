# todo-list-app

Projet 8  -  Reprenez et améliorez un projet existant

formation OpenClassrooms Développeur d'applications Front-End

Amélioration d'un projet existant, mise en place de tests unitaires, optimisation de performance, rédaction de la documentation utilisateur et technique

Etape 1 : Corrigez les bugs

Premier bug est une erreur dans le nom du fichier .json dans base.js

    getFile('learn.json', Learn);
    
    Remplacé par
    
    getFile('package.json', Learn);
    
Second  bug  est une faute de frappe dans le fichier controlle.js ligne 97

    Controller.prototype.adddItem
    
    Remplacé par
    
    Controller.prototype.addItem
    
Troisième bug  intruduit un conflit éventuel entre deux IDs identiques. Il est situé dans  store.js au sein de la fonction 

    Store.prototype.save
    
    var newId = ""; 
	    var charset = "0123456789";

        for (var i = 0; i < 6; i++) {
     		newId += charset.charAt(Math.floor(Math.random() * charset.length));
		}
    
    Remplacé par 
    
    var newId = Date.now;
    
Etape 2  : Ou sont les tests   ?  
  
   Dans un premier temps, il faut installer NPM et Node.js pour pouvoir déployer Jasmine.
   Pour lancez les test inutaires, ouvrez dnas votre navigateur le fichier suivant à la racine du projet : ./test/SpecRunner.js
   Les fichier code des tests Jasmine se trouve à l'emplacement suivant : ./test/ControllerSpec.js
   
   Le test suivant a été ajouté :
    
