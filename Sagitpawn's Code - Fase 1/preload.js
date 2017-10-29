var loadState = {
    preload: function() {

        game.load.tilemap('MyTilemap', 'Map/mapafinal.csv', null, Phaser.Tilemap.CSV);
        game.load.image('tiles', 'Map/tileset.png');
        game.load.image('back', 'Imagenes/Background2.png');                                    //Cargamos la primera imagen de fondo.
        game.load.image('menubg', 'Imagenes/menu.jpg');

        // Sprites
        game.load.spritesheet('jugador1', 'Sprites/lanzer.png', 55, 75, 20);                    //Cargamos el spritesheet del primer jugador, la que será la animación 'idle'.
        game.load.spritesheet('j1Cargando', 'Sprites/lanzerCharging.png',55, 75, 8);            //Cargamos la animación del j1 para cargar 'charging'
        game.load.spritesheet('j1Disparando', 'Sprites/lanzerFire.png',55, 75, 20);             //Cargamos la animación del j1 para disparar 'fire'
        game.load.spritesheet('jugador2', 'Sprites/lanzer2.png', 55, 75, 20);                   //Cargamos el spritesheet del primer jugador, la que será la animación 'idle'.
        game.load.spritesheet('j2Cargando', 'Sprites/lanzer2Charging.png',55, 75, 8);
        
        game.load.bitmapFont('menu', 'Font/font.png', 'Font/font.fnt');

        //Imagenes para el menu
        game.load.image('menu', 'Imagenes/number-buttons-90x90.png', 270, 180);

        //Imagenes Game Over
        game.load.image('go11', 'Imagenes/gameover11.png', 270, 180);
        game.load.image('go12', 'Imagenes/gameover12.png', 270, 180);
        game.load.image('go21', 'Imagenes/gameover21.png', 270, 180);
        game.load.image('go22', 'Imagenes/gameover22.png', 270, 180);

        // Disparos versión 2
        game.load.image('bullet', 'Sprites/spear.png');
        game.load.image('shooter', 'Sprites/disparador1.png'); 

        // Imágenes del borde del mapa
        game.load.image('sides', 'Imagenes/worldLimit.png'); 
        game.load.image('sky', 'Imagenes/topLimit.png'); 

        //Luciernagas
        game.load.spritesheet('luz', 'Sprites/luz.png', 300, 300, 5);

        //Sonidos
        game.load.audio('musica', 'Sonido/Musica.mp3');
        game.load.audio('menuinisound', 'Sonido/MenuPrincipal.mp3');
        game.load.audio('gameoversound', 'Sonido/GameOver.mp3');
        game.load.audio('shoot', 'Sonido/Lanza.mp3');
        game.load.audio('bot', 'Sonido/Boton.mp3');
        
    },

    create: function(){
        game.state.add('menu', menuState);
        game.state.start('menu');
    },

}