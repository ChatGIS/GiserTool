$(document).ready(function () {
	var coorCenter = [117.1257,36.6809];
	const blur = document.getElementById('blur-heatmap');
	const radius = document.getElementById('radius-heatmap');
	
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
			url:"resource/geodata/China.geojson",
			format: new ol.format.GeoJSON()
		})
	});
	
	// 热力图层
	var layerHeatMap = new ol.layer.Heatmap({
		source: new ol.source.Vector({
			url: "resource/geodata/2012_Earthquakes_Mag5.kml",
			format: new ol.format.KML({
				extractStyles: false,
			}),
		}),
		radius: 8,
		blur: 15,
		weight: function (feature) {
			// 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
			// standards-violating <magnitude> tag in each Placemark.  We extract it from
			// the Placemark's name instead.
			var name = feature.get('name');
			var magnitude = parseFloat(name.substr(2));
			return magnitude - 5;
		},
	});
	
	// wms
	var layerGridGeoServer = new ol.layer.Tile({
		source: new ol.source.TileWMS({
			url:"http://localhost:8080/geoserver/sxdx/wms?service=WMS&version=1.1.0&request=GetMap&layers=sxdx%3Asxdx_grid&width=533&height=768&srs=EPSG%3A4326"
		})
	});
	
	// 绘制要素图层
	var layerDrawFeatures = new ol.layer.Vector({
		source: new ol.source.Vector()
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
	
	var layers = [gaodeTileLayer, osmTileLayer, layerArcGISTile, layerGridGeoServer,
		layerDrawFeatures, 
		layerVector1, layerVector2, layerVector3, layerVector4, layerVector5, 
		layermMeasure, layerVectorLocate, layerGeoJsonChina,layerHeatMap];
	// var layers = [layerHeatMap];
	
	// 自定义投影
	// var proj = new ol.proj.Projection({
	// 	code:'EPSG:4326',
	// 	units: "m",
	// 	extent: [110.21458500009771, 34.58559499960961, 114.55652199999042, 40.74176700034684]
	// });
	
	/* 地图初始化 */
	map = new ol.Map({
		layers:layers,
		view: new ol.View({
			center: coorCenter,
			//maxZoom: 19,
			zoom: 16,
			projection: 'EPSG:4326'	// proj
		}),
		target: 'map-div'
	});
	var sourceProj =map.getView().getProjection();
	console.log(sourceProj);
	var scaleLineControl = new ol.control.ScaleLine({
		Units: 'metric',//单位有5种：degrees imperial us nautical metric
	});
	map.addControl(scaleLineControl);
	map.addControl(new ol.control.ZoomSlider());
	
	var feature1 = new ol.Feature({
		geometry: new ol.geom.Point(coorCenter)
	});
	 
	layerVector1.getSource().addFeature(feature1);
	var feature2 = new ol.Feature({
		geometry: new ol.geom.Polygon([[[112.2161005605, 38.3080000095], [112.2161005605, 37.9748000095], [112.7986000064, 37.9748000095], [112.7986000064, 38.3080000095], [112.2161005605, 38.3080000095]]])
	})
	layerVector1.getSource().addFeature(feature2);
	
	var feature3 = new ol.Feature({
		geometry: new ol.geom.Polygon([[[112.23379987630994, 38.08959709167481], [112.23379987630994, 38.0874513244629], [112.7986000064, 38.0874513244629], [112.7986000064, 38.08959709167481], [112.23379987630994, 38.08959709167481]]])
	})
	layerVector1.getSource().addFeature(feature3);
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
	
	/* 
		弹框类JS
		date:20210806
	*/
	var showFlag = 0;
	$("#map-location-btn").click(function(){
		if(showFlag == 0){
			showFlag = 1;
			$(".map-location").show();
			$(this).addClass("active");
		} else {
			showFlag = 0;
			$(".map-location").hide();
			$(this).removeClass("active");
		}
	});
	
	$("#map-getcoor-btn").click(function(){
		if(showFlag == 0){
			showFlag = 1;
			$(".map-getcoor").show();
			$(this).addClass("active");
		} else {
			showFlag = 0;
			$(".map-getcoor").hide();
			$(this).removeClass("active");
		}
	});
	
	$("#api-geocode-btn").click(function(){
		if(showFlag == 0){
			showFlag = 1;
			$(".api-geocode").show();
			$(this).addClass("active");
		} else {
			showFlag = 0;
			$(".api-geocode").hide();
			$(this).removeClass("active");
		}
	});
	
	// 定位清空
	$("#locate-clear").click(function(){
		$("#location-coordinate").val("");
		layerVectorLocate.getSource().clear();
	});
	
	// 定位
	$("#locate").click(function(){
		var coorG = "";	// GCJ坐标
		var coorB = ""; // 百度坐标
		var coorW = "";	// WGS84坐标
		var coorType = "2";
		var result = "";
		var coor = $("#location-coordinate").val();
		var coorArr = coor.split(",");
		if(coor.trim() == ""){
			alert("定位坐标为空！");
			return;
		}
		coorType = $('.map-location input:radio:checked').val();
		if(coorType == 2){			
			coorG = coorArr;
			var coorResultB = coorf.transLonlat(coorArr, 2, 3);
			coorB = coorResultB.coor;
			var coorResultW = coorf.transLonlat(coorArr, 2, 1);
			coorW = coorResultW.coor;
		} else if(coorType == 1){
			coorW = coorArr;
			var coorResultG = coorf.transLonlat(coorArr, 1, 2);
			coorG = coorResultG.coor;
			var coorResultB = coorf.transLonlat(coorG, 2, 3);
			coorB = coorResultB.coor;
		} else if(coorType == 3){
			coorB = coorArr;
			var coorResultG = coorf.transLonlat(coorArr, 3, 2);
			coorG = coorResultG.coor;
			var coorResultW = coorf.transLonlat(coorG, 2, 1);
			coorW = coorResultW.coor;
		}
		
		// 转换结果输出框
		result += "GCJ-02：" + coorG + "\r\n";
		result += "WGS84：" + coorW + "\r\n";
		result += "BD-09：" + coorB + "\r\n";
		$("#coor-trans-result textarea").val(result);
		$("#coor-trans-result").show();
		
		// 定位坐标显示
		var geoW = new ol.geom.Point(coorW);
		var featureW = new ol.Feature();
		featureW.setGeometry(geoW);
		featureW.setStyle(style.styleLocateWGS);
		layerVectorLocate.getSource().addFeature(featureW);
		
		var geoG = new ol.geom.Point(coorG);
		var featureG = new ol.Feature();
		featureG.setGeometry(geoG);
		featureG.setStyle(style.styleLocateGCj);
		layerVectorLocate.getSource().addFeature(featureG);
		
		var geoB = new ol.geom.Point(coorB);
		var featureB = new ol.Feature();
		featureB.setGeometry(geoB);
		featureB.setStyle(style.styleLocateBD);
		layerVectorLocate.getSource().addFeature(featureB);
		
		map.getView().setCenter(coorArr);
		// 调用百度API
		// $.ajax({
		// 	url: "https://api.map.baidu.com/geoconv/v1/?coords="+ coor[0] +","+ coor[1] +"&from=3&to=5&ak=" + mapkey.bdKey,
		// 	async: false,
		// 	dataType:'JSONP',  // 解决跨域问题
		// 	success: function(response){
		// 		var coor1 = response.result[0].x + "," + response.result[0].y;
		// 		console.log("百度坐标" + coor1);
		// 		coor = coor1.split(",");
		// 		var coorG = coor;
		// 		map.getView().setCenter(coorG);
		// 		var geo = new ol.geom.Point(coorG);
		// 		var feature = new ol.Feature();
		// 		feature.setGeometry(geo);
		// 		feature.setStyle(style.styleLocateGCj);
		// 		layerVectorLocate.getSource().addFeature(feature);
		// 	},
		// });
	});
	
	function callBack(coor){
		var coorG = coor;
		map.getView().setCenter(coorG);
		var geo = new ol.geom.Point(coorG);
		var feature = new ol.Feature();
		feature.setGeometry(geo);
		feature.setStyle(style.styleLocate);
		layerVectorLocate.getSource().addFeature(feature);
	}
	// 地理编码
	$("#geocode_btn").click(function(){
		var addressText = $("#geocode_text").val(); 
		var url = "https://restapi.amap.com/v3/geocode/geo?key=" + mapkey.gdKey + "=" + addressText;
		//$.get(url);
		$.ajax({
		  url: url,
		  success: function(response){
			  console.log(response);
			  $("#geocode_text_re").val(response.geocodes[0].location);
		  },
		  //dataType: dataType
		});
	});
	
	// 图层管理
	function bindInputs(layerid, layer) {
	  const visibilityInput = $(layerid + ' input.visible');
	  visibilityInput.on('change', function () {
	    layer.setVisible(this.checked);
	  });
	  visibilityInput.prop('checked', layer.getVisible());
	
	  const opacityInput = $(layerid + ' input.opacity');
	  opacityInput.on('input', function () {
	    layer.setOpacity(parseFloat(this.value));
	  });
	  opacityInput.val(String(layer.getOpacity()));
	}
	/* function setup(id, group) {
	  group.getLayers().forEach(function (layer, i) {
	    const layerid = id + i;
	    bindInputs(layerid, layer);
	    if (layer instanceof LayerGroup) {
	      setup(layerid, layer);
	    }
	  });
	}
	setup('#layer', map.getLayerGroup()); */
	bindInputs("#layer0", gaodeTileLayer);
	bindInputs("#layer1", osmTileLayer);
	
	$('#layertree li > span')
	  .click(function () {
	    $(this).siblings('fieldset').toggle();
	  })
	  .siblings('fieldset')
	  .show();
	 
	$("#tool-layer-manage").click(function(){
		$("#layertree").animate({width: 350, height:300}, 800);
		$("#layertree").toggle();
	})
	
	/* 绘制要素
	 */
	var drawInteraction;
	function drawTypeChange() {
		drawInteraction = new ol.interaction.Draw({
			source: layerDrawFeatures.getSource(),
			type: $("#draw-feature-type").val(),
		});	
		
	}
	
	$("#tool-draw-feature").click(function(){
		$("#box-draw-feature").animate({width: 350, height:300}, 800);
		$("#box-draw-feature").toggle();
		if($("#box-draw-feature").css("display") == "none"){
			map.removeInteraction(drawInteraction);
		} else{
			drawTypeChange();
			map.addInteraction(drawInteraction);
		}
	})
	
	$("#draw-feature-type").change(function(){
		map.removeInteraction(drawInteraction);
		drawTypeChange();
		map.addInteraction(drawInteraction);
	})
	
	$('#draw-back').on('click', function () {
		drawInteraction.removeLastPoint();
	});
	
	/* 热力图 */
	$("#tool-heatmap").click(function(){
		$("#box-heatmap").animate({width: 200, height:100}, 100);
		$("#box-heatmap").toggle();
		/* if($("#box-draw-feature").css("display") == "none"){
			map.removeInteraction(drawInteraction);
		} else{
			drawTypeChange();
			map.addInteraction(drawInteraction);
		} */
	})
	
	
	
	// $("#radius-heatmap").change(function(){
	// 	debugger
	// 	var radiusVal = $("#radius-heatmap").val();
	// 	var blurVal = $("#blur-heatmap").val();
	// 	layerHeatMap.setRadius(radiusVal);
	// 	layerHeatMap.setBlur(blurVal);
	// });
	
	const blurHandler = function () {
	  layerHeatMap.setBlur(parseInt(blur.value, 10));
	};
	blur.addEventListener('input', blurHandler);
	blur.addEventListener('change', blurHandler);
	
	const radiusHandler = function () {
	  layerHeatMap.setRadius(parseInt(radius.value, 10));
	};
	radius.addEventListener('input', radiusHandler);
	radius.addEventListener('change', radiusHandler);
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
	
	$("#tool-mesure-line").click(function(){
		control.addMeasureInteraction("line");
	});
	$("#tool-mesure-polygon").click(function(){
		control.addMeasureInteraction("area");
	});
	
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
	}
	testJsts();
	
	
	$("#request-get").click(function(){
		var name = "100274";
		var data = {
			"service": "wfs",
			"version": "2.0.0",
			"request": "GetFeature",
			"typeName": "sxdx:sxdx_grid",//图层
			// "typeName": "tiger:poi",
			"outputFormat": "application/json",
			"crs":"EPSG:4326",
			// "cql_filter": "INTERSECTS(geometry,SRID=4326;POINT(113.28 38.09))"
			// "cql_filter": "INTERSECTS(geometry,POINT(113.28 38.09))"
			// "cql_filter": 'INTERSECTS(geometry, SRID=4326;POLYGON((112.25796325683595 38.00728546142579,112.28611572265626 37.93999420166016,112.31838806152345 38.02376495361329,112.26688964843751 38.042304382324225,112.26997955322267 38.0189584350586,112.28920562744142 38.01689849853516,112.25796325683595 38.00728546142579)))'
			// "cql_filter": 'INTERSECTS(geometry, POLYGON((112.25796325683595 38.00728546142579,112.28611572265626 37.93999420166016,112.31838806152345 38.02376495361329,112.26688964843751 38.042304382324225,112.26997955322267 38.0189584350586,112.28920562744142 38.01689849853516,112.25796325683595 38.00728546142579)))'
			// "bbox":  [112.55492345953222, 36.98169442084354, 112.55511575146055, 37.98184592248583]
			// filter: ol.format.filter.like("NAME", "lo*"),
			"propertyName":"propertyName"
			
		};
		$.ajax({
		  url: "http://localhost:8080/geoserver/wfs",
		  data: data,
		  success: function(response){
			  console.log(response);
			  alert(response.features[0].properties.center_lonlat);
		  },
		  error: function(event, XMLHttpRequest, ajaxOptions, thrownError){
			  debugger
		  }
		});
	})
})