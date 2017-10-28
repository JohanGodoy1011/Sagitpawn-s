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

        // Disparos versión 2
        game.load.image('bullet', 'bullet.png');
        game.load.image('shooter', 'Sprites/disparador.png'); 

        // Imágenes del borde del mapa
        game.load.image('sides', 'Imagenes/worldLimit.png'); 
        game.load.image('sky', 'Imagenes/topLimit.png'); 
        

    },

    create: function(){
        game.state.start('menu');
    },

}