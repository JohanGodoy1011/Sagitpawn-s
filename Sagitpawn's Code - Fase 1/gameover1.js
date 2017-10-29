var finishState1 = {

    gameoversound1:undefined,

    create: function (){

        finishState1.gameoversound1 = game.add.audio('gameoversound');
        finishState1.gameoversound1.volume = 1;
        finishState1.gameoversound1.loop = false;
        finishState1.gameoversound1.play();
        
        game.add.sprite(0, 0, 'go11');                //Añadimos el texto 

        var cursors = game.input.keyboard.addKey(Phaser.Keyboard.R);
        cursors.onDown.add(this.start, this);

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
        

}