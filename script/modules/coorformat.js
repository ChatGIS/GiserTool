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
}