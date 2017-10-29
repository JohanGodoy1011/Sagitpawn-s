var finishState2 = {
    
        create: function (){
            
            
            game.add.sprite(0, 0, 'go21');                //Añadimos el texto 
    
            var cursors = game.input.keyboard.addKey(Phaser.Keyboard.R);
            cursors.onDown.add(this.start, this);
    
            },
    
            start: function(){
                //Moreno help me pls
            },
            
    }