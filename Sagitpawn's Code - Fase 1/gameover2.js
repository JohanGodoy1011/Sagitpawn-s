var finishState2 = {
    
        prueba: true,
        timer2: undefined,

        create: function (){
    
            this.timer2 = game.time.create(false);
            game.add.sprite(0, 0, 'go21');                //Añadimos el texto 
    
            var cursors = game.input.keyboard.addKey(Phaser.Keyboard.R);
            cursors.onDown.add(this.start, this);
    
        },
    
        start: function(){
            playState.vidaJ1 = 20;
            game.state.remove('menu');
            game.state.remove('play');
            game.state.remove('gameover1');
            game.state.add('menu2', menuState2);
            game.state.start('menu2');
        },
    
        update: function(){
    
            img1 = function(){             
                playState.prueba = true;
                game.add.sprite(0, 0, 'go21');
                this.timer2.stop();
            }
            
            img2 = function(){
                playState.prueba = false;            
                game.add.sprite(0, 0, 'go22');
                this.timer2.stop();
                
            }
    
            if (playState.prueba == true){
                this.timer2.loop(500, img2, this);
                this.timer2.start();
            }else {
                this.timer2.loop(500, img1, this);
                this.timer2.start();
            }
        },
            
    
    }