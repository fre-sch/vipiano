(function() {

  var NOTES = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ];

  var SCALES = {
    "major": [0,2,2,1,2,2,2,1],
    "minor": [0,2,1,2,2,1,2,2]
  };

  var CHORDS = {
    "major": [0,4,7],
    "minor": [0,3,7]
  };

  var piano_key = function(note) {
    return jQuery("<div><div class=\"piano-key-name\">"+note+"</div></div>")
      .attr("name",note)
      .addClass("piano-key")
      .addClass(note.match(/#$/) ? "piano-key-black" : "piano-key-white");
  };

  var piano_key_click = function(event) {
    var piano = jQuery(this);
    var octaves = piano.data("octaves");
    var key = jQuery(event.target);
    console.info(key.attr("name"));
  };

  /*
   * create a piano
   */
  jQuery.fn.piano = function(octaves) {
    return this.each(function() {
      var $this = jQuery(this);
      $this.data("piano", true);
      $this.data("octaves", octaves);
      $this.click(piano_key_click);
      for (var i = 0; i < octaves; ++i) {
        NOTES.map(piano_key).map(function(e) { $this.append(e); });
      }
    });
  };

  /*
   * highlight a chord on the piano
   */
  jQuery.fn.chord = function(options) {
    if (!this.data("piano")) {
      return this;
    }

    var settings = { "root": 0, "type": "major" };
    if (options) {
      jQuery.extend(settings, options);
    }

    var half_notes = this.data("octaves") * 12;
    var chord = false;
    if (this.data("scale")) {
    }
    else {
      chord = CHORDS[settings.type].map(function(e) {
        return (e + settings.root) % half_notes;
      });
    }
    if (chord) {
      this.each(function() {
        var $this = jQuery(this);
        $this
          .children()
          .toggleClass("chord", false)
          .map(function(i, elem) { if (chord.indexOf(i) != -1) return elem; })
          .addClass("chord");
      });
    }
    return this;
  };

  /*
   * highlight a scale on the piano
   */
  jQuery.fn.scale = function(options) {
    if (!this.data("piano")) {
      return this;
    }

    var settings = { "root": 0, "type": "major" };
    if (options) {
      jQuery.extend(settings, options);
    }
    this.data("scale", settings);
    var half_notes = this.data("octaves") * 12;
    var note = settings.root;
    var scale = SCALES[settings.type].map(function(e) {
      return (note += e) % half_notes;
    });
    return this.each(function() {
      var $this = jQuery(this);
      $this
        .children()
        .toggleClass("scale", false)
        .map(function(i, elem) { if (scale.indexOf(i) != -1) return elem; })
        .addClass("scale");
    });
  };

})();

jQuery(function() {
  jQuery("#piano2").piano(3).scale({"type":"minor"});
  jQuery("#piano1").piano(2).chord({"root": 0, "type": "minor"});
});