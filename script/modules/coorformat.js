var coorf = {
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
	
	transLonlatArr : function(arr,scor,tcor){ //坐标转化   
			var obj = {};
			obj.cor = tcor;
			if(scor == tcor ){   //相同坐标不转为
				obj.arr = arr;
			}else if(scor == 1 && tcor == 2){  //标准坐标4326转为火星坐标4326
				obj.arr = gcsp.util.corToArr(arr,true);
			}else if(scor == 2 && tcor == 1){  //火星坐标转4326为标准坐标4326
				obj.arr = gcsp.util.corFromArr(arr,true);
			}else if(scor == 1 && tcor == 3){  //标准坐标4326转为900913，中间要用火星坐标
				//obj.arr = gcsp.util.transto9(arr);
				obj.arr = gcsp.util.transLonlatArr(arr, 1, 2).arr;
				obj.arr = gcsp.util.transto9(obj.arr);
			}else if(scor == 3 && tcor == 1){  //900913转为标准坐标4326，中间要用火星坐标
				//obj.arr = gcsp.util.transfrom9(arr);
				obj.arr = gcsp.util.transfrom9(arr);
				obj.arr = gcsp.util.transLonlatArr(obj.arr, 1, 2).arr;
	        }else if(scor == 2 && tcor == 3){  //火星坐标4326转为900913
	        	//obj.arr = gcsp.util.transLonlatArr(arr, 2, 1).arr;
	        	//obj.arr = gcsp.util.transto9(obj.arr);
	        	obj.arr = gcsp.util.transto9(arr);
			}else if(scor == 3 && tcor == 2){  //900913转为火星坐标4326
				//obj.arr = gcsp.util.transfrom9(arr);
				//obj.arr = gcsp.util.transLonlatArr(obj.arr, 2, 1).arr;
				obj.arr = gcsp.util.transfrom9(arr);
			}else if(scor == 1 && tcor == 4){  //标准坐标到百度坐标
				obj.arr = gcsp.util.corToArr(arr,true);
				obj.arr = gcsp.util.transLonlatArr(obj.arr, 2, 4).arr;
			}else if(scor == 2 && tcor == 4){  //火星坐标到百度坐标
				obj.arr = gcsp.util.bdFromArr(arr);
			}else if(scor == 3 && tcor == 4){  //900913到百度坐标
				obj.arr = gcsp.util.transLonlatArr(arr, 3, 2).arr;
				obj.arr = gcsp.util.transLonlatArr(obj.arr, 2, 4).arr;
			}else if(scor == 4 && tcor == 1){  //百度坐标到标准坐标
				obj.arr = gcsp.util.bdToArr(arr);
				obj.arr = gcsp.util.transLonlatArr(obj.arr, 2, 1).arr;
			}else if(scor == 4 && tcor == 2){  //百度坐标到火星坐标
				obj.arr = gcsp.util.bdToArr(arr);
			}else if(scor == 4 && tcor == 3){  //百度坐标到900913
				obj.arr = gcsp.util.bdToArr(arr);
				obj.arr = gcsp.util.transLonlatArr(obj.arr, 2, 3).arr;
			}
			return obj;
		},
}