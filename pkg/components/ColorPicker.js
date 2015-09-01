/**
 * @jsx React.DOM
 */

var React = require("react");
var PureRenderMixin = require("react/lib/ReactComponentWithPureRenderMixin");
var cx = require("react/lib/cx");
var Map = require("./Map");
var Slider = require("./Slider");
var Colr = require("colr");


var ColorPicker = React.createClass({displayName: "ColorPicker",

  mixins : [PureRenderMixin],

  getDefaultProps : function() {
    return {
      color : "#000000"
    };
  },

  getInitialState: function() {
    return this.getStateFrom(this.props.color);
  },

  componentWillReceiveProps: function(nextProps) {
    var nextColor = nextProps.color;
    var currentColor = Colr.fromHsvObject(this.state.hsv).toHex();

    if(nextColor.toLowerCase() !== currentColor.toLowerCase()) {
      this.setState(this.getStateFrom(nextColor));
    }
  },

  getStateFrom : function(color) {
    color = Colr.fromHex(color);
    return {
      hsv : color.toHsvObject()
    };
  },

  render: function () {
    var luminosity = this.getLuminosity();
    var hue = this.getBackgroundHue();

    var classes = cx({
      dark: luminosity <= 0.5,
      light: luminosity > 0.5
    });

    return (
      React.createElement("div", {className: "colorpicker"}, 
        React.createElement("div", {className: "hue-slider"}, 
          React.createElement(Slider, {
            vertical: true, 
            value: this.state.hsv.h, 
            max: 360, 
            onChange: this.handleHueChange}
          )
        ), 
        React.createElement(Map, {
          x: this.state.hsv.s, 
          y: this.state.hsv.v, 
          max: 100, 
          className: classes, 
          backgroundColor: hue, 
          onChange: this.handleSaturationValueChange}
        )
      )
    );
  },

  getLuminosity : function() {
    return Colr.fromHsvObject(this.state.hsv).toGrayscale() / 255;
  },

  getBackgroundHue : function() {
    return Colr.fromHsv(this.state.hsv.h, 100, 100).toHex();
  },

  handleHueChange : function(hue) {
    this.update({
      h : hue,
      s : this.state.hsv.s,
      v : this.state.hsv.v
    });
  },

  handleSaturationValueChange : function(saturation, value) {
    this.update({
      h : this.state.hsv.h,
      s : saturation,
      v : value
    });
  },

  update : function(hsv) {
    var color = Colr.fromHsvObject(hsv);
    this.props.onChange(color.toHex());
    this.setState({ hsv : hsv });
  }

});

module.exports = ColorPicker;
