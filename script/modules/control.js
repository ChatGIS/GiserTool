/**
  * 当前正在绘制的要素
  * @type {import("../src/ol/Feature.js").default}
*/
var	sketch;
/**
  * 测量值提示框
  * @type {HTMLElement}
*/
var	measureTooltipElement;
/**
 * 用于展示测量值要素的Overlay
 * @type {Overlay}
 */
var measureTooltip;
/**
  * 帮助信息提示框
  * @type {HTMLElement}
*/
var helpTooltipElement;
/**
  * 用于展示帮助信息要素的Overlay
  * @type {Overlay}
*/
var helpTooltip;
/**
 * 绘制多边形的提示信息
 * @type {string}
 */
var continuePolygonMsg = '单击继续，双击结束';
	
/**
 * 绘制线的提示信息
 * @type {string}
 */
var continueLineMsg = '单击继续，双击结束';

var control = {
	/* 
	  测量工具鼠标移动触发方法
	 */
	pointerMoveHandler : function (evt) {
		if (evt.dragging) {
			return;
		}
		/** @type {string} */
		var helpMsg = '点击确认起点';

		if (sketch) {
			var geom = sketch.getGeometry();
			if (geom instanceof ol.geom.Polygon) {
				helpMsg = continuePolygonMsg;
			} else if (geom instanceof ol.geom.LineString) {
				helpMsg = continueLineMsg;
			}
		}

		helpTooltipElement.innerHTML = helpMsg;
		helpTooltip.setPosition(evt.coordinate);

		helpTooltipElement.classList.remove('hidden');
	},
	
	/**
	 * 创建【测量值】提示框
	 */
	createMeasureTooltip : function() {
		if (measureTooltipElement) {
			measureTooltipElement.parentNode.removeChild(measureTooltipElement);
		}
		measureTooltipElement = document.createElement('div');
		measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
		measureTooltip = new ol.Overlay({
			element: measureTooltipElement,
			offset: [0, -15],
			positioning: 'bottom-center',
		});
		map.addOverlay(measureTooltip);
	},
	
	/**
	 * 创建【帮助信息】提示框
	 */
	createHelpTooltip : function() {
		if (helpTooltipElement) {
			helpTooltipElement.parentNode.removeChild(helpTooltipElement);
		}
		helpTooltipElement = document.createElement('div');
		helpTooltipElement.className = 'ol-tooltip hidden';
		helpTooltip = new ol.Overlay({
			element: helpTooltipElement,
			offset: [15, 0],
			positioning: 'center-left',
		});
		map.addOverlay(helpTooltip);
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
				measureTooltipElement.innerHTML = output;
				measureTooltip.setPosition(tooltipCoord);				
	        })
	    }, this);
	    draw.on('drawend', function() {
			measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
	        measureTooltip.setOffset([0, -7]);
	        sketch = null;
	        measureTooltipElement = null;
	        control.createMeasureTooltip();
	        ol.Observable.unByKey(listener)
	    }, this)
	},
	/*
		测量控件相关函数：结束
	 */
}
