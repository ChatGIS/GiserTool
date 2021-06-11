var continueLineMsg = '单击继续，双击结束';
var control = {
	/**
	 * 当前正在绘制的要素
	 * @type {import("../src/ol/Feature.js").default}
	 */
	sketch : null,
	/**
	 * 测量值提示框
	 * @type {HTMLElement}
	 */
	measureTooltipElement : null,

	/**
	 * Overlay to show the measurement.
	 * @type {Overlay}
	 */
	measureTooltip : null,
	
	/**
	 * 帮助信息提示框
	 * @type {HTMLElement}
	 */
	helpTooltipElement : null,
	
	/**
	 * Overlay to show the help messages.
	 * @type {Overlay}
	 */
	helpTooltip : null,
	
	/**
	 * 绘制多边形的提示信息
	 * @type {string}
	 */
	continuePolygonMsg : '单击继续，双击结束',
	
	/**
	 * 绘制线的提示信息
	 * @type {string}
	 */
	/* continueLineMsg : '单击继续，双击结束', */
	
	pointerMoveHandler : function (evt) {
		if (evt.dragging) {
			return;
		}
		/** @type {string} */
		var helpMsg = '点击确认起点';

		if (control.sketch) {
			var geom = control.sketch.getGeometry();
			if (geom instanceof ol.geom.Polygon) {
				helpMsg = control.continuePolygonMsg;
			} else if (geom instanceof ol.geom.LineString) {
				helpMsg = continueLineMsg;
			}
		}

		control.helpTooltipElement.innerHTML = helpMsg;
		control.helpTooltip.setPosition(evt.coordinate);

		control.helpTooltipElement.classList.remove('hidden');
	},
	
	/**
	 * 创建【测量值】提示框
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
	
	/**
	 * 创建【帮助信息】提示框
	 */
	createHelpTooltip : function() {
		if (control.helpTooltipElement) {
			control.helpTooltipElement.parentNode.removeChild(control.helpTooltipElement);
		}
		control.helpTooltipElement = document.createElement('div');
		control.helpTooltipElement.className = 'ol-tooltip hidden';
		control.helpTooltip = new ol.Overlay({
			element: control.helpTooltipElement,
			offset: [15, 0],
			positioning: 'center-left',
		});
		map.addOverlay(control.helpTooltip);
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
		map.on('pointermove', control.pointerMoveHandler);
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
		control.createMeasureTooltip();
	    control.createHelpTooltip();
	    var listener;
	    draw.on('drawstart', function(evt) {
	        control.sketch = evt.feature;
	        var tooltipCoord = evt.coordinate;
	        // var measure_geo = document.getElementById('measure-geo').checked;
	        listener = control.sketch.getGeometry().on('change', function(evt) {
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
				control.measureTooltipElement.innerHTML = output;
				control.measureTooltip.setPosition(tooltipCoord);				
	        })
	    }, this);
	    draw.on('drawend', function() {
	        // measureTooltipElement.className = 'tooltip tooltip-static';
			control.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
	        control.measureTooltip.setOffset([0, -7]);
	        control.sketch = null;
	        control.measureTooltipElement = null;
	        control.createMeasureTooltip();
	        ol.Observable.unByKey(listener)
	    }, this)
	},
	/*
		测量控件相关函数：结束
	 */
}
