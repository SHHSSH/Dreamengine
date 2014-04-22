﻿/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
simple Game class declaration example
**/

define( [ 'DREAM_ENGINE', 'DE.GuiLabel', 'DE.GuiImage' ],
function( DE, GuiLabel, GuiImage )
{
  var Game = {};
  
  Game.render  = null;
  Game.scene  = null;
  var _counter = null;
  var _timer = null;
  var screenW = 1280, screenH = 720;
  
  // init
  Game.init = function()
  {
    console.log( "init Engine" );
    DE.CONFIG.DEBUG_LEVEL = 5;
    // render
    Game.render = new DE.Render( "render", { width: screenW, height: screenH , fullScreen: "ratioStretch"} );
    Game.render.init();
    
    DE.start();
  }
  
  // start
  Game.start = function()
  {
    console.log( "hello, you killed a total of " + DE.SaveSystem.get( "ballKilled" ) + " balls" );
    Game.scene = new DE.Scene( "Test" );
    
    // camera
    Game.camera = new DE.Camera( screenW, screenH, 0, 0, { 'name': "Test zoom 100%", 'backgroundColor': "rgb(50,50,200)" } );
    Game.camera.scene = Game.scene;
    Game.camera.gui = new DE.Gui( Game.camera, { 'id': "Test" } );
    
    Game.render.add( Game.camera );
    Game.camera.lastOnMouseDown = function( e )
    {
      // for ( var i = 0; i < 50; ++i )
        addBall( Game, e.x, e.y );
    }
    // Create Balls
    Game.enemies = 0;
    _counter = new DE.GuiLabel( { 'id': "counter", 'x': 50, 'y': 100, "w": 200, "h": 50 }, "Balls" );
    _counter.onSetText = function( txt )
    {
      if ( txt == 0 )
        console.log( "winner" );
    }
    
    Game.camera.gui.add( _counter );
    
    var n = 25;
    for ( var i = 0; i < n; ++i )
      addBall( Game, Math.random() * screenW, Math.random()* screenH );
    
    setTimeout( function(){ DE.States.down( "isLoading" ); }, 200 );
  };
  
  function addBall( object, x, y )
  {
    var ball = new DE.GameObject( {
      "tag": "Ball", "x": x, "y": y
      , "renderer": new DE.CircleRenderer(
          { "method": "fillAndStroke"
            , "strokeColor": "white"
            , "fillColor": "rgb("+(Math.random()*255>>0)+","+(Math.random()*255>>0)+","+(Math.random()*255>>0)+")"
          }, 70, 0, Math.PI*2, true )
      , "collider": new DE.CircleCollider( 80 )
    } );
    ball.speedx = ( Math.random() * 5 + Math.random() * -5 ) * 2;
    ball.speedy = ( Math.random() * 5 + Math.random() * -5 ) * 2;
    ball.move = function()
    {
      this.translateX( this.speedx );
      this.translateY( this.speedy );
      
      if ( this.position.x > 1260 )
      {
        this.speedx = -this.speedx * ( 0.5 + Math.random() * 1 );
        this.position.x = 1260;
      }
      if ( this.position.x < 20 )
      {
        this.speedx = -this.speedx * ( 0.5 + Math.random() * 1 );
        this.position.x = 20;
      }
      if ( this.position.y > 700 )
      {
        this.speedy = -this.speedy * ( 0.5 + Math.random() * 1 );
        this.position.y = 700;
      }
      if ( this.position.y < 20 )
      {
        this.speedy = -this.speedy * ( 0.5 + Math.random() * 1 );
        this.position.y = 20;
      }
      
      this.speedx = ( this.speedx > 10 ) ? 10 : this.speedx;
      this.speedx = ( this.speedx < -10 ) ? -10 : this.speedx;
      this.speedy = ( this.speedy > 10 ) ? 10 : this.speedy;
      this.speedy = ( this.speedy < -10 ) ? -10 : this.speedy;
    }
    ball.addAutomatism( "move", "move" );
    ball.onMouseDown = function( e )
    {
      this.askToKill();
      DE.SaveSystem.save( "ballKilled", DE.SaveSystem.get( "ballKilled" ) + 1 );
      e.stopPropagation = true;
    }
    ball.onMouseMove = function( e )
    {
      // console.log( "moved on ball" );
    }
    ball.onKill = function()
    {
      Game.enemies--;
      _counter.setText( Game.enemies );
    }
    Game.enemies++;
    _counter.setText( Game.enemies );
    object.scene.add( ball );
  }
  window.Game = Game; // debug
  return Game;
} );