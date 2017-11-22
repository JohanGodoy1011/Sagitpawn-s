var highScore = {

    create: function (){
        game.add.sprite(0,0, "hs");

        var optionStyle = {font: '25pt  Lucida Console', fill: 'black', align: 'left'};          //Estilo para los 'botones'
        //Creamos textos que funcionarán como botones.
        //Hola comentario pa ver si se sube.
        var txt = game.add.text(10, 665, 'Atras', optionStyle);
        txt.inputEnabled = true;                            //Activamos el input
        txt.events.onInputOver.add(function (target) {      //Cuando pasamos el ratón por encima
            target.fill = "#FFFFFF";
         });
         txt.events.onInputOut.add(function (target) {      //Cuando el ratón se va
            target.fill = "000000";
        });
        txt.events.onInputDown.add(this.patras, this); 

        var texto = game.add.bitmapText(750, 100, 'menu', 'High Score:', 100);
        texto.anchor.set(0.5);
        var pene;



    },

    patras: function(){
        game.state.add('menu', menuState);
        game.state.start('menu');
    },
}