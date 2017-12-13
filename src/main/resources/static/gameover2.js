var finishState2 = {
    
    gameoversound2:undefined,
    prueba: true,
    timer2: undefined,
    
    text: undefined,
    puntos: undefined,
    

    create: function (){

        this.timer2 = game.time.create(false);
        
        finishState2.gameoversound2 = game.add.audio('gameoversound');
        finishState2.gameoversound2.volume = 1;
        finishState2.gameoversound2.loop = false;
        finishState2.gameoversound2.play();
        
        game.add.sprite(0, 0, 'go22');                //Añadimos el texto 

        var cursors = game.input.keyboard.addKey(Phaser.Keyboard.R);
        cursors.onDown.add(this.start, this);
        
          
        },

        start: function(){
            this.gameoversound2.pause();
            playState.vidaJ1 = 100;
            playState.vidaJ2 = 100;            
            game.state.remove('menu');
            game.state.remove('play');
            game.state.remove('gameover2');
            game.state.add('menu2', menuState2);
            game.state.start('menu2');
            playState.puntuacionj1 = 0;
            playState.puntuacionj2 = 0;
        },
        
        
        update: function(){                

            img1 = function(){        
            	
            	finishState2.puntos = $.ajax({
                	method: "GET",
                	url: "http://127.0.0.1:8080/jugadores/puntos",
                	data: { changed: JSON.stringify() }, 
                    success: function(data) {
                        playState.text = game.add.bitmapText(595, 555, 'desyrel', data, 42);            //data not $data
                    },
                });
            	
            	
 
                console.log("Final");
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


