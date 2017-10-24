window.onload = function(){
    
        var game = new Phaser.Game(1100, 700, Phaser.AUTO, 'canvas', { preload: preload, create: create, update: update });
       

        // Creamos dos variables para controlar los turnos de cada jugador y la cámara
        var turn = true;
        var bolaON = false;

        // Creamos una variable grupal que concatene ambos jugadores:
        var player;
        var jugador1;
        var jugador2;

        // Variables para controlar la vida de cada personaje
        var barConfig;
        var barraJ1;
        var barraJ2;
        var vidaJ1 = 100;
        var vidaJ2 = 100;

        // Variables empleadas en cambios de cámara
        var hit = false;
        var diftime = 0;
        var elapsed = 0;
        var whoColision = 1;

        // Sistema de disparos
        var gun;
        var SHOT_DELAY;
        var BULLET_SPEED;
        var GRAVITY;
        var bulletPool;
        var timeOffset;
        var lastBulletShotAt;
        var bitmap;
        var bullet;

        // Variables del mapa
        var map;
        var layer;    



        function preload() {

            game.load.tilemap('MyTilemap', 'Map/mapafinal.csv', null, Phaser.Tilemap.CSV);
            game.load.image('tiles', 'Map/tileset.png');
            game.load.image('back', 'Imagenes/Background2.png');                                    //Cargamos la primera imagen de fondo.

            // Sprites
            game.load.spritesheet('jugador1', 'Sprites/lanzer.png', 55, 75, 20);                    //Cargamos el spritesheet del primer jugador, la que será la animación 'idle'.
            game.load.spritesheet('j1Cargando', 'Sprites/lanzerCharging.png',55, 75, 8);            //Cargamos la animación del j1 para cargar 'charging'
            game.load.spritesheet('j1Disparando', 'Sprites/lanzerFire.png',55, 75, 20);             //Cargamos la animación del j1 para disparar 'fire'
            game.load.spritesheet('jugador2', 'Sprites/lanzer2.png', 55, 75, 20);                   //Cargamos el spritesheet del primer jugador, la que será la animación 'idle'.
            game.load.spritesheet('j2Cargando', 'Sprites/lanzer2Charging.png',55, 75, 8);
            
            // Disparos versión 2
            game.load.image('bullet', 'bullet.png');
            game.load.image('shooter', 'Sprites/disparador.png');                                   //Cargamos una imagen (un pixel transparente) que se empleará como guía para las rotaciones (en funcion de la pos del raton)
    
        }
    
       
    
        function create() {
           
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.world.setBounds(0, 0, 2347, 833);                  //Delimitar los bordes del mapa para que funcione el movimiento de camara
            
            //////////////////////////////////////////
            ////// Elementos de la escena:///////////
            //////////////////////////////////////////

            // Fondo
            game.add.sprite(0, -13, 'back');                      
            
            map = game.add.tilemap('MyTilemap', 32, 32, 8, 8);
            map.addTilesetImage('tiles');
    
            layer = map.createLayer(0);

            map.setCollisionBetween(0,63);
           
            ///////////////////////////////
            // Gestión de jugadores:///////
            ///////////////////////////////

            // Creamos el grupo de jugadores. Activamos body para colisiones.
            player = game.add.group();
            player.enableBody = true;
            
            jugador1 = player.create(220, 620, 'jugador1');
            jugador1.anchor.setTo(0.5, 0.5); 
            jugador2 = player.create(2050, 620, 'jugador2');
            jugador2.anchor.setTo(0.5, 0.5); 
            // De momento no queremos que se muevan al colisionar con la bala
            player.setAll('body.immovable', true);
            // A pesar de immovable, siguen con su gravedad
            jugador1.body.gravity.y=300;
            jugador2.body.gravity.y=300;

            jugador1.animations.add('idle');                
            jugador1.animations.play('idle', 10, true);             //Cargamos la spritesheet para el jugador 1 y le damos nombre a la animación como idle.

            jugador2.animations.add('idle');                
            jugador2.animations.play('idle', 10, true);             //Cargamos la spritesheet para el jugador 2 y le damos nombre a la animación como idle.
    
            // Enable input para ambos jugadores
            jugador1.inputEnabled = true;
            jugador1.events.onInputDown.add(charge);
            //jugador1.events.onInputDown.add(drawTraj);                //Hay que llamrlo en update de alguna forma
            jugador1.events.onInputUp.add(shootBullet);         
            jugador1.events.onInputDown.add(setSprite);               //Cambia el spritesheet
            //jugador1.events.onInputUp.add(clean);


            jugador2.inputEnabled = true;
            jugador2.events.onInputDown.add(charge);
            //jugador2.events.onDragStart.add(drawTraj);                  //Hay que llamarlo en update de alguna forma
            jugador2.events.onInputUp.add(shootBullet);
            jugador2.events.onInputDown.add(setSprite); 
            //jugador2.events.onInputUp.add(clean);
            

            // Comenzamos siguiendo las acciones del jugador 1
            game.camera.follow(jugador1);


            //////////////////////////////////////////////////
            ///////////////// Barra de Vida///////////////////
            //////////////////////////////////////////////////  https://github.com/bmarwane/phaser.healthbar/blob/master/README.md
            
            //Configuración para la barra
            barConfig = {width: 70,
                        height: 15,};  

            barraJ1 = new HealthBar(this.game, barConfig);
            barraJ1.setPosition(jugador1.x + 20, jugador1.y - 10);

            barraJ2 = new HealthBar(this.game, barConfig);
            barraJ2.setPosition(jugador2.x + 20, jugador2.y - 10);

            
            // Gestión de trayectoria y disparos
            bitmap = game.add.bitmapData(game.width, game.height);
            bulletPool = game.add.group();
            bulletPool.enableBody = true;
            
        }
    

        function charge(pointer){
            
               // Creamos al cargar un sprite transparente donde clicamos, al mover el ratón el
               // ángulo respecto este sprite nos dará la dirección de la bala
               gun = game.add.sprite(pointer.x, pointer.y, 'shooter');
               SHOT_DELAY = 150;        // milliseconds podemos poner un delay tan grande como la trayectoria maxima
               GRAVITY = 980;           // pixels/second/second

               
               for(var i = 0; i < 1; i++) {
                   var bullet = bulletPool.create(jugador1.x, jugador1.y, 'bullet');
                   // Set its pivot point to the center of the bullet
                   bullet.anchor.setTo(0.5, 0.5);
                   // Set its initial state to "dead".
                   bullet.kill();
               }
   
               // Esto lo aplica al bitmap  ¿?¿?¿?
               bullet.body.gravity.y = GRAVITY;
   
               bitmap = game.add.bitmapData(game.width, game.height);
               bitmap.context.fillStyle = 'rgb(255, 255, 255)';
               bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
               game.add.image(0, 0, bitmap);

               //Ni zorra de lo que hace
               //game.input.activePointer.x = game.width/2;
               //game.input.activePointer.y = game.height/2 - 100;


        }


        
        // Función disparos v2. dibujado de trayectoria
        function drawTraj(){

            bitmap.context.clearRect(jugador1.x, jugador1.y, game.width, game.height);
            bitmap.context.fillStyle = 'rgba(255, 255, 255, 0.5)';
            var MARCH_SPEED = 40; // Smaller is faster
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

            //Marcamos la velocidad de disparo. Tendrá un límite -> 1800 (velocidad mirada a ojo, te pasas si lo cargas a full)
            var max = 1800;
            var min = 250;
            BULLET_SPEED = game.physics.arcade.distanceToPointer(pointer) * 10;
            if (BULLET_SPEED >= max){BULLET_SPEED = max;}
            if (BULLET_SPEED <= min){BULLET_SPEED = min;}


            if (lastBulletShotAt === undefined) {
                console.log("Juaja time");
                lastBulletShotAt = 0;
            }
            if (game.time.now - lastBulletShotAt < SHOT_DELAY) 
                return;
            lastBulletShotAt = game.time.now;

            bullet = bulletPool.getFirstDead();
            if (bullet === null || bullet === undefined) 
            return;
            
            bullet.revive();

            bullet.checkWorldBounds = true;
            bullet.outOfBoundsKill = true; 
        
            // Reasignamos la orientación de la bala en función del ángulo del sprite 'disparador'
            bullet.reset(gun.x, gun.y);
            bullet.rotation = gun.rotation;
            // Se carga el disparo en dirección contraria al desplazamiento del ratón
            bullet.body.velocity.x = Math.cos(bullet.rotation) * -BULLET_SPEED;
            bullet.body.velocity.y = Math.sin(bullet.rotation) * -BULLET_SPEED;

            // Cambio de sprites
            if (pointer == jugador1){
                whoColision = 1;
                idleJ1();
            } else if(pointer == jugador2){
                whoColision = 2;
                idleJ2();
            }

            bolaON = true;

            
        }

        function clean(){
            bitmap.context.clearRect(0, 0, game.width, game.height);
        }



        function update(){
           
            console.log(whoColision);
            // Colisiones jugador con el mapa
            game.physics.arcade.collide(player, layer);
            // Colisiones bullet con el mapa
            var hitGround = game.physics.arcade.collide(bulletPool, layer);
            var hitJugador = game.physics.arcade.collide(player, bullet);

            bulletPool.forEachAlive(function(bullet) {
                bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
            }, this);

            if (gun != undefined){
                gun.rotation = game.physics.arcade.angleToPointer(gun);
                drawTraj();     
                if (bullet != undefined){
                    //Variable para detectar colisión pelota-jugador:
                    //console.log("Angerfist - Incoming");
                    game.physics.arcade.overlap(jugador1, bullet, colisionPelotaJ1, null, this);
                    game.physics.arcade.overlap(jugador2, bullet, colisionPelotaJ2, null, this); 
                }
            } 
            if (hitJugador || hitGround) {
                hit = true;
                elapsed = 0;
                bullet.kill();
                elapsed = game.time.totalElapsedSeconds();
            }

            //Cuando ha habido colisión, se llama a este método para esperar 0.8 segundos antes de cambiar la cámara
            if (hit){ 
                diftime = game.time.totalElapsedSeconds() - elapsed;
                if (diftime >= 0.8){
                    hit = false;
                    bolaON = false;
                }
            }

            if (bolaON == true){
                game.camera.follow(bullet);
            }else if(bolaON == false && turn == true) {
                game.camera.follow(jugador1);
            } else if(bolaON == false && turn == false) {
                game.camera.follow(jugador2);                
            }


            //Comprobaciones por si se ha acabado el juego
            if (vidaJ1 == 0 || vidaJ2 == 0){ 
                //Saltamos
            }

        }

        function colisionPelotaJ1(player, bullet) {
            vidaJ1 -= 20;
            barraJ1.setPercent(vidaJ1);
        }

        function colisionPelotaJ2(player, bullet) {
            vidaJ2 -= 20;
            barraJ2.setPercent(vidaJ2);
        }

        /*
        function colisionBalaJugador(player, bullet){
            if (player == jugador1){
                vidaJ1 -= 20;
                barraJ1.setPercent(vidaJ1);
            }else if (player == jugador2){
                vidaJ2 -= 20;
                barraJ2.setPercent(vidaJ2);
            }
            bullet.kill();
        }*/


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

}