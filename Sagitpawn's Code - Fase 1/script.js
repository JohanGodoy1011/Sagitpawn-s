window.onload = function(){
    
        var game = new Phaser.Game(1100, 700, Phaser.AUTO, 'canvas', { preload: preload, create: create, update: update });
       
        var solidos;

        // Creamos una variable para controlar los turnos de cada jugador
        var turn = true;

        // Creamos una variable grupal que concatene ambos jugadores:
        var player;
        var jugador1;
        var jugador2;

        /* Codigo disparo v1
        // Creamos una variable grupal para los proyectiles: en proceso
        var ball;
        var ball1;
        var ball2;
        */
    
        var suelo;/*
        var arrow;
        var catchFlag = false;
        var bolaON = false;
        var launchVelocity = 0;
        */

        var barConfig;
        var barraJ1;
        var barraJ2;
        var vidaJ1 = 100;
        var vidaJ2 = 100;

        var hit = false;
        var diftime = 0;
        var elapsed = 0;


        // Sistema de disparos versión dos: desprototipado loco
        var gun;
        var SHOT_DELAY;
        var BULLET_SPEED;
        var GRAVITY;
        //var NUMBER_OF_BULLETS;  -> sustituido por 1
        var bulletPool;
        var timeOffset;
        var lastBulletShotAt;
        var bitmap;

        // Variables del mapa
        var map;
        var layer;    

        function preload() {

            game.load.tilemap('MyTilemap', 'Map/mapafinal.csv', null, Phaser.Tilemap.CSV);
            game.load.image('tiles', 'Map/tileset.png');
            game.load.image('back', 'Imagenes/Background2.png');
                                              //Cargamos la primera imagen de fondo.
            //game.load.image('suelo', 'Imagenes/suelo1.png');                                        //Cargamos el suelo.
    
            game.load.spritesheet('jugador1', 'Sprites/lanzer.png', 55, 75, 20);                    //Cargamos el spritesheet del primer jugador, la que será la animación 'idle'.
            game.load.spritesheet('j1Cargando', 'Sprites/lanzerCharging.png',55, 75, 8);            //Cargamos la animación del j1 para cargar 'charging'
            game.load.spritesheet('j1Disparando', 'Sprites/lanzerFire.png',55, 75, 20);             //Cargamos la animación del j1 para disparar 'fire'
            game.load.spritesheet('jugador2', 'Sprites/lanzer2.png', 55, 75, 20);                    //Cargamos el spritesheet del primer jugador, la que será la animación 'idle'.
            game.load.spritesheet('j2Cargando', 'Sprites/lanzer2Charging.png',55, 75, 8);

            //Sprites para cargar las mierdas de las bolas
            game.load.image('arrow', 'Imagenes/longarrow2.png');
            game.load.image('ball', 'Imagenes/pangball.png');
            game.load.image('analog', 'Imagenes/fusia.png');


            ////////////////////////
            // Disparos versión 2
            game.load.image('bullet', 'bullet.png');
            //game.load.image('ground', 'ground.png');
            //game.load.image('explosion', 'explosion.png', 128, 128);

    
        }
    
       
    
        function create() {
    
           
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.world.setBounds(0, 0, 2347, 833);                  //Delimitar los bordes del mapa para que funcione el movimiento de camara
            
            //////////////////////////////////////////
            // Agregación de elementos de la escena:
            //////////////////////////////////////////

            // Fondo
            game.add.sprite(0, -13, 'back');                      
            // Suelo
            //solidos = game.add.group ();                            //Creamos el grupo de solidos
            //solidos.enableBody = true;                              //Habilitamos las físicas para el grupo de sólidos
            // Generamos el suelo(perteneciente a sólidos)
            //suelo = solidos.create(0, game.world.height - 80, 'suelo');
            //suelo.scale.setTo(1, 1);                               //Escalamos la plataforma, (no se como funciona xd)
            //suelo.body.immovable = true;                             //Para que la plataforma no se caiga al colisionar con ella
            
            map = game.add.tilemap('MyTilemap', 32, 32, 8, 8);
            map.addTilesetImage('tiles');
    
            layer = map.createLayer(0);

            map.setCollisionBetween(0,63);

            /*
            //Vamos con la bola:
            analog = game.add.sprite(400, 350, 'analog');
            
            game.physics.enable(analog, Phaser.Physics.ARCADE);
            
            analog.body.allowGravity = true;
            analog.width = 8;
            analog.rotation = 220;
            analog.alpha = 0;
            analog.anchor.setTo(0.5, 0.0);
            */      

            ///////////////////////////////
            // Gestión de jugadores:
            ///////////////////////////////

            // Creamos el grupo de jugadores. Activamos body para colisiones.
            player = game.add.group();
            player.enableBody = true;
            
            
            jugador1 = player.create(200, 300, 'jugador1');
            jugador2 = player.create(800, 300, 'jugador2');

            jugador1.body.gravity.y=300;
            jugador2.body.gravity.y=300;

            jugador1.animations.add('idle');                
            jugador1.animations.play('idle', 10, true);             //Cargamos la spritesheet para el jugador 1 y le damos nombre a la animación como idle.

            jugador2.animations.add('idle');                
            jugador2.animations.play('idle', 10, true);             //Cargamos la spritesheet para el jugador 2 y le damos nombre a la animación como idle.
    
            // Enable input para ambos jugadores
            jugador1.inputEnabled = true;
            //Código de disparo v2
            jugador1.events.onInputDown.add(charge);
            jugador1.events.onDragStart.add(drawTraj);                  //Hay que llaamrlo en update de alguna forma
            jugador1.events.onInputUp.add(shootBullet);         
            //jugador1.events.onInputDown.add(set);                   //Genera el objeto ball
            jugador1.events.onInputDown.add(setSprite);             //Cambia el spritesheet
            //jugador1.events.onInputUp.add(launchBall);              //Dispara la bola y cambia nuevamente el spritesheet
            jugador1.events.onInputUp.add(clean);


            jugador2.inputEnabled = true;
            jugador2.events.onInputDown.add(charge);
            jugador2.events.onDragStart.add(drawTraj);                  //Hay que llaamrlo en update de alguna forma
            jugador2.events.onInputUp.add(shootBullet);
            //jugador2.events.onInputDown.add(set);
            jugador2.events.onInputDown.add(setSprite);                        
            //jugador2.events.onInputUp.add(launchBall);

            game.camera.follow(jugador1);
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


            /*
            //Físicas sobre la flecha
            arrow = game.add.sprite(player.x, player.y, 'arrow');
            game.physics.enable(arrow, Phaser.Physics.ARCADE);
            
            //arrow.anchor.setTo(0.1, 0.5);
            arrow.body.moves = false;
            arrow.body.allowGravity = false;
            arrow.alpha = 0;
            */



            ////////////////////////////////////////  Código Disparo v2 ////////////////////////////////////////////
            /*
            // Define constants
            SHOT_DELAY = 300; // milliseconds (10 bullets/3 seconds)
            BULLET_SPEED = 800; // pixels/second
            GRAVITY = 980; // pixels/second/second

            gun = game.add.sprite(jugador1.x, jugador1.y, 'bullet');
            //gun.anchor.setTo(0.5, 0.5);

            bulletPool = game.add.group();
            
            bulletPool.enableBody = true;
            
            for(var i = 0; i < 1; i++) {
                // Create each bullet and add it to the group.
                
                var bullet = bulletPool.create(0, 0, 'bullet');
        
                // Set its pivot point to the center of the bullet
                bullet.anchor.setTo(0.5, 0.5);
        
                // Enable physics on the bullet
                //game.physics.enable(bullet, Phaser.Physics.ARCADE);
        
                // Set its initial state to "dead".
                bullet.kill();
            }

            // Esto lo aplica al bitmap
            bullet.body.gravity.y = GRAVITY;
            //
            //gun.body.gravity.y = GRAVITY;


            bitmap = game.add.bitmapData(game.width, game.height);
            bitmap.context.fillStyle = 'rgb(255, 255, 255)';
            bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
            game.add.image(0, 0, bitmap);


            game.input.activePointer.x = game.width/2;
            game.input.activePointer.y = game.height/2 - 100;*/
            /////////////////////////////////////////////////////////////
            bitmap = game.add.bitmapData(game.width, game.height);
            gun = game.add.sprite(jugador1.x, jugador1.y, 'bullet');
            bulletPool = game.add.group();
            bulletPool.enableBody = true;
            
        }
    

        function charge(){
            
               // Define constants
               SHOT_DELAY = 300; // milliseconds (10 bullets/3 seconds)
               BULLET_SPEED = 800; // pixels/second
               GRAVITY = 980; // pixels/second/second
   
               //gun = game.add.sprite(jugador1.x, jugador1.y, 'bullet');
               //gun.anchor.setTo(0.5, 0.5);
   
               //bulletPool = game.add.group();
               //bulletPool.enableBody = true;
               
               for(var i = 0; i < 1; i++) {
                   // Create each bullet and add it to the group.
                   /*
                   var bullet = game.add.sprite(0, 0, 'bullet');
                   bulletPool.add(bullet);*/
                   var bullet = bulletPool.create(0, 0, 'bullet');
           
                   // Set its pivot point to the center of the bullet
                   bullet.anchor.setTo(0.5, 0.5);
           
                   // Enable physics on the bullet
                   //game.physics.enable(bullet, Phaser.Physics.ARCADE);
           
                   // Set its initial state to "dead".
                   bullet.kill();
               }
   
               // Esto lo aplica al bitmap
               bullet.body.gravity.y = GRAVITY;
               //
               //gun.body.gravity.y = GRAVITY;
   
   
               bitmap = game.add.bitmapData(game.width, game.height);
               bitmap.context.fillStyle = 'rgb(255, 255, 255)';
               bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
               game.add.image(0, 0, bitmap);
   
   
               game.input.activePointer.x = game.width/2;
               game.input.activePointer.y = game.height/2 - 100;


        }


        
        // Función disparos v2. dibujado de trayectoria
        function drawTraj(){
            bitmap.context.clearRect(0, 0, game.width, game.height);
            bitmap.context.fillStyle = 'rgba(255, 255, 255, 0.5)';
            var MARCH_SPEED = 10; // Smaller is faster
            timeOffset = timeOffset + 1 || 0;
            timeOffset = timeOffset % MARCH_SPEED;

            var correctionFactor = 0.99;
            var theta = -gun.rotation;
            var x = 0;
            var y = 0;
            for(var t = 0 + timeOffset/(1000*MARCH_SPEED/60); t < 3; t += 0.03) {
                x = BULLET_SPEED * t * Math.cos(theta) * correctionFactor;
                y = BULLET_SPEED * t * Math.sin(theta) * correctionFactor - 0.5 * GRAVITY * t * t;
                bitmap.context.fillRect(x + player.x, player.y - y, 3, 3);
                if (y < -15) 
                break;
            }
        
            bitmap.dirty = true;

        }


        function shootBullet(pointer){
            if (lastBulletShotAt === undefined) {
                console.log("Juaja time");
                lastBulletShotAt = 0;
            }
            if (game.time.now - lastBulletShotAt < SHOT_DELAY) 
                return;
            lastBulletShotAt = game.time.now;

            var bullet = bulletPool.getFirstDead();
            if (bullet === null || bullet === undefined) 
            return;
            
            bullet.revive();

            bullet.checkWorldBounds = true;
            bullet.outOfBoundsKill = true;
        
            // Set the bullet position to the gun position.
            bullet.reset(gun.x, gun.y);
            bullet.rotation = gun.rotation;
        
            // Shoot it in the right direction
            bullet.body.velocity.x = Math.cos(bullet.rotation) * BULLET_SPEED;
            bullet.body.velocity.y = Math.sin(bullet.rotation) * BULLET_SPEED;
            bitmap.context.clearRect(0, 0, game.width, game.height);

            // Cambio de sprites
            if (pointer == jugador1){
                idleJ1();
            } else if(pointer == jugador2){
                idleJ2();
            }

            
        }

        function clean(){
            bitmap.context.clearRect(0, 0, game.width, game.height);
        }

        function update(){
            
            drawTraj();

            //Variable para detectar colisión jugador-solidos
            //var hitPlatform = game.physics.arcade.collide(player, solidos);
            //Variable para detectar colisión pelota-jugador:
            //var hitJugador = game.physics.arcade.collide(player, ball);
            //Variable para detectar colisión pelota-solidos:
            //var hitBall = game.physics.arcade.collide(ball, solidos);
            
            game.physics.arcade.collide(player, layer, /*function(player){
            player.body.gravity.y=0;}*/);
            game.physics.arcade.collide(bulletPool, layer, function(bullet){
                bullet.kill();});
            
            game.physics.arcade.collide(bulletPool, function(bullet) {
                // Create an explosion
                //this.getExplosion(bullet.x, bullet.y);
        
                // Kill the bullet
                bullet.kill();
            }, null, this);

            bulletPool.forEachAlive(function(bullet) {
                bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
            }, this);

            gun.rotation = game.physics.arcade.angleToPointer(gun);
            //bitmap.context.clearRect(0, 0, game.width, game.height);
            

        }
        ////////////////////////////////////////////////////////////////////////////////////////////





        /////////////////////////////////  Código Disparo v1 ///////////////////////////////

        /*
        // Esta función genera un cuerpo ball (el proyectil)
        function set(ball) {
            ball.body.moves = false;
            ball.body.velocity.setTo(0, 0);
            ball.body.allowGravity = true;
            catchFlag = true; 
        }
*/
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
    /*
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
        
    */
        //////////////////////////////////////////////////////
        // ///////Sistema de control de spritesheets j1://///
        /////////////////////////////////////////////////////

        function chargeJ1(){
            jugador1.loadTexture('j1Cargando', 0);
            jugador1.animations.add('charging');
            jugador1.animations.play('charging', 8, true);
        }
        
        function fireJ1(){
            jugador1.loadTexture('j1Disparando', 0);
            jugador1.animations.add('fire');
            jugador1.animations.play('fire', 8, true);
        }
        
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
        
        function fireJ2(){
            jugador2.loadTexture('j1Disparando', 0);
            jugador2.animations.add('fire');
            jugador2.animations.play('fire', 8, true);
        }
        
        function idleJ2(){
            jugador2.loadTexture('jugador2', 0);
            jugador2.animations.add('idle');
            jugador2.animations.play('idle', 8, true);
        }
    /*
        ///////////////////////////////////////////////////////
        //////Gestión vida y puntuación////////////////////////
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
            if (vidaJ1 == 0 || vidaJ2 == 0){ /*Finalizamos el juego}
    
        }*/
        
    }