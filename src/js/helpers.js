var Helper = {

  /**
   * Convert degrees to radians.
   *
   * @param  {integer} rotation Degree of rotation.
   *
   * @return {integer}          Radian of rotation.
   */
  toRadians: function( rotation ) {

    var y = (rotation * Math.PI) / 180;

    return y;
  },
  /**
   * Get current media query based on font-size value set in CSS Stylesheet.
   *
   * @return {string} Media query name, which is the same as SCSS variable name.
   */
  getMediaQuery: function() {

    var windowInEms = $(window).width() / parseFloat($('html').css('font-size'));
    console.log('value for check is:', windowInEms);

    var i = 0;
    var queries = ['small', 'medium', 'large', 'xlarge'];

    if ( windowInEms > 40 ) { // Medium
      i++;
    }
    if ( windowInEms > 60 ) { // Large
      i++;
    }
    if ( windowInEms > 90 ) { // Extra Large
      i++;
    }

    console.log('value of i is:', i);
    var query = queries[i];

    return query;
  }

};
