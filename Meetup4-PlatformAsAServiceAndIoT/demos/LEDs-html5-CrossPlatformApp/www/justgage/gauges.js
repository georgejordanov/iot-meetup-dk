/*
 * Copyright (C) 2013-2014 Intel Corporation. All rights reserved.
 */

/*
 * This script initializes JustGage widgets within your app
 *
 *
 * All JustGage widgets are exposed through a global object: window.Gauges,
 * and may be retrieved via its `getById` method:
 *
 *   var gauge = Gauges.getById('fuel');
 *
 *
 * To update the value of a gauge:
 *
 *   gauge.refresh(50);
 *
 *
 * Methods on the `Gauges` object:
 *
 *   Gagues.getById(String) - returns a JustGage object
 *   Gauges.forEachNode(Function) - passes each container node to a function
 *   Gauges.forEachWidget(Function) - passes each JustGage object to a function
 *   Gauges.initAllNodes(Boolean) - initialize all container nodes with JustGage
 *   Gauges.preinit() - user-defined function to execute before init
 *
 *
 * For more information, see the JustGage documentation:
 *   http://justgage.com
 *   https://github.com/toorshia/justgage
 */

(function(JustGage) {
  'use strict';

  var gaugeWidgets = {};
  window.Gauges = window.Gauges || {};

  // Values to be fetched from Gauge options when it's not a reset/reinit
  var saved_attributes = ['value', 'title','datafeedValue', 'datafeedTitle'];

  /**
   * Attempt to parse the entirety of a value to a float
   *
   * @param {Mixed} val - something to attempt to parse as a float
   * @return {Float | Mixed} a float value or the original value
   */
  var parse_possible_float = function(val) {
    var strVal = (val + '').trim();

    var parsed = parseFloat(strVal);
    return parsed.toString() === strVal ? parsed : val;
  };

  /**
   * Swap double-quotes and single-quotes
   *
   * @param {String} str - input string
   * @return {String} `str` with swapped quotes
   */
  var from_quote = function(str) {
    return (typeof str !== 'string') ? '' :
      str.replace(/"/g, '\\"').replace(/([^\\])'/g, '$1"').replace(/\\'/g, "'");
  };

  /**
   * Initialize a single JustGage container node
   *
   * @param {DOMNode} gaugeNode - a JustGage container node
   * @param {Boolean} reset - if true, do not reuse existing values
   */
  Gauges.initGauge = function(gaugeNode, reset) {
    var attrs = Array.prototype.slice.call(gaugeNode.attributes);
    var gaugeOptions = {};

    try {
      var dataGauge = gaugeNode.getAttribute('data-gauge');
      gaugeOptions = JSON.parse(from_quote(dataGauge) || '{}');
    } catch(err) { // invalid JSON in data attribute
      return;
    }

    gaugeOptions.id = gaugeNode.getAttribute('id');

    /**
     * Gather possible handlebar values and attempt to store them; otherwise,
     * it will be set to null
     */
    gaugeOptions.datafeedTitle = determineHandlebars(gaugeOptions.title) ? gaugeOptions.title : null;
    gaugeOptions.datafeedValue = determineHandlebars(gaugeOptions.value) ? gaugeOptions.value : null;
    gaugeOptions.title = !gaugeOptions.datafeedTitle ? gaugeOptions.title : ' ';


    gaugeNode.innerHTML = '';

    // re-initialize to current value if widget already exists
    if (!reset && gaugeWidgets[gaugeOptions.id]) {
      saved_attributes.forEach(function(attr) {
        gaugeOptions[attr] = gaugeWidgets[gaugeOptions.id].options[attr];
      });
    }

    gaugeOptions.value = gaugeOptions.value || 0;

    //Gathers the data-sm and data-rpath.  It will unbind and rebind a data event for
    // any serivce calls.  On trigger it will parse data and attempt to update values.
    var dataEvent = gaugeNode.getAttribute('data-sm');
    var dataRpath = gaugeNode.getAttribute('data-rpath');
    if(!!dataEvent) {
      var parse_gauges_event = function(evt, data) {
          Gauges.parseData(dataRpath, data, function(gatheredData) {
            var gage;
            var value;
            var title;
            if(gaugeOptions.datafeedValue) {
              gage = gaugeWidgets[gaugeOptions.id];
              var valueParts = stripEntry(gaugeOptions.datafeedValue).split(".");
              value = Gauges.getNamespacedObject(valueParts, gatheredData);
              gage.options.value = value;
              if(gage.refresh) {
                gage.refresh(value);
              } else {
                gage.reinit();
              }
            }
            if(gaugeOptions.datafeedTitle) {
              gage = gaugeWidgets[gaugeOptions.id];
              var titleParts = stripEntry(gaugeOptions.datafeedTitle).split(".");
              title = Gauges.getNamespacedObject(titleParts, gatheredData);
              if(gage.options.title !== title){
                gage.options.title = title;
                gage.reinit();
              }
            }
          });
      };

      $(document)
        .off('intel.xdk.services.' + dataEvent, parse_gauges_event)
        .on('intel.xdk.services.' + dataEvent, parse_gauges_event);
    }

    var gaugeNodeOptions = {
      reinit: function() { return Gauges.initGauge(gaugeNode) },
      options: gaugeOptions
    }

    if(gaugeNode.offsetParent !== null) {
      var g = new JustGage(gaugeOptions);
      gaugeNodeOptions.refresh = g.refresh.bind(g);
    }
    return gaugeWidgets[gaugeOptions.id] = gaugeNodeOptions;
  };

  /**
   * Takes an array of parts, a string split by '.', and attempts to look through
   * data and find the corresondping object
   *
   * @param {Array} - Array of strings split by '.'
   * @param {Object} - Base path to search in data feed response
   * @return {Object} - Empty object or fully qualified object path
   */
  Gauges.getNamespacedObject = function(parts, data) {
      for (var i = 0, len = parts.length, obj = data[0]; i < len; ++i) {
        obj = obj[parts[i]];
      }
      return obj || {};
  }

  Gauges.getById = function(id) {
    return gaugeWidgets[id] instanceof Object ? gaugeWidgets[id] : null;
  };

  /**
   * Execute a function on each JustGage container node present in the DOM
   *
   * @param {Function} fn - function which is passed each container DOMNode
   */
  Gauges.forEachNode = function(fn) {
    var gaugeNodes = document.getElementsByClassName('uib-justgage');
    Array.prototype.slice.call(gaugeNodes).forEach(fn);
  };

  /**
   * Execute a function on each JustGage widget object
   *
   * @param {Function} fn - function which is passed each JustGage object
   */
  Gauges.forEachWidget = function(fn) {
    Array.prototype.slice.call(gaugeWidgets).forEach(fn);
  };

  /**
   * Init all JustGage container nodes
   *
   * @param {Boolean} reset - if true, do not reuse existing values
   */
  Gauges.initAllNodes = function(reset) {
    Gauges.forEachNode(function(gaugeNode) {
      Gauges.initGauge(gaugeNode, reset);
    });
  };
    
    
    


  Gauges.parseData = function(rpath, data, fn){
    var dataRpath = JSON.parse(rpath);
    dataRpath.forEach(function(d){ data = data[d]; });
    fn(filter(data, isObject));
  }

  /**
   * Call Service will look through all the Gauges on the page and find whether any of them have
   * a data event.  It will then go through all of the namespaces and add it to 'intel.xdk.services'
   * to create a function call.
   */
  Gauges.callService = function() {
    Gauges.forEachNode(function(node){
      var dataEvent = node.getAttribute('data-sm');
      if(!!dataEvent){
        var splitString = dataEvent.split(".")
        var func = window.intel.xdk.services;
        for(var j = 0; j < splitString.length; j++){
          func = func[splitString[j]];
        }
        func();
      }
    });

  }

  /**
   *  Filter function that
   *
   * @param [Array] arr - Objects that are gathered from service data path
   * @param {function} predicate - Data must pass through this conditional or will be filtered
   */
  function filter(arr, predicate) {
      var i, res = [];
      for(i = 0; i < arr.length; i++){
        if(predicate(arr[i])){
          res.push(arr[i]);
        }
      }
      return res;
  }

  /**
   *  Determines whether an item is an object
   *
   * @param {Object} e - element that will be compared to an object
   */
  function isObject(e) {
    return typeof(e) == "object";
  }

  /**
   * Attempts to trim off the handlebar style syntax from an entry.  If the syntax is not correctly used
   * it will return the original string; otherwise, it will return the inner value.
   *
   * @param {String} entry - Contains possible handlebars entry string
   * @returns {String} - Either a trimmed handlebars entry or original entry depending on match
   */
  function stripEntry(entry) {
    var match = entry.match(/\{\{(?:entry.)?([\w\W]*)\}\}/);
    return !!match && match.length == 2 ? match[1] : entry;
  }

    /**
     * Detects whether a handlebars style syntax is being used on an entry.
     *
     * @param {String} entry - Contains possible handlebars entry string
     * @returns {Boolean} - True if matched and false if not matched
     */
  function determineHandlebars(entry) {
    if(!isNaN(entry) || typeof entry == "undefined") return false;
    return !!entry.match(/\{\{([\w\W]*)\}\}/);
  }

  /**
   * init is called on the `document.DOMContentLoaded`, `window.resize`,
   * and `document.reinit-justgage` events. By default, it just (re)initializes
   * all JustGage container nodes.
   *
   * This preinit function (if defined) will execute just before
   * Gauges.initAllNodes, if needed
   */
  // Gauges.preinit = function() {}

  var init = function(e) {
    if (typeof Gauges.preinit === 'function') { Gauges.preinit(); }
    Gauges.initAllNodes(!!(e && e.detail && e.detail.reset));
  };


  document.addEventListener('reinit-justgage', init, false);
  document.addEventListener('DOMContentLoaded', init, false);
  window.addEventListener('resize', init, false);
  init();

  var deferred = function(){
    if(typeof $ === 'function'){
      $(document).on('pagechange', init);
    }
    Gauges.callService();
  };
  document.addEventListener('app.Ready', deferred, false);

})(window.JustGage);
