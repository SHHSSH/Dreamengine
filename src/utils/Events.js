define( [
 'eventemitter3'
],
function( EventEmitter )
{
  var Events = new EventEmitter();
  Events.Emitter = EventEmitter;
  Events.DEName = "Events";
  
  Events.trigger = Events.emit;
  return Events;
} );