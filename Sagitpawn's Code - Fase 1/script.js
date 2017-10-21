window.onload = function(){
    var game = new Phaser.Game(1100, 700, Phaser.AUTO, 'canvas', { preload: preload, create: create, update: update });
    
    var cursors;
    var solidos;
    var jugador1;
    //var jugador2;

    var suelo;
    var arrow;
    var ball;
    var catchFlag = false;
    var bolaON = false;
    var launchVelocity = 0;

    function preload() {
        game.load.image('fondo1', 'Imagenes/Background2.png');                      //Cargamos el la primera imagen de fondo.
        game.load.image('suelo', 'Imagenes/suelo1.png');                            //Cargamos el suelo.

        game.load.spritesheet('jugador1', 'Imagenes/dude.png', 32, 48);             //Cargamos el sprite del primer jugador.

        //Sprites para cargar las mierdas de las bolas
        game.load.image('arrow', 'Imagenes/longarrow2.png');
        game.load.image('ball', 'Imagenes/pangball.png');
        game.load.image('analog', 'Imagenes/fusia.png');

    }

   

    function create() {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 200;


        game.world.setBounds(0, 0, 2347, 833);                  //Delimitar los bordes del mapa para que funcione el movimiento de camara
        cursors = game.input.keyboard.createCursorKeys();

        game.add.sprite(0, 0, 'fondo1');                        //Agregamos el fondo al canvas
        
        solidos = game.add.group ();                            //Creamos el grupo de solidos
        solidos.enableBody = true;                              //Habilitamos las físicas para el grupo de sólidos

        suelo = solidos.create(0, game.world.height - 80, 'suelo');
        
        suelo.scale.setTo(1, 1);                               //Escalamos la plataforma, (no se como funciona xd)
        suelo.body.immovable = true;                           //Para que la plataforma no se caiga al colisionar con ella


        jugador1 = game.add.sprite(200, 400, 'jugador1');
        
        game.physics.arcade.enable(jugador1);

        jugador1.body.bounce.y = 0.2;        
        jugador1.body.gravity.y = 300;
        jugador1.body.collideWorldBounds = true;


        cursors = game.input.keyboard.createCursorKeys();

        //Vamos con la bola:
        analog = game.add.sprite(400, 350, 'analog');
        
        game.physics.enable(analog, Phaser.Physics.ARCADE);
        
        analog.body.allowGravity = false;
        analog.width = 8;
        analog.rotation = 220;
        analog.alpha = 0;
        analog.anchor.setTo(0.5, 0.0);
       
        //Físicas sobre la flecha
        arrow = game.add.sprite(400, 350, 'arrow');
        game.physics.enable(arrow, Phaser.Physics.ARCADE);
        
        arrow.anchor.setTo(0.1, 0.5);
        arrow.body.moves = false;
        arrow.body.allowGravity = false;
        arrow.alpha = 0;
            
            
        // Enable input.
        jugador1.inputEnabled = true;
        jugador1.input.start(0, true);
        jugador1.events.onInputDown.add(set);
        jugador1.events.onInputUp.add(launchBall);

        game.camera.follow(jugador1);

        

    }

    function set(ball, pointer) {
        
        ball.body.moves = false;
        ball.body.velocity.setTo(0, 0);
        ball.body.allowGravity = false;
        catchFlag = true;
        
    }
        
    function launchBall() {

        bolaON = true;

        //Parámetros de la bola
        ball = game.add.sprite(jugador1.x, jugador1.y, 'ball');
        game.physics.enable(ball, Phaser.Physics.ARCADE);
        ball.anchor.setTo(0.5, 0.5);
        ball.body.collideWorldBounds = true;
        ball.body.bounce.setTo(0.5, 0.5);

        catchFlag = false;
        ball.body.moves = true;
        arrow.alpha = 0;
        analog.alpha = 0;
        Xvector = (arrow.x - ball.x) * 3;
        Yvector = (arrow.y - ball.y) * 3;
        ball.body.allowGravity = true;  
        ball.body.velocity.setTo(Xvector, Yvector);

    }

    function update() {

        //Variable para detectar colisión jugador-solidos
        var hitPlatform = game.physics.arcade.collide(jugador1, solidos);
        //Variable para detectar colisión pelota-jugador:
        var hitJugador = game.physics.arcade.collide(jugador1, ball);
        //Movimiento del jugador 1
        jugador1.body.velocity.x = 0;

        
        if (cursors.left.isDown)
        {
           // Move to the left
            jugador1.body.velocity.x = -350;
        }
        else if (cursors.right.isDown)
        {
            //Move to the right
            jugador1.body.velocity.x = 350;
        }
        else
        {
            //Stand still
            jugador1.animations.stop();
        }
        
        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown)
        {
            jugador1.body.velocity.y = -350;
        }
        if (catchFlag == true)
        {
            //  Track the ball sprite to the mouse  
            analog.x = game.input.activePointer.worldX;   
            analog.y = game.input.activePointer.worldY;

            arrow.x = analog.x + 100;
            arrow.x = analog.y + 10;
                
            arrow.alpha = 2;    
            analog.alpha = 0.5;
            analog.rotation = arrow.rotation - 3.14 / 2;
            analog.height = game.physics.arcade.distanceToPointer(arrow);  
            launchVelocity = analog.height - 10;
        }
        if (hitJugador ){

            ball.kill();

        }

        //Definimos las condiciones que harán que la cámara siga al personaje/pelota
        if (bolaON == true){

            game.camera.follow(ball);

        }else {

            game.camera.follow(jugador1);

        }
    }
}
