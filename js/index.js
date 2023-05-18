/////////////////// Code JavaScript pour le TP2 par Camilia El Moustarih ///////////////////

//////// DÉCLARATION DES VARIABLES DU QUIZ ////////

//Sons
let audio = {
    sonBonneReponse: new Audio('sons/sonBonneReponse.mp3'),
    sonMauvaiseReponse: new Audio('sons/sonMauvaiseReponse.wav'),
    sonFinQuiz: new Audio('sons/sonFinQuiz.wav')
};

//Réponse actuelle
let numQuestion = 0;

//Nombre de réponses justes
let nbReponsesJustes = 0;

//La zone d'affichage du quiz
let zoneQuiz = document.querySelector(".quiz");

//Section du quiz pour l'animation avec clip-path
let animSection = document.querySelector("section");

//Section pour afficher les questions
let sectionQuestion = document.querySelector("section");

//Position des questions sur l'axe des X
let positionX = 100;

//Conteneurs pour les titres
let titresQuestion = document.querySelector(".titresQuestions");

//Conteneurs des choix de réponse
let choixReponses = document.querySelector(".choixReponses");

//Pour animer le titre du quiz
let titreIntro = document.querySelector(".anim-titre-intro");

//Zone pour afficher la fin du quiz
let zoneFinQuiz = document.querySelector(".finQuiz");

//Bouton pour recommencer le quiz sur le clic de souris
let btnRejouer = document.querySelector('.btn-rejouer');
console.log(btnRejouer);


//////// GESTIONNAIRES D'ÉVÉNEMENTS ////////

//Gérer la fin de l'animation du titre d'introduction
titreIntro.addEventListener("animationend", afficherConsignes);

//Gestion du bouton de redémarrage du quiz pour recommencer le jeu sur le clic de la souris
btnRejouer.addEventListener("click", recommencerQuiz);


//////// FONCTIONS ////////

//Fonction pour afficher les consignes en début de jeu
function afficherConsignes(event){

    //Afficher dans la console le nom des animations pour être sûr que les deux jouent entièrement avant de passer à l'instruction suivante
    console.log(event.animationName);

    //Pour afficher les consignes du jeu à la fin de la deuxième animation
    if(event.animationName == "etirer-titre"){

        //Afficher la consigne dans la section ".instructions"
        let sectionPrincipale = document.querySelector("footer");

        //Afficher le texte suivant
        sectionPrincipale.innerHTML = "<h1>Cliquez n'importe où dans la page pour débuter le quiz</h1>";

        //Mettre un écouteur d'événement sur la fenêtre afin d'enlever l'introduction et débuter le quiz pour la fonction suivante
        window.addEventListener("click", debuterQuiz);
        
        //Enlever le header 
        document.querySelector("header").remove();
    }
}

//Fonction pour enlever l'introduction et débuter le quiz
function debuterQuiz(){

    //Enlever l'écouteur d'événement sur l'animation d'introduction
    document.querySelector("main.introQuiz").remove();

    //Enlever l'écouteur d'événement qui gère le début du quiz
    window.removeEventListener("click", debuterQuiz);

    //Afficher le conteneur principal du quiz en flex
    zoneQuiz.style.display = "flex";    

    //Afficher la première question
    afficherQuestion();
}

//Fonction pour afficher les questions
function afficherQuestion(){

    //Enlever le texte des instructions avec le footer et rajouter les droits d'auteur
    let piedPage = document.querySelector("footer");
    piedPage.innerText = "Projet fait par Camilia El Moustarih - TIM Hiver 2023";

    //Récupérer l'objet du tableau des questions
    let objetQuestion = lesQuestions[numQuestion];

    //Afficher le texte de la question
    titresQuestion.innerText = objetQuestion.titre;

    //Créer et afficher les balises pour les choix de réponses avec un conteneur vide
    choixReponses.innerHTML = "";

    //Afficher les choix de réponse avec une boucle for
    let unChoix;
    for (let i = 0; i < objetQuestion.choix.length; i++){

        //Créer une balise et lui donner une classe CSS
        unChoix = document.createElement("div");
        unChoix.classList.add("choix");

        //On intègre la valeur du choix de réponse
        unChoix.innerText = objetQuestion.choix[i];

        //Lui affecter un index
        unChoix.indexChoix = i;

        //Mettre un écouteur d'événement qui va vérifier la réponse choisie par le joueur sur un clic de souris
        unChoix.addEventListener("mousedown", verifierReponse);

        //Afficher le choix
        choixReponses.append(unChoix);
    }

    //Modifier sa position en X
    positionX = 100;
    
    //Déclencher la requête d'animation
    requestAnimationFrame(animerSection);    
}

//Fonction pour animer la section des choix de réponses
function animerSection(){
    
    //Changer la position en X
    positionX -=2;
    sectionQuestion.style.transform = `translateX(${positionX}vw)`;

    //Déclencer une autre requête d'animation
    if (positionX > 0) {
        requestAnimationFrame(animerSection);
    }

    //Partir l'animation pour les sections selon l'ordre des questions
    animSection.style.animation = `anim-section-${numQuestion} 2s ease-in forwards`;
}

//Fonction pour vérifier la réponse choisie par le joueur et afficher la question suivante
function verifierReponse(event){

    //Désactiver la classe du choix de réponse
    choixReponses.classList.toggle('desactiver');

    //Valider la réponse
    let reponseChoisie = event.target.indexChoix;
    let bonneReponse = lesQuestions[numQuestion].bonneReponse;

    //Si la réponse choisie est la bonne
    if(reponseChoisie == bonneReponse){
        event.target.classList.add("reponse-succes");

        //Jouer le son de bonne réponse
        audio.sonBonneReponse.play();

        //Incrémenter le nombre de réponses justes pour le calcul du score à la fin du jeu
        nbReponsesJustes ++;
    }
    else{
        
        //Si la réponse sélectionnée par le joueur est mauvaise
        event.target.classList.add("reponse-echec");

        //Jouer le son de mauvaise réponse
        audio.sonMauvaiseReponse.play();
    }

    //Passer à la question suivante quand l'animation de sélection de choix de réponse est terminée
    event.target.addEventListener("animationend", passerProchaineQuestion)
}

//Fonction pour gérer l'affichage des questions suivantes
function passerProchaineQuestion(){

    //Réactiver les clics sur les choix de réponse
    choixReponses.classList.toggle('desactiver');

    //Incrémenter le numéro de la question pour afficher la suivante
    numQuestion++;

    //Afficher la dernière question s'il en reste une dans le tableau, sinon, le quiz est terminé et on affiche la fin du jeu
    if(numQuestion < lesQuestions.length){
        afficherQuestion();
    }
    else{
        afficherFinQuiz();
    }
}

//////////// localStorage pour enregistrer le meilleur score du joueur ///////////

//Variable pour afficher le meilleur score à la fin de chaque partie recommencée
let meilleurScore = localStorage.getItem("meilleurScoreEnregistre") || 0;

//Fonction pour afficher la fin du quiz lorsque toutes les questions du tableau ont été passées
function afficherFinQuiz(){

    //Retirer la zone d'affichage principale du quiz en mettant son display à "none"
    zoneQuiz.style.display = "none";

    //Créer une section pour afficher le score du joueur
    let sectionScore = document.createElement('section');

    //Afficher le score du joueur ainsi que son meilleur score par concaténation 
    sectionScore.innerText = "Le quiz est terminé! Votre score est de: " + nbReponsesJustes + '/' +  lesQuestions.length + " " + "Votre meilleur score à date est de: " + meilleurScore + '/' + lesQuestions.length;

    //Lui donner une classe
    sectionScore.classList.add("score");

    //Pour calculer le meilleur score selon le nombre de fois que le joueur à sélectionné la bonne réponse
    meilleurScore = Math.max(meilleurScore, nbReponsesJustes);

    //Enregistrer ce résultat dans le localStorage
    localStorage.setItem("meilleurScoreEnregistre", meilleurScore);

    //Jouer le son de fin de quiz
    audio.sonFinQuiz.play();

    ///////////Je voulais créer un message personnalisé selon chaque score, mais le texte s'empilait après chaque partie, alors j'ai laissé le code pour y revenir plus tard///////////
    //Afficher un message personnalisé selon le score du joueur en créant un nouveau conteneur div
    //let messagePerso = document.createElement('div');
    
    //Lui donner une classe
    //messagePerso.classList.add("message");

    //Selon le score obtenu par le joueur, un message différent sera affiché
    //console.log(messagePerso);

    /*if(nbReponsesJustes <=1){
        messagePerso.innerText = "Ouf! J'espère que l'extincteur d'incendie est à jour!";
    }

    if(nbReponsesJustes ==2){
        messagePerso.innerText = "Ça manque de sel...";
    }

    if(nbReponsesJustes ==3){
        messagePerso.innerText = "On ne devient pas chef du jour au lendemain! Il faut pratiquer encore un peu.";
    }

    if(nbReponsesJustes ==4){
        messagePerso.innerText = "Pas mal! La viande est juteuse et bien cuite!";
    }

    if(nbReponsesJustes ==5){
        messagePerso.innerText = "Bel effort! Vous n'êtes pas loin de votre première Étoile Michelin!";
    }

    if(nbReponsesJustes ==6){
        messagePerso.innerText = "Félicitations chef! Voici une Étoile Michelin!";
    }*/

    //Insérer cette section juste avant le bouton pour recommencer la partie
    btnRejouer.before(sectionScore);

    //Remettre la section de fin de quiz en affichage flex
    zoneFinQuiz.style.display = "flex";

    //Afficher le bouton pour recommencer la partie lorsque le quiz est terminé
    sectionScore.addEventListener('animationend', afficherBtnRejouer);
}

//Fonction pour afficher le bouton pour recommencer la partie
function afficherBtnRejouer() {
    btnRejouer.style.opacity = '1';
}

//Fonction pour recommencer la partie
function recommencerQuiz(){
    
    //Retourner à la première question
    numQuestion = 0;

    //Réinitialiser le nombre de réponses justes
    nbReponsesJustes = 0;

    //Enlever la section ayant la classe .score qui contient le résultat du joueur
    document.querySelector(".score").remove();

    //Cacher le bouton pour recommencer
    btnRejouer.style.opacity = "0";

    //Réafficher le conteneur principal du quiz
    zoneQuiz.style.display = "flex";

    //Retirer la zone de fin de quiz
    zoneFinQuiz.style.display = "none";

    //Afficher la première question
    afficherQuestion();
}