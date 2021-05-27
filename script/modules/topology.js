/* 
	基于JSTS的拓扑关系分析封装
	created by Dreamice on 2021/05/27 
 */
var topoj = {
	/* 
		jsts转换器
	 */
	OL3Parser : new jsts.io.OL3Parser(),
	
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