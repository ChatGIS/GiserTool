$(document).ready(function () {
	var coorCenter = [117.1257,36.6809];
	
	// 高德底图
	var gaodeTileLayer = new ol.layer.Tile({
		source: new ol.source.XYZ({
			url:'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
		})
	});
	
	// OpenStreetMap底图
	var osmTileLayer = new ol.layer.Tile({
		source: new ol.source.OSM()
	});
	
	// 基于ArcGIS Server REST的瓦片地图服务
	var layerArcGISTile = new ol.layer.Tile({
		source: new ol.source.TileArcGISRest({
			url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer'
		})
	});
	
	// 加载GeoJSON数据
	var layerGeoJsonChina = new ol.layer.Vector({
		source: new ol.source.Vector({
			url:"resource/geodata/ChinaRegion1.geojson",
			format: new ol.format.GeoJSON()
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
	
	layermMeasure = new ol.layer.Vector({
	    source: new ol.source.Vector()
	});
	
	var layerVectorLocate = new ol.layer.Vector({
	  source: new ol.source.Vector()
	});
	
	var layers = [gaodeTileLayer, layerArcGISTile,
		layerVector1, layerVector2, layerVector3, layerVector4, layerVector5, 
		layermMeasure, layerVectorLocate, layerGeoJsonChina];
	
	/* 地图初始化 */
	map = new ol.Map({
		layers:layers,
		view: new ol.View({
			center: coorCenter,
			//maxZoom: 19,
			zoom: 6,
			projection: 'EPSG:4326'
		}),
		target: 'map-div'
	});
	var sourceProj =map.getView().getProjection();
	console.log(sourceProj);
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
		/* var featureOl = new ol.format.GeoJSON().readFeatures(geoobj);
		var geoOlA = featureOl[0].getGeometry();
		var jsts_OL3Parser = new jsts.io.OL3Parser();
		var geo = jsts_OL3Parser.read(geoOlA);		
		var geoOlB = new ol.geom.Polygon(getPolygonCoordinateFromStr(["117.16008393", "36.74770178", "116.99097038", "36.67098166", "117.00252063", "36.59316450", "117.18466847", "36.68234177", "117.16008393", "36.74770178"]));	
		
		 */
		/* var feature2 = new ol.Feature();
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
		layerVector5.getSource().addFeature(feature5); */
		
		
		
		/* $("#tool-mesure-line").click(addMeasureInteraction("line"));
		$("#tool-mesure-polygon").click(addMeasureInteraction("area")); */
		$("#tool-mesure-line").click(function(){
			control.addMeasureInteraction("line");
		});
		$("#tool-mesure-polygon").click(function(){
			control.addMeasureInteraction("area");
		});
		$("#locate-clear").click(function(){
			$("#location-coordinate").val("");
			layerVectorLocate.getSource().clear();
		});
		$("#locate").click(function(){
			var coor = $("#location-coordinate").val();
			var coor = coor.split(",");
			var coorA = ol.proj.fromLonLat(coor, "EPSG:4326");
			map.getView().setCenter(coorA);
			var geo = new ol.geom.Point(coorA);
			var feature = new ol.Feature();
			feature.setGeometry(geo);
			feature.setStyle(style.styleLocate);
			layerVectorLocate.getSource().addFeature(feature);
		});
	}
})