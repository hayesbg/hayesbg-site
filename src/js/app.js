// (function($){
// Set the padding for #about-us so the background displays correctly.
function responsiveActions() {
  // Get current Query.
  var query = Helper.getMediaQuery();

  var slantHeight = DarkSection.slantHeight;
  var negativeSlantHeight = '-' + slantHeight;

  if ( query === 'large' || query === 'xlarge' ) {
    $('#about-us').css({"padding-top": slantHeight + 'px', "padding-bottom": '0', "margin-top": negativeSlantHeight + 'px', "margin-bottom": '0',});

    $('footer .slant-outer').css({"margin-bottom": negativeSlantHeight + 'px'});

    $('footer .footer-logo').attr('src', '/assets/imgs/hbgi_logo_white.svg');

    $('main.site-inner').css({"padding-bottom": slantHeight + 'px', "margin-bottom": negativeSlantHeight + 'px',});

  } else {

    $('#about-us').css({"padding-top": slantHeight + 'px', "padding-bottom": slantHeight + 'px', "margin-top": negativeSlantHeight + 'px', "margin-bottom": negativeSlantHeight + 'px'});

    // $('footer ').css({"margin-bottom": '0', "padding-bottom": '0'});

    $('footer .footer-logo').attr('src', '/assets/imgs/hbgi_logo.svg');

    // console.log('else clause is on');

  }

  // console.log('negative margin:', negativeSlantHeight);

  // console.log('RA query is:', query);
}

$(document).ready(function() {

  // setDarkClasses('set');
  DarkSection.init();
  responsiveActions();

  var windowWidth = $(window).width();

  // console.log('Media query on load:', Helper.getMediaQuery());

  // Window resize event.
  $(window).resize(function() {

    // Check window width has actually changed and it's not just iOS triggering a resize event on scroll
    if ( $(window).width() != windowWidth ) {

      // Update the window width for next time
      windowWidth = $(window).width();

      // Do stuff here
      DarkSection.onResize();
      responsiveActions();
    }

    // console.log('Current media query:', Helper.getMediaQuery());

    // setDarkClasses('onResize');
    
  });


});



// })(jQuery);
