var finishState1 = {

    gameoversound1:undefined,
    prueba: 0,
    timer: undefined,
    auxiliar: undefined,
    puntuacionj1: undefined,

    create: function (){

        finishState1.gameoversound1 = game.add.audio('gameoversound');
        finishState1.gameoversound1.volume = 1;
        finishState1.gameoversound1.loop = false;
        finishState1.gameoversound1.play();

        this.timer = game.time.create(false);
        
        game.add.sprite(0, 0, 'go11');                //Añadimos el texto 

        var cursors = game.input.keyboard.addKey(Phaser.Keyboard.R);
        cursors.onDown.add(this.start, this);

<<<<<<< HEAD
        //Petición para la puntuación del JUGADOR 1
        playState.auxiliar = "6969";

    
=======
        // Get de la puntuación
        $.ajax({
        	method: "GET",
        	url: "http://127.0.0.1:8080/jugadores/0/puntos",
        });
        
>>>>>>> f219d2528ecbf1e39b0e864ef51a405751fca40d
        },


        start: function(){
            this.gameoversound1.pause();
            playState.vidaJ2 = 100;
            playState.vidaJ1 = 100;
            game.state.remove('menu');
            game.state.remove('play');
            game.state.remove('gameover1');
            game.state.add('menu2', menuState2);
            game.state.start('menu2');
        },
        
        update: function(){

            var txt = game.add.text(600, 555, "", optionStyle);
            var optionStyle = {font: '40pt  Lucida Console', fill: 'white', align: 'left'};
            txt = game.add.text(600, 555, playState.auxiliar, optionStyle);
            

            img1 = function(){
                playState.prueba = 0;
                this.timer.stop();
                game.add.sprite(0, 0, 'go11');
            }
            
            img2 = function(){
                playState.prueba = 1;
                this.timer.stop();            
                game.add.sprite(0, 0, 'go12');
            }

            if (playState.prueba == 0){
                this.timer.loop(500, img2, this);
                this.timer.start();
            }else {
                this.timer.loop(500, img1, this);
                this.timer.start();
            }
        }

}