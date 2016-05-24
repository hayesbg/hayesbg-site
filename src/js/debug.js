var Debug = {

  /**
   * Toggle objects debug mode.
   * @type {Boolean}
   */
  isDebug: true,

  /**
   * @function
   * Check if function has been called and what it returned.
   * @param  {String}         functionName Function name.
   * @param  {Boolean/string} output   =             false The return of the function, or false.
   */
  function: function( functionName, output ) {

    if ( this.isDebug ) {

      if ( output === 'undefined' ) {
        console.log( functionName + ' has been called. Function has no return');
      } else {
        console.log( functionName + ' has been called. Returned: ' + output );
      }
    }
  },
  value: function( functionName, valueName ) {

    if ( this.isDebug ) {
      console.log( 'Within ' + functionName + ':' );

      for ( var key in valueName ) {
        console.log( key, 'is: ', valueName[key]);
      }

    }
  }
};
