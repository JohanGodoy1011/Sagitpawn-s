var finishState2 = {
    
        create: function (){
            
            
            game.add.sprite(0, 0, 'go21');                //Añadimos el texto 
    
            var cursors = game.input.keyboard.addKey(Phaser.Keyboard.R);
            cursors.onDown.add(this.start, this);
    
            },
    
            start: function(){
                //game.camera.follow(playState.jugador2);
                playState.vidaJ1 = 20;
                //game.camera.setPosition(200,620);
                game.state.remove('menu');
                game.state.remove('play');
                game.state.remove('gameover2');
                game.state.add('menu2', menuState2);
                game.state.start('menu2');
            },
            
    }