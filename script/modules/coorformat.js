var coorf = {
	PI: 3.14159265358979324,
	x_pi: 3.14159265358979324 * 3000.0 / 180.0,
	/**
	 * Format length output.
	 * @param {ol.geom.LineString} line The line.
	 * @param type 1:地理坐标系距离 2：投影坐标系距离
	 * @return {string} The formatted length.
	 */
	formatLength : function(line, type) {
	    var length;
	    if (type == 1) {
	        var coordinates = line.getCoordinates();
	        length = 0;
			// getProjection获取方式变化
	        // var sourceProj = map.getView().getProjection();
			var sourceProj = map.getView().getProjection().getCode();
	        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
	            var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
	            var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
	            /* openlayers3废弃方法
				length += wgs84Sphere.haversineDistance(c1, c2); */
				length += ol.sphere.getDistance(c1, c2);
	        }
	    } else {
	        length = Math.round(line.getLength() * 100) / 100;
	    }
	    var output;
	    if (length > 100) {
	        output = (Math.round(length / 1000 * 100) / 100) +
	            ' ' + 'km';
	    } else {
	        output = (Math.round(length * 100) / 100) +
	            ' ' + 'm';
	    }
	    return output;
	},
	
	
	/**
	 * Format area output.
	 * @param {ol.geom.Polygon} polygon The polygon.
	 * @param type 1:地理坐标系距离 2：投影坐标系距离
	 * @return {string} Formatted area.
	 */
	formatArea : function(polygon, type) {
	    var area;
	    if (type == 1) {
	        /* var sourceProj = map.getView().getProjection(); */
			var sourceProj = 'EPSG:4326';
	        var geom = /** @type {ol.geom.Polygon} */ (polygon.clone().transform(
	            sourceProj, 'EPSG:4326'));
	        /* openlayers3废弃方法
			var coordinates = geom.getLinearRing(0).getCoordinates();
	        area = Math.abs(.geodesicArea(coordinates)); */
			//console.log(ol.sphere.getArea(geom,{"projection":sourceProj, "radius":6378137}));
			//area = Math.abs(ol.sphere.getArea(geom) * 10000);
			area = Math.abs(ol.sphere.getArea(geom,{"projection":sourceProj, "radius":6378137}));
	    } else {
	        area = polygon.getArea();
	    }
	    var output;
	    if (area > 10000) {
	        output = (Math.round(area / 1000000 * 100) / 100) +
	            ' ' + 'km<sup>2</sup>';
	    } else {
	        output = (Math.round(area * 100) / 100) +
	            ' ' + 'm<sup>2</sup>';
	    }
	    return output;
	},
	
	/* 
		坐标转换
	 */
	transLonlat : function(coor, fcs, tcs){   
		var obj = {};
		if(fcs == tcs ){   //相同坐标不转为
			obj.coor = coor;
		}else if(fcs == 2 && tcs == 3){  // GCJ02转为BD09
			obj.coor = coorf.transGcjToBd(coor);
		}else if(fcs == 3 && tcs == 2){  // BD09转为GCJ02
			obj.coor = coorf.transBdToGcj(coor);
		}else if(fcs == 1 && tcs == 2){  // 标准坐标4326转为火星坐标4326
			obj.coor = coorf.corToArr(coor);
		}else if(fcs == 2 && tcs == 1){  //火星坐标转4326为标准坐标4326
			obj.coor = coorf.transGcjToWgs(coor);
		}/* else if(fcs == 1 && tcs == 3){  //标准坐标4326转为900913，中间要用火星坐标
			//obj.arr = gcsp.util.transto9(arr);
			obj.arr = gcsp.util.transLonlatArr(arr, 1, 2).arr;
			obj.arr = gcsp.util.transto9(obj.arr);
		}else if(fcs == 3 && tcs == 1){  //900913转为标准坐标4326，中间要用火星坐标
			//obj.arr = gcsp.util.transfrom9(arr);
			obj.arr = gcsp.util.transfrom9(arr);
			obj.arr = gcsp.util.transLonlatArr(obj.arr, 1, 2).arr;
		}else if(fcs == 2 && tcs == 3){  //火星坐标4326转为900913
			//obj.arr = gcsp.util.transLonlatArr(arr, 2, 1).arr;
			//obj.arr = gcsp.util.transto9(obj.arr);
			obj.arr = gcsp.util.transto9(arr);
		}else if(fcs == 3 && tcs == 2){  //900913转为火星坐标4326
			//obj.arr = gcsp.util.transfrom9(arr);
			//obj.arr = gcsp.util.transLonlatArr(obj.arr, 2, 1).arr;
			obj.arr = gcsp.util.transfrom9(arr);
		}else if(fcs == 1 && tcs == 4){  //标准坐标到百度坐标
			obj.arr = gcsp.util.corToArr(arr,true);
			obj.arr = gcsp.util.transLonlatArr(obj.arr, 2, 4).arr;
		}else if(fcs == 2 && tcs == 4){  //火星坐标到百度坐标
			obj.arr = gcsp.util.bdFromArr(arr);
		}else if(fcs == 3 && tcs == 4){  //900913到百度坐标
			obj.arr = gcsp.util.transLonlatArr(arr, 3, 2).arr;
			obj.arr = gcsp.util.transLonlatArr(obj.arr, 2, 4).arr;
		}else if(fcs == 4 && tcs == 1){  //百度坐标到标准坐标
			obj.arr = gcsp.util.bdToArr(arr);
			obj.arr = gcsp.util.transLonlatArr(obj.arr, 2, 1).arr;
		}else if(fcs == 4 && tcs == 2){  //百度坐标到火星坐标
			obj.arr = gcsp.util.bdToArr(arr);
		}else if(fcs == 4 && tcs == 3){  //百度坐标到900913
			obj.arr = gcsp.util.bdToArr(arr);
			obj.arr = gcsp.util.transLonlatArr(obj.arr, 2, 3).arr;
		} */
		return obj;
	},
	
	// 火星坐标转为WGS84标准坐标
	transGcjToWgs: function (arr) {
		var returnArr = [];
		var length = arr.length;
		for (var i = 0; i < length; i = i + 2) {
			var ll = coorf.gcj_decrypt_exact(parseFloat(arr[i + 1]), parseFloat(arr[i]));
			returnArr.push(parseFloat(ll.lon));
			returnArr.push(parseFloat(ll.lat));
		}
		return returnArr;
	},
		
	// 火星坐标转为百度
	transGcjToBd: function (arr) {
		var returnArr = [];
		var length = arr.length;
		for (var i = 0; i < length; i = i + 2) {
		   if(i+2>length) continue;
		   var lon = parseFloat(arr[i]);
		   var lat = parseFloat(arr[i+1]);
		   var ll = coorf.bd_encrypt(lat, lon);
		   returnArr.push(parseFloat(ll.lon));
		   returnArr.push(parseFloat(ll.lat));
		}
		return returnArr;
	},
	
	// 百度坐标转为火星坐标
	transBdToGcj: function (arr) {  
		var returnArr = [];
		var length = arr.length;
		for (var i = 0; i < length; i = i + 2) {
			if(i+2>length) continue;
			var lon = parseFloat(arr[i]);
			var lat = parseFloat(arr[i+1]);
			var ll = coorf.bd_decrypt(lat, lon);
			returnArr.push(parseFloat(ll.lon));
			returnArr.push(parseFloat(ll.lat));
		}
		return returnArr;
	},
	
	delta : function (lat, lon) {
		// Krasovsky 1940
		//
		// a = 6378245.0, 1/f = 298.3
		// b = a * (1 - f)
		// ee = (a^2 - b^2) / a^2;
		var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
		var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
		var dLat = this.transformLat(lon - 105.0, lat - 35.0);
		var dLon = this.transformLon(lon - 105.0, lat - 35.0);
		var radLat = lat / 180.0 * this.PI;
		var magic = Math.sin(radLat);
		magic = 1 - ee * magic * magic;
		var sqrtMagic = Math.sqrt(magic);
		dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
		dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
		return {'lat': dLat, 'lon': dLon};
	},
	
	 transformLat: function (x, y) {
		var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
		ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
		ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
		ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
		return ret;
	},
	transformLon: function (x, y) {
		var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
		ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
		ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
		ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
		return ret;
	},
		   
	//WGS-84 to GCJ-02
	gcj_encrypt : function (wgsLat, wgsLon) {
		if (this.outOfChina(wgsLat, wgsLon))
			return {'lat': wgsLat, 'lon': wgsLon};
 
		var d = this.delta(wgsLat, wgsLon);
		return {'lat' : wgsLat + d.lat,'lon' : wgsLon + d.lon};
	},
	
	// GCJ-02 to WGS-84
	gcj_decrypt : function (gcjLat, gcjLon) {
		if (this.outOfChina(gcjLat, gcjLon))
			return {'lat': gcjLat, 'lon': gcjLon};
		 
		var d = this.delta(gcjLat, gcjLon);
		return {'lat': gcjLat - d.lat, 'lon': gcjLon - d.lon};
	},
	// GCJ-02 to WGS-84 exactly
	// 精确(二分极限法)
	gcj_decrypt_exact : function (gcjLat, gcjLon) {
		var initDelta = 0.01;
		var threshold = 0.000000001;	// var threshold = 0.000000001; 目前设置的是精确到小数点后9位，这个值越小，越精确，但是javascript中，浮点运算本身就不太精确，九位在GPS里也偏差不大了
		var dLat = initDelta, dLon = initDelta;
		var mLat = gcjLat - dLat, mLon = gcjLon - dLon;
		var pLat = gcjLat + dLat, pLon = gcjLon + dLon;
		var wgsLat, wgsLon, i = 0;
		while (1) {
			wgsLat = (mLat + pLat) / 2;
			wgsLon = (mLon + pLon) / 2;
			var tmp = this.gcj_encrypt(wgsLat, wgsLon)
			dLat = tmp.lat - gcjLat;
			dLon = tmp.lon - gcjLon;
			if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold))
				break;
 
			if (dLat > 0) pLat = wgsLat; else mLat = wgsLat;
			if (dLon > 0) pLon = wgsLon; else mLon = wgsLon;
 
			if (++i > 10000) break;
		}
		//console.log(i);
		return {'lat': wgsLat, 'lon': wgsLon};
	},
	
	//GCJ-02 to BD-09
	bd_encrypt : function (gcjLat, gcjLon) {
		var x = gcjLon, y = gcjLat; 
		var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this .x_pi); 
		var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this .x_pi); 
		bdLon = z * Math.cos(theta) + 0.0065; 
		bdLat = z * Math.sin(theta) + 0.006;
		return { 'lat' : bdLat, 'lon' : bdLon};
	},
	
	//BD-09 to GCJ-02
	bd_decrypt : function (bdLat, bdLon) {
		var x = bdLon - 0.0065, y = bdLat - 0.006; 
		var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this .x_pi); 
		var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this .x_pi); 
		var gcjLon = z * Math.cos(theta); 
		var gcjLat = z * Math.sin(theta);
		return { 'lat' : gcjLat, 'lon' : gcjLon};
	},
	
	// 判断是否在国内
	outOfChina: function (lat, lon) {
		if (lon < 72.004 || lon > 137.8347)
			return true;
		if (lat < 0.8293 || lat > 55.8271)
			return true;
		return false;
	},
	/* 
		源坐标类型：
		1：GPS标准坐标（wgs84）；
		2：搜狗地图坐标；
		3：火星坐标（gcj02），即高德地图、腾讯地图和MapABC等地图使用的坐标；
		4：3中列举的地图坐标对应的墨卡托平面坐标;
		5：百度地图采用的经纬度坐标（bd09ll）；
		6：百度地图采用的墨卡托平面坐标（bd09mc）;
		7：图吧地图坐标；
		8：51地图坐标；
		
		目标坐标类型：
		3：火星坐标（gcj02），即高德地图、腾讯地图及MapABC等地图使用的坐标；
		5：百度地图采用的经纬度坐标（bd09ll）；
		6：百度地图采用的墨卡托平面坐标（bd09mc）；
	 */
	transLonlatBD : function(coor, fcs, tcs){
		var coorObj = {};
		$.ajax({
			url: "https://api.map.baidu.com/geoconv/v1/?coords="+ coor[0] +","+ coor[1] +"&from="+fcs+"&to="+tcs+"&ak=" + mapkey.bdKey +"&callback=?",
			// url:"https://restapi.amap.com/v3/geocode/geo?key=" + mapkey.gdKey + "=" + "济南市高新万达",
			async: false, // dataType:'JSONP'时，不起作用
			// dataType:'JSONP',  // 解决跨域问题
			success: function(response){
				var coor = response.result[0].x + "," + response.result[0].y;
				console.log("百度坐标" + coor);
				coorObj.coor = coor.split(",");
				// return coorObj;
				callBack(coor);
			},
		});
	}
}