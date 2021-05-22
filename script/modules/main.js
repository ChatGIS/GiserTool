$(document).ready(function () {
	var coor = [117.1257,36.6809];
	// 高德底图
	var gaodeTileLayer = new ol.layer.Tile({
		source: new ol.source.XYZ({
			url:'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
		})
	});
			
	
	
	
	var feature = new ol.Feature({
	  geometry: new ol.geom.Point([117.1257,36.6809])
	  });
	// feature.setStyle(style1);
 
	var sourceFeature = new ol.source.Vector();
	
	sourceFeature.addFeature(feature);
	
	var layerFeature = new ol.layer.Vector({
	  source: sourceFeature,
	 // style: style1,
	});
	
	var map = new ol.Map({
		layers:[gaodeTileLayer, layerFeature],
		view: new ol.View({
			center: [117.1257,36.6809],
			//maxZoom: 19,
			zoom: 10,
			projection: 'EPSG:4326'
		}),
		target: 'map'
	})
	
	
	
	style.flashPointStyle(feature);
	
	locate.getCurrentPosition();
	
	var lonlat = locate.getCurrentPosition();
	console.log(lonlat);
	
	// 地图滑动
	map.on("moveend",function(e){
	    getZoomShow();
	}); 
	
	map.on('pointermove', function(e) {
		var coordinate = ol.proj.transform(e.coordinate, map.getView().getProjection().getCode(), 'EPSG:4326');
		$("#mouse_coordinate").val(coordinate[0] + "," + coordinate[1])
		// document.getElementById('mouse_coordinate').innerHTML = '当前鼠标位置：' + formatDegree(coordinate[0], 0, 2) + '&nbsp;&nbsp;' + formatDegree(coordinate[1], 1, 2)
	});
		
	// 获取缩放级别并展示
	function getZoomShow(){
		var zoom = map.getView().getZoom();
		$("#zoom_level").val(zoom);
	}
})