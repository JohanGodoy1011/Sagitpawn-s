
var menuState2 = {
    create: function (){

        game.add.sprite(0, 0, 'menubg');                //Añadimos el texto 

        var texto = game.add.bitmapText(game.world.centerX - 615, 140, 'menu', 'Sagitpawns', 100);
        
        texto.anchor.set(0.5);

        //text = game.add.bitmapText(game.world.centerX, 50, 'menu', '0', 128);
        //var titulo = game.add.bitmapText()
        
        var optionStyle = { font: '40pt TheMinion', fill: 'red', align: 'left' };           //Estilo para los 'botones'
        //Creamos textos que funcionarán como botones
        var txt = game.add.text(game.world.centerX - 615, 300, 'Jugar', optionStyle);
        txt.anchor.set(0.5);
        txt.inputEnabled = true;                            //Activamos el input
        txt.events.onInputOver.add(function (target) {      //Cuando pasamos el ratón por encima
            target.fill = "#FEFFD5";
         });
         txt.events.onInputOut.add(function (target) {      //Cuando el ratón se va
            target.fill = "red";
        });
        txt.events.onInputDown.add(this.start, this);       //Llamamos a la función start(), cuando clickamos en el texto

        var txt2 = game.add.text(game.world.centerX - 615, 400, 'Salir', optionStyle);
        txt2.anchor.set(0.5);
        txt2.inputEnabled = true;
        txt2.events.onInputOver.add(function (target) {
            target.fill = "#FEFFD5";
         });
        txt2.events.onInputOut.add(function (target) {
            target.fill = "red";
        });
        txt2.events.onInputDown.add(this.close, this);
        var optionStyle2 = {font: '25pt  Lucida Console', fill: 'black', align: 'left'};
        var txt3 = game.add.text(10, 665, 'About us ® ', optionStyle2);
        txt3.inputEnabled = true;
        txt3.events.onInputOver.add(function (target) {
            target.fill = "#FFFFFF";
        });
        txt3.events.onInputOut.add(function (target) {
            target.fill = "#000000";
        });
        txt3.events.onInputDown.add(function (target){
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
        game.state.add('play', playState);
        game.state.start('play');
        playState.bolaON = false;
        playState.turn = true;
    },

    close: function(){
        game.destroy();
    },
}