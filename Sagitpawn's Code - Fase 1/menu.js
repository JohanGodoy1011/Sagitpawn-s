

var menuState = {

    sonidoini:undefined,
    boton: undefined,

    create: function (){

        menuState.sonidoini = game.add.audio('menuinisound');
        menuState.sonidoini.volume = 1;
        menuState.sonidoini.play();

        menuState.boton = game.add.audio('bot');

        game.add.sprite(0, 0, 'menubg');                //Añadimos el texto 

        var texto = game.add.bitmapText(game.world.centerX, 140, 'menu', 'Sagitpawns', 100);
        
        texto.anchor.set(0.5);
        
        var optionStyle = { font: '40pt Courier New', fill: 'red', align: 'left' };           //Estilo para los 'botones'
        //Creamos textos que funcionarán como botones
        var txt = game.add.text(game.world.centerX, 300, 'Jugar', optionStyle);
        txt.anchor.set(0.5);
        txt.inputEnabled = true;                            //Activamos el input
        txt.events.onInputOver.add(function (target) {      //Cuando pasamos el ratón por encima
            target.fill = "#000000";
         });
         txt.events.onInputOut.add(function (target) {      //Cuando el ratón se va
            target.fill = "red";
        });
        txt.events.onInputDown.add(this.start, this);       //Llamamos a la función start(), cuando clickamos en el texto

        var txt2 = game.add.text(game.world.centerX, 400, 'High Scores', optionStyle);
        txt2.anchor.set(0.5);
        txt2.inputEnabled = true;
        txt2.events.onInputOver.add(function (target) {
            target.fill = "#000000";
         });
        txt2.events.onInputOut.add(function (target) {
            target.fill = "red";
        });
        txt2.events.onInputDown.add(this.scores, this);

        var txt3 = game.add.text(game.world.centerX, 500, 'Salir', optionStyle);
        txt3.anchor.set(0.5);
        txt3.inputEnabled = true;
        txt3.events.onInputOver.add(function (target) {
            target.fill = "#000000";
         });
        txt3.events.onInputOut.add(function (target) {
            target.fill = "red";
        });
        txt3.events.onInputDown.add(this.close, this);

        var optionStyle2 = {font: '25pt  Lucida Console', fill: 'black', align: 'left'};
        var txt4 = game.add.text(10, 665, 'About us ® ', optionStyle2);
        txt4.inputEnabled = true;
        txt4.events.onInputOver.add(function (target) {
            target.fill = "#FFFFFF";
        });
        txt4.events.onInputOut.add(function (target) {
            target.fill = "#000000";
        });
        txt4.events.onInputDown.add(function (target){
            window.open("https://github.com/JorgeMS05/Sagitpawn-s", "_blank")
        });

        gofull = function() {
            
            if (game.scale.isFullScreen)
            {
                game.scale.stopFullScreen();
            }
            else
            {
                game.scale.startFullScreen(false);
            }

        },

        cursors = game.input.keyboard.addKey(Phaser.Keyboard.F);
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        cursors.onDown.add(gofull, this);
        
    },

    start: function(){
        this.boton.play();
        this.sonidoini.pause();
        game.state.add('play', playState);
        game.state.start('play');
    },
    

    close: function(){
        game.destroy();
    },

    scores: function(){
        game.state.add('highScore', highScore);
        game.state.start('highScore');
    }
}