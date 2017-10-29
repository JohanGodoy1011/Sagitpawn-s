var finishState2 = {
    
    gameoversound2:undefined,

    create: function (){
        
        finishState2.gameoversound2 = game.add.audio('gameoversound');
        finishState2.gameoversound2.volume = 1;
        finishState2.gameoversound2.loop = false;
        finishState2.gameoversound2.play();
        
        game.add.sprite(0, 0, 'go21');                //Añadimos el texto 

        var cursors = game.input.keyboard.addKey(Phaser.Keyboard.R);
        cursors.onDown.add(this.start, this);

        },

        start: function(){
            this.gameoversound2.pause();
            playState.vidaJ1 = 20;
            game.state.remove('menu');
            game.state.remove('play');
            game.state.remove('gameover2');
            game.state.add('menu2', menuState2);
            game.state.start('menu2');
        },
            
    }