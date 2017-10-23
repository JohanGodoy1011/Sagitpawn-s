window.onload = function(){
    
        var game = new Phaser.Game(1100, 700, Phaser.AUTO, 'canvas', { preload: preload, create: create, update: update });
       
        var solidos;

        // Creamos una variable para controlar los turnos de cada jugador
        var turn = true;

        // Creamos una variable grupal que concatene ambos jugadores:
        var player;
        var jugador1;
        var jugador2;

        // Creamos una variable grupal para los proyectiles: en proceso
        var ball;
        var ball1;
        var ball2;
        
    
        var suelo;
        var arrow;
        var catchFlag = false;
        var bolaON = false;
        var launchVelocity = 0;
    
        var barConfig;
        var barraJ1;
        var barraJ2;
        var vidaJ1 = 100;
        var vidaJ2 = 100;

        var hit = false;
        var diftime = 0;
        var elapsed = 0;

        function preload() {
    
            game.load.image('fondo1', 'Imagenes/Background2.png');                                  //Cargamos la primera imagen de fondo.
            game.load.image('suelo', 'Imagenes/suelo1.png');                                        //Cargamos el suelo.
    
            game.load.spritesheet('jugador1', 'Sprites/lanzer.png', 55, 75, 20);                    //Cargamos el spritesheet del primer jugador, la que será la animación 'idle'.
            game.load.spritesheet('j1Cargando', 'Sprites/lanzerCharging.png',55, 75, 8);            //Cargamos la animación del j1 para cargar 'charging'
            game.load.spritesheet('j1Disparando', 'Sprites/lanzerFire.png',55, 75, 20);             //Cargamos la animación del j1 para disparar 'fire'
            game.load.spritesheet('jugador2', 'Sprites/lanzer2.png', 55, 75, 20);                    //Cargamos el spritesheet del primer jugador, la que será la animación 'idle'.
            game.load.spritesheet('j2Cargando', 'Sprites/lanzer2Charging.png',55, 75, 8);
            // Falta generar un nuevo modelo para el jugador 2, hasta entonces se empleará el spritesheet j1Disparando
            // Preguntar duda acerca de como reacciona un spritesheet con:
            // sprite.rotation = game.physics.arcade.angleToPointer(sprite);

            //Sprites para cargar las mierdas de las bolas
            game.load.image('arrow', 'Imagenes/longarrow2.png');
            game.load.image('ball', 'Imagenes/pangball.png');
            game.load.image('analog', 'Imagenes/fusia.png');
    
        }
    
       
    
        function create() {
    
           
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.world.setBounds(0, 0, 2347, 833);                  //Delimitar los bordes del mapa para que funcione el movimiento de camara
            
            //////////////////////////////////////////
            // Agregación de elementos de la escena:
            //////////////////////////////////////////

            // Fondo
            game.add.sprite(0, 0, 'fondo1');                        
            // Suelo
            solidos = game.add.group ();                            //Creamos el grupo de solidos
            solidos.enableBody = true;                              //Habilitamos las físicas para el grupo de sólidos
            // Generamos el suelo(perteneciente a sólidos)
            suelo = solidos.create(0, game.world.height - 80, 'suelo');
            //suelo.scale.setTo(1, 1);                               //Escalamos la plataforma, (no se como funciona xd)
            suelo.body.immovable = true;                            //Para que la plataforma no se caiga al colisionar con ella
    
    
            //Vamos con la bola:
            analog = game.add.sprite(400, 350, 'analog');
            
            game.physics.enable(analog, Phaser.Physics.ARCADE);
            
            analog.body.allowGravity = true;
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
                
            game.camera.follow(jugador1);
    
            

            ///////////////////////////////
            // Gestión de jugadores:
            ///////////////////////////////

            // Creamos el grupo de jugadores. Activamos body para colisiones.
            player = game.add.group();
            player.enableBody = true;
            
            jugador1 = player.create(200, 680, 'jugador1');
            jugador2 = player.create(800, 680, 'jugador2');

            jugador1.animations.add('idle');                
            jugador1.animations.play('idle', 10, true);             //Cargamos la spritesheet para el jugador 1 y le damos nombre a la animación como idle.

            jugador2.animations.add('idle');                
            jugador2.animations.play('idle', 10, true);             //Cargamos la spritesheet para el jugador 2 y le damos nombre a la animación como idle.
    
            // Enable input para ambos jugadores
            jugador1.inputEnabled = true;
            jugador1.events.onInputDown.add(set);                   //Genera el objeto ball
            jugador1.events.onInputDown.add(setSprite);             //Cambia el spritesheet
            jugador1.events.onInputUp.add(launchBall);              //Dispara la bola y cambia nuevamente el spritesheet
    
            jugador2.inputEnabled = true;
            jugador2.events.onInputDown.add(set);
            jugador2.events.onInputDown.add(setSprite);                        
            jugador2.events.onInputUp.add(launchBall);


            //////////////////////////////////////////////////
            ///////////////// Barra de Vida///////////////////
            //////////////////////////////////////////////////
            
            //Página tutorial de la barra https://github.com/bmarwane/phaser.healthbar/blob/master/README.md
            
            barConfig = {width: 70,
                        height: 15,};   //Configuración para la barra

            barraJ1 = new HealthBar(this.game, barConfig);
            barraJ1.setPosition(jugador1.x + 20, jugador1.y - 10);

            barraJ2 = new HealthBar(this.game, barConfig);
            barraJ2.setPosition(jugador2.x + 20, jugador2.y - 10);
            
        }
    
        

        // Esta función genera un cuerpo ball (el proyectil)
        function set(ball) {
            ball.body.moves = false;
            ball.body.velocity.setTo(0, 0);
            ball.body.allowGravity = true;
            catchFlag = true; 
        }

        // Con el parámetro pointer sabemos donde clicamos y alteramos el spritesheet
        function setSprite(pointer) {
            if (pointer == jugador1){
                console.log("Jauja");
                chargeJ1();
            } else if (pointer == jugador2){
                console.log("Hola");
                chargeJ2();
            }
        }
    
        // El cuerpo ball creado en set se genera en el lugar donde se clica gracias a la info que nos da el parámetro pointer  
        function launchBall(pointer) {
    
            bolaON = true;

            // Dependiendo de dónde clickemos, generamos el proyectil en uno u otro sprite
            if (pointer == jugador1){
                ball = game.add.sprite(jugador1.x, jugador1.y, 'ball');
                idleJ1();                                                           // Activamos el spritesheet correspondiente al soltar
            } else {
                ball = game.add.sprite(jugador2.x, jugador2.y, 'ball');
                idleJ2();                                                           // Activamos el spritesheet correspondiente
            }

            //Parámetros de la bola
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
    
    
        //////////////////////////////////////////////////////
        // ///////Sistema de control de spritesheets j1://///
        /////////////////////////////////////////////////////

        function chargeJ1(){
            jugador1.loadTexture('j1Cargando', 0);
            jugador1.animations.add('charging');
            jugador1.animations.play('charging', 8, true);
        }
        /*
        function fireJ1(){
            jugador1.loadTexture('j1Disparando', 0);
            jugador1.animations.add('fire');
            jugador1.animations.play('fire', 8, true);
        }
        */
        function idleJ1(){
            jugador1.loadTexture('jugador1', 0);
            jugador1.animations.add('idle');
            jugador1.animations.play('idle', 8, true);
        }

        // Sistema de control de spritesheets j2:   modularizar proximamente
         function chargeJ2(){
            jugador2.loadTexture('j2Cargando', 0);
            jugador2.animations.add('charging');
            jugador2.animations.play('charging', 8, true);
        }
        /*
        function fireJ2(){
            jugador2.loadTexture('j1Disparando', 0);
            jugador2.animations.add('fire');
            jugador2.animations.play('fire', 8, true);
        }
        */
        function idleJ2(){
            jugador2.loadTexture('jugador2', 0);
            jugador2.animations.add('idle');
            jugador2.animations.play('idle', 8, true);
        }
    
        ///////////////////////////////////////////////////////
        //////Gestión vida y puntuación///////////////1///////
        ///////////////////////////////////////////////////////


        function colisionPelotaJ1(player, ball) {
            vidaJ1 -= 20;
            barraJ1.setPercent(vidaJ1);
        }

        function colisionPelotaJ2(player, ball) {
            vidaJ2 -= 20;
            barraJ2.setPercent(vidaJ2);
        }
    
        function update() {
            game.physics.arcade.overlap(jugador1, ball, colisionPelotaJ1, null, this);
            game.physics.arcade.overlap(jugador2, ball, colisionPelotaJ2, null, this);
            //Variable para detectar colisión jugador-solidos
            var hitPlatform = game.physics.arcade.collide(player, solidos);
            //Variable para detectar colisión pelota-jugador:
            var hitJugador = game.physics.arcade.collide(player, ball);
            //Variable para detectar colisión pelota-solidos:
            var hitBall = game.physics.arcade.collide(ball, solidos);
    

            // Control de eventos cuando se clica sobre el jugador
            if (catchFlag == true) {
                
                
                //  Track the ball sprite to the mouse  
                analog.x = game.input.activePointer.worldX;   
                analog.y = game.input.activePointer.worldY;
    
                arrow.x = analog.x + 100;
                arrow.x = analog.y + 10;
                    
                arrow.alpha = 2;    
                analog.alpha = 0.5;
                analog.rotation = arrow.rotation - 3.14 / 2;
                analog.height = game.physics.arcade.distanceToPointer(arrow);  
                launchVelocity = analog.height;
    
                launchVelocity = analog.height - 10;
            }

            //Cuando colisiona la pelota con el jugador, o cuando la pelota choca con el suelo.
            if (hitJugador || hitBall){
                hit = true;
                elapsed = 0;
                ball.kill();
                elapsed = game.time.totalElapsedSeconds()
                console.log(elapsed)
            }
            //Cuando ha habido colisión, se llama a este método para esperar 0.8 segundos antes de cambiar la cámara
            if (hit){ 
                diftime = game.time.totalElapsedSeconds() - elapsed;
                console.log(diftime);
                if (diftime >= 0.8){
                    hit = false;
                    bolaON = false;
                    turn = !turn;
                }
            }
    
            //Definimos las condiciones que harán que la cámara siga al personaje/pelota
            if (bolaON == true){
                game.camera.follow(ball);
            }else if(bolaON == false && turn == true) {
                game.camera.follow(jugador1);
            } else if(bolaON == false && turn == false) {
                game.camera.follow(jugador2);                
            }

            //Comprobaciones por si se ha acabado el juego
            if (vidaJ1 == 0 || vidaJ2 == 0){ /*Finalizamos el juego*/}
    
        }
    }