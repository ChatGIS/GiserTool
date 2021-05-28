/* 
	基于JSTS的拓扑关系分析封装
	created by Dreamice on 2021/05/27 
 */
var topoj = {
	/* 
		jsts转换解析器
	 */
	OL3Parser : new jsts.io.OL3Parser(),
	WKTReader : new jsts.io.WKTReader(),
	
	/* 
		根据点坐标获取缓冲区
		range单位：？？？
		返回OpenLayers支持的geometry
	 */
	getBufferByPoint : function(lon, lat, range){
		var point = topoj.WKTReader.read('POINT (' + lon + ' ' + lat + ')');
		var geomBuf = point.buffer(range);
		return topoj.OL3Parser.write(geomBuf);
	},
	
	/*
		根据geometry获取缓冲区
		返回OpenLayers支持的geometry
	 */
	getBufferByGeom : function(olGeom, range){
		var jstsGeom = topoj.OL3Parser.read(olGeom);
		var geomBuf = jstsGeom.buffer(range);
		return topoj.OL3Parser.write(geomBuf);
	},
	
	/* 
		 用于判断两个OpenLayers几何对象是否相交
		 true:相交，false:不相交
	 */
	isIntersection : function(geoOLA, geoOLB){
		var geoA = topoj.OL3Parser.read(geoOLA);
		var geoB = topoj.OL3Parser.read(geoOLB);
		var geoInterscetion = geoA.intersection(geoB);
		if(geoInterscetion.getArea() > 0){
			return true;
		} else {
			return false;
		}
	},
	
	/* 
		用于获取两个OpenLayers几何对象的相交面积
		unit = km：输出单位为平方千米
		unit = m: 输出单位为平方米
	 */
	getAreaIntersection : function(geoOLA, geoOLB, unit){
		var geoA = topoj.OL3Parser.read(geoOLA);
		var geoB = topoj.OL3Parser.read(geoOLB);
		var geoInterscetion = geoA.intersection(geoB);
		var areaInters = geoInterscetion.getArea();
		if(typeof unit == "undefined"){
			return areaInters;
		} else if(unit.trim() == "km"){
			return areaInters * 10000;
		} else if(unit.trim() == "m"){
			return areaInters * 10000000000;
		} else {
			return areaInters;
		}
	},
}