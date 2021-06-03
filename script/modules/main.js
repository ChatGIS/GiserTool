$(document).ready(function () {
	var coorCenter = [117.1257,36.6809];
	
	// 高德底图
	var gaodeTileLayer = new ol.layer.Tile({
		source: new ol.source.XYZ({
			url:'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
		})
	});
	
	/* 预定义图层 */		
	var layerVector1 = new ol.layer.Vector({
	  source: new ol.source.Vector(),
	});
	
	var layerVector2 = new ol.layer.Vector({
	  source: new ol.source.Vector(),
	});
	
	var layerVector3 = new ol.layer.Vector({
	  source: new ol.source.Vector(),
	});
	
	var layerVector4 = new ol.layer.Vector({
	  source: new ol.source.Vector(),
	});
	
	var layerVector5 = new ol.layer.Vector({
	  source: new ol.source.Vector(),
	});
	
	var measureLayer = new ol.layer.Vector({
	    source: new ol.source.Vector(),
	    style: new ol.style.Style({
	        fill: new ol.style.Fill({
	            color: 'rgba(255, 255, 255, 0.2)'
	        }),
	        stroke: new ol.style.Stroke({
	            color: '#ffcc33',
	            width: 2
	        }),
	        image: new ol.style.Circle({
	            radius: 7,
	            fill: new ol.style.Fill({
	                color: '#ffcc33'
	            })
	        })
	    })
	});
	
	var layers = [gaodeTileLayer, 
		layerVector1, layerVector2, layerVector3, layerVector4, layerVector5, measureLayer];
	
	/* 地图初始化 */
	var map = new ol.Map({
		layers:layers,
		view: new ol.View({
			center: coorCenter,
			//maxZoom: 19,
			zoom: 10,
			projection: 'EPSG:4326'
		}),
		target: 'map'
	})
	
	var scaleLineControl = new ol.control.ScaleLine({
		Units: 'metric',//单位有5种：degrees imperial us nautical metric
	});
	map.addControl(scaleLineControl);
	
	var feature1 = new ol.Feature({
		geometry: new ol.geom.Point(coorCenter)
	});
	 
	layerVector1.getSource().addFeature(feature1);
	
	//style.flashPointStyle(feature);
	
	//locate.getCurrentPosition();
	
	// 地图滑动
	map.on("moveend",function(e){
	    getZoomShow();
	}); 
	
	// 获取鼠标位置并展示
	map.on('pointermove', function(e) {
		var coordinate = ol.proj.transform(e.coordinate, map.getView().getProjection().getCode(), 'EPSG:4326');
		$("#mouse-coordinate").text(coordinate[0].toFixed(6) + "," + coordinate[1].toFixed(6))
	});
		
	// 获取缩放级别并展示
	function getZoomShow(){
		var zoom = map.getView().getZoom();
		$("#zoom-level").text(Math.round(zoom));
	}
	
	// 单击地图事件
	map.on("singleclick",function(evt){
		$("#coordinate").val(evt.coordinate[0].toFixed(8) + "," + evt.coordinate[1].toFixed(8));
		/* $("#coordinate_wgs84").val(gcj_decrypt_exact(parseFloat(evt.coordinate[1]), parseFloat(evt.coordinate[0]))); */
	})
	
	$("#map-tool-location").click(function(){
	    showDiv(1);
	});
	
	function showDiv(flag){
		debugger
		if(flag == 1){
			$(".map-location").show();
		}
	}
	
	// 复制功能
	var clipboard = new ClipboardJS('#clone');
	clipboard.on('success', function(e) {
		$("#message1").text("复制成功!").show(300).delay(3000).hide(300); 
	});
	
	// 剪切功能
	var clipboardCut = new ClipboardJS('#cut');
	clipboardCut.on('success', function(e) {
		$("#message2").text("剪切成功!").show(300).delay(3000).hide(300); 
	});
	
	testJsts();
	function getPolygonCoordinateFromStr(lonlats){
		var array3 = [];
		if (!lonlats || lonlats == "") {
		    return array3;
		}
		var array = [];
		var tempAarry = null;
		if (typeof lonlats == "object") {
		    tempAarry = lonlats;
		} else {
		    tempAarry = lonlats.split(",");
		}
		if (tempAarry.length % 2 != 0) {
		    gcsp.ui.showMessage("面坐标数据[" + lonlats + "]有问题，请核查！");
		}
		var length = tempAarry.length;
		for (var i = 0; i < length - 1;) {
		    var array2 = [];
		    array2.push(parseFloat(tempAarry[i]));
		    array2.push(parseFloat(tempAarry[i + 1]));
		    array.push(array2);
		    i = i + 2;
		}
		array3.push(array);
		return array3;
	}
	
	function testJsts(){
		var geoobj = {
			"type": "FeatureCollection",
			"crs": {
				"type": "name",
				"properties": {
					"name": "EPSG:4326"
				}
			},
			"features": [
				{
					"type": "Feature",
					"geometry": {
						"type": "Polygon",
						"coordinates": [
							[
								[
									116.49288752,37.00801792
								],
								[
									117.38058286,36.94869175
								],
								[
									117.41793631,36.27852573
								],
								[
									116.26437188,36.25215853
								],
								[
									116.49288752,37.00801792
								]
							],
							[
								[
									116.67855644,36.75862828
								],
								[
									117.04330254,36.77730500
								],
								[
									117.13888364,36.43782749
								],
								[
									116.61703302,36.51143590
								],
								[
									116.67855644,36.75862828
								]
							]
						]
					},
					"properties": {
						"NAME_CHN": "泽州县"
					}
				}
			]
		};
		
		
		
		var featureOl = new ol.format.GeoJSON().readFeatures(geoobj);
		var geoOlA = featureOl[0].getGeometry();
		var jsts_OL3Parser = new jsts.io.OL3Parser();
		var geo = jsts_OL3Parser.read(geoOlA);		
		var geoOlB = new ol.geom.Polygon(getPolygonCoordinateFromStr(["117.16008393", "36.74770178", "116.99097038", "36.67098166", "117.00252063", "36.59316450", "117.18466847", "36.68234177", "117.16008393", "36.74770178"]));	
		
		
		var feature2 = new ol.Feature();
		feature2.setGeometry(geoOlB);
		feature2.setStyle(style.stylePolygonGreen);
		layerVector3.getSource().addFeature(feature2);
		
		layerVector2.getSource().addFeatures(featureOl);
		
		var geo = topoj.getBufferByPoint(117.1257, 36.6809, 0.2);
		var feature3 = new ol.Feature();
		feature3.setGeometry(geo);
		feature3.setStyle(style.stylePolygonRed);
		layerVector4.getSource().addFeature(feature3);
		
		var geoBuf = topoj.getBufferByGeom(geoOlA, 0.1)
		var feature5 = new ol.Feature();
		feature5.setGeometry(geoBuf);
		feature5.setStyle(style.stylePolygonRed);
		layerVector5.getSource().addFeature(feature5);
		
		function clearAllMapInteraction() {
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
		};
		
		function addMeasureInteraction(type) {
		    //document.getElementById('map-marking-panel-title').innerHTML = type == 'area' ? '面积测量' : '长度测量';
		    //openPanelContent(['map-marking-panel', 'measure-info']);
		    clearAllMapInteraction();
		    var type = (type == 'area' ? 'Polygon' : 'LineString');
		    draw = new ol.interaction.Draw({
		        source: measureLayer.getSource(),
		        type: (type),
		        style: new ol.style.Style({
		            fill: new ol.style.Fill({
		                color: 'rgba(255, 255, 255, 0.2)'
		            }),
		            stroke: new ol.style.Stroke({
		                color: 'rgba(0, 0, 0, 0.5)',
		                lineDash: [10, 10],
		                width: 2
		            }),
		            image: new ol.style.Circle({
		                radius: 5,
		                stroke: new ol.style.Stroke({
		                    color: 'rgba(0, 0, 0, 0.7)'
		                }),
		                fill: new ol.style.Fill({
		                    color: 'rgba(255, 255, 255, 0.2)'
		                })
		            })
		        })
		    });
		    map.addInteraction(draw);
		    // createMeasureTooltip();
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
					console.log(output);
					$("#location-coordinate").val(output);
					
		        })
		    }, this);
		    draw.on('drawend', function() {
		        measureTooltipElement.className = 'tooltip tooltip-static';
		        measureTooltip.setOffset([0, -7]);
		        sketch = null;
		        measureTooltipElement = null;
		        createMeasureTooltip();
		        ol.Observable.unByKey(listener)
		    }, this)
		};
		
		/* $("#tool-mesure-line").click(addMeasureInteraction("line"));
		$("#tool-mesure-polygon").click(addMeasureInteraction("area")); */
		$("#tool-mesure-line").click(function(){
			addMeasureInteraction("line");
		});
		$("#tool-mesure-polygon").click(function(){
			addMeasureInteraction("area");
		});
	}
})