var DarkSection = {

  /**
   * Values
   */

  // Settings for display of rotaiton
  config: {
    // Set ratio between .outer-slant and .inner-slant
    rotationRatio: .375,
    // Set minimum and maximum rotation.
    minRotation: 8,
    maxRotation: 18,
    // Set minimum and maximum width for min & max rotation values to be applied at.
    minWidth: 320,
    maxWidth: 1440
  },
  // For storing rotation values
  rotation: {},
  // Number of times elements had wrappers added to them.
  numWrappers: 0,
  // Slant padding. Use this for any negative padding needed for backgrounds.
  slantHeight: '',

  /**
   * Methods
   */

  init: function() {

    var windowWidth = $(window).width();
    this.addClassesToHTML();
    this.injectWrappersToHTML();

    this.setRotations(windowWidth);
    this.setPaddings(windowWidth);


  },
  onResize: function() {
    // Update window width.
    var windowWidth = $(window).width();

    // Take care of HTML
    DarkSection.addClassesToHTML();
    DarkSection.removeWrappersfromHTML();
    DarkSection.injectWrappersToHTML();


    // Update Rotations.
    DarkSection.setRotations(windowWidth);

    // Update Padding.
    DarkSection.setPaddings(windowWidth);
  },
  /**
   * @function
   * Add wrapper elements to div.content within a .dark element.
   * This function should only be called once on page load.
   */
  addClassesToHTML: function() {

    var query = Helper.getMediaQuery();

    $('[data-darksection]').addClass('dark');

    if ( query === 'small' ) {
      $('[data-darksection="medium-down"]').addClass('dark').removeClass('dark-off');
      $('[data-darksection="large-up"]').addClass('dark-off').removeClass('dark');
    }
    if ( query === 'medium' ) {
      $('[data-darksection="medium-down"]').addClass('dark').removeClass('dark-off');
      $('[data-darksection="large-up"]').addClass('dark-off').removeClass('dark');
    }
    if ( query === 'large' ) {
      $('[data-darksection="medium-down"]').addClass('dark-off').removeClass('dark');
      $('[data-darksection="large-up"]').addClass('dark').removeClass('dark-off');

    }
    if ( query === 'xlarge' ) {
      $('[data-darksection="medium-down"]').addClass('dark-off').removeClass('dark');
      $('[data-darksection="large-up"]').addClass('dark').removeClass('dark-off');
    }
  },
  injectWrappersToHTML: function() {
    // wrapping elements (this is for easy editing).
    // this.numWrappers  = ;

    if ( $('.dark:has(.content)') ) {
      $('.dark').not(':has(.slant-wrapper)').children('.content').wrap(function(i) {

        DarkSection.numWrappers++;

        var num = DarkSection.numWrappers;

        var wrappers = [
          '<div class="slant-wrapper" data-slantwrapper="'+num+'">',
          '<div class="slant-outer">',
          '<div class="slant-inner">',
          '<div class="content-wrapper">',
          '</div></div></div></div>'
        ];
        var output = wrappers.join('');

        return output;

      });

      Debug.function('addWrappersToHTML', this.numWrappers);
    }
  },
  removeWrappersfromHTML: function() {
    // if ( $('.dark-off:has(.slant-wrapper)') ) {
    var darkOff = $('.dark-off');

    if ( $('.dark-off:has(.slant-wrapper .slant-outer .slant-inner .content-wrapper)').not('.dark') ) {
      $('.dark-off:has(.slant-wrapper .slant-outer .slant-inner .content-wrapper) .content').unwrap().unwrap().unwrap().unwrap();
    }
  },
  modifyHTML: function() {
    this.addClassesToHTML();
  },
  getRotation: function(width) {

    // set for later
    var rotation;
    // Get ratio for degrees per pixel of width.
    var rotaionSteps = (this.config.maxRotation - this.config.minRotation) / (this.config.maxWidth - this.config.minWidth);

    // If viewport width is below minimum set width, rotation is set to max.
    // Else if viewport width is above maximum set width, rotation is set to min.
    // Else ratio is applied to calculate rotation based on width of viewport.
    if ( width <= this.config.minWidth ) {

      rotation = this.config.maxRotation;

    } else if ( width >= this.config.maxWidth ) {

      rotation = this.config.minRotation;

    } else {

      rotation = this.config.maxRotation - ((width - this.config.minWidth) * rotaionSteps);
    }
    var radians = Helper.toRadians(rotation);
    // Set values in rotation object.
    this.rotation = {
      outer: rotation,
      outerRadian: radians,
      inner: rotation * this.config.rotationRatio,
      content: rotation - (rotation * this.config.rotationRatio),
    };
  },
  getOuterSlantPadding: function( width ) {
    // Get angles.
    var angleA = this.rotation.outer;
    var angleB = angleA - (angleA * (1 - this.config.rotationRatio));
    // Get radians from angles.
    var radianA = this.rotation.outerRadian;
    var radianB = Helper.toRadians(angleB);
    // Get correct padding.
    var padding = Math.tan(radianB) * (Math.cos(radianA) * (width / 2));

    return padding;
  },
  getOuterSlantWidth: function( width, height ) {

    var radianA = this.rotation.outerRadian;
    // Fig 2. AC = cos(<BAC) * AB.
    var visibleWidth = Math.cos(radianA) * width;
    // Fig 1. AC = sin(<ABC) * BA.
    // Fig 1. AD = cos(<CAD) * AC.
    var widthToAdd = Math.cos(radianA) * (Math.sin(radianA) * height);
    // Get the true width of the rectangle.
    var trueWidth = visibleWidth + widthToAdd + widthToAdd;

    Debug.value('getOuterSlantWidth',
    {visibleWidth: visibleWidth, widthToAdd: widthToAdd, trueWidth: trueWidth}
    );

    return trueWidth;
  },
  getSectionPadding: function( width, height ) {

    var radianA = this.rotation.outerRadian;
    // Get width of rotated rectangle.
    var sectionWidth = this.getOuterSlantWidth( width, height );
    // Use this to store in accessible object value.
    var slantHeight = sectionWidth * Math.sin(radianA)
    // Get section height.
    var rotatedHeight = slantHeight + height * Math.cos(radianA);
    // Convert the new height into a usable padding value.
    var padding = (rotatedHeight - height) / 2;

    this.slantHeight = slantHeight;

    return padding;
  },
  setRotations: function( width ) {

    this.getRotation(width);

    var rotation = this.rotation;

    $('.slant-outer').css("transform", "rotate("+rotation.outer+"deg)");

    $('.slant-inner').css("transform", "rotate(-"+rotation.inner+"deg)");

    $('.content-wrapper').css("transform", "rotate(-"+rotation.content+"deg)");
  },
  setPaddings: function( width ) {
    // Get window width.
    // var width = $(window).width();
    // Get .slant-outer padding.
    var outerSlantPadding = this.getOuterSlantPadding( width );

    // Set .slant-outer padding.
    $('.slant-outer').css({"padding-top": outerSlantPadding, "padding-bottom": outerSlantPadding});

    // Loop through .dark sections and apply padding individually.
    for ( var i = 0; i < this.numWrappers; i++ ) {
      // Use these vars to set up a way to target .dark sections individually.
      var num = i + 1;
      var target = '[data-slantwrapper="'+num+'"]';

      // Get height of rectangle for use in section padding function.
      var height = $(target).height();
      // Get section padding using section height and window width.
      var sectionPadding = this.getSectionPadding(width, height);

      // Set .dark section padding to make up for incorrect height returned from CSS.
      $(target).css({"padding-top": sectionPadding, "padding-bottom": sectionPadding});
    }
  },
};
