var game = new Phaser.Game(1200, 700, Phaser.AUTO, 'canvas', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('fondo1', 'Imagenes/fondoprueba.jpg');                    //Cargamos el la primera imagen de fondo.
    game.load.image('suelo', 'Imagenes/suelo.png');                          //Cargamos el suelo.

    game.load.spritesheet('jugador1', 'Imagenes/dude.png', 32, 48);       //Cargamos el sprite del primer jugador.

    game.load.image('bullet', 'Imagenes/bullet.png');                                
    game.load.spritesheet('explosion', 'Imagenes/explosion.png', 128, 128);
}

var solidos;
var jugador1;
var jugador2;

function create() {

    cursors = game.input.keyboard.createCursorKeys();

    game.add.sprite(0, 0, 'fondo1');       //Agregamos el fondo al canvas
    
    solidos = game.add.group ();            //Creamos el grupo de solidos
    solidos.enableBody = true;              //Habilitamos las físicas para el grupo de sólidos

    var suelo = solidos.create(0, game.world.height - 64, 'suelo');
    suelo.scale.setTo(2, 10);               //Escalamos la plataforma, (no se como funciona xd)
    suelo.body.immovable = true;            //Para que la plataforma no se caiga al colisionar con ella


    jugador1 = game.add.sprite(game.world.centerX, game.world.centerY, 'jugador1');
    game.camera.follow(jugador1, Phaser.Camera.FOLLOW_LOCKON); 


    game.physics.arcade.enable(jugador1);                         //Activamos las físicas

    jugador1.body.bounce.y = 0.2;        
    jugador1.body.gravity.y = 300;
    jugador1.body.collideWorldBounds = true;
}

function update() {
    var hitPlatform = game.physics.arcade.collide(jugador1, solidos);
    
    //Movimiento del jugador 1
    jugador1.body.velocity.x = 0;
    
        if (cursors.left.isDown)
        {
            //  Move to the left
            jugador1.body.velocity.x = -150;
    
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            jugador1.body.velocity.x = 150;
        }
        else
        {
            //  Stand still
            jugador1.animations.stop();
        }
    
        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown)
        {
            jugador1.body.velocity.y = -350;
        }
}
