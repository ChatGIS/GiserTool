var control = {
	/**
	 * The measure tooltip element.
	 * @type {HTMLElement}
	 */
	measureTooltipElement : null,
	/**
	 * Overlay to show the measurement.
	 * @type {Overlay}
	 */
	measureTooltip : null,
	
	/**
	 * Creates a new measure tooltip
	 */
	createMeasureTooltip : function() {
	  if (control.measureTooltipElement) {
	    control.measureTooltipElement.parentNode.removeChild(control.measureTooltipElement);
	  }
	  control.measureTooltipElement = document.createElement('div');
	  control.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
	  control.measureTooltip = new ol.Overlay({
	    element: control.measureTooltipElement,
	    offset: [0, -15],
	    positioning: 'bottom-center',
	  });
	  map.addOverlay(control.measureTooltip);
	},
	
	/* 
		测量控件相关函数：开始
	 */
	/* 
	  清除地图交互
	 */
	clearAllMapInteraction : function(){
	    /* var obj1 = document.getElementById('map-marking-info');
	    removeClass(obj1, "show"); */
	    var interactions = map.getInteractions();
	    var length = interactions.getLength();
	    for (var i = 9; i < length; i++) {
	        var interaction = interactions.item(9);
	        if (interaction instanceof ol.interaction.Select) {
	            interaction.getFeatures().clear()
	        }
	        map.removeInteraction(interaction)
	    }
	},
	
	/* 
		添加测量交互
	 */
	addMeasureInteraction : function(type) {
	    //document.getElementById('map-marking-panel-title').innerHTML = type == 'area' ? '面积测量' : '长度测量';
	    //openPanelContent(['map-marking-panel', 'measure-info']);
	    control.clearAllMapInteraction();
	    var type = (type == 'area' ? 'Polygon' : 'LineString');
	    draw = new ol.interaction.Draw({
	        source: layermMeasure.getSource(),
	        type: (type),
	        style: style.styleMeasure
	    });
	    map.addInteraction(draw);
	    // createMeasureTooltip();
		control.createMeasureTooltip();
	    // createHelpTooltip();
	    var listener;
	    draw.on('drawstart', function(evt) {
	        sketch = evt.feature;
	        var tooltipCoord = evt.coordinate;
	        // var measure_geo = document.getElementById('measure-geo').checked;
	        listener = sketch.getGeometry().on('change', function(evt) {
	            var geom = evt.target;
	            var output;
	            if (geom instanceof ol.geom.Polygon) {
	                // output = formatArea(geom, measure_geo ? 1 : 2);
					output = coorf.formatArea(geom, 1);
	                tooltipCoord = geom.getInteriorPoint().getCoordinates()
	            } else if (geom instanceof ol.geom.LineString) {
	                //output = coorf.formatLength(geom, measure_geo ? 1 : 2);
					output = coorf.formatLength(geom, 1);
	                tooltipCoord = geom.getLastCoordinate()
	            }
	            // measureTooltipElement.innerHTML = output;
	            // measureTooltip.setPosition(tooltipCoord)
				control.measureTooltipElement.innerHTML = output;
				control.measureTooltip.setPosition(tooltipCoord);
				console.log(output);
				$("#location-coordinate").val(output);
				
	        })
	    }, this);
	    draw.on('drawend', function() {
	        // measureTooltipElement.className = 'tooltip tooltip-static';
			control.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
	        measureTooltip.setOffset([0, -7]);
	        sketch = null;
	        control.measureTooltipElement = null;
	        control.createMeasureTooltip();
	        ol.Observable.unByKey(listener)
	    }, this)
	},
	/*
		测量控件相关函数：结束
	 */
}
