
class GeoJSONFormat {
    constructor(obj){
        this.type = "point",
        this.coordinates = [obj.lng , obj.lat] // fist longitude then latitude
    }

}
module.exports.GeoJSONFormat = GeoJSONFormat;

class SearchPlace {
    constructor(country){
        this.country = country;
    }
}

module.exports.SearchPlace = SearchPlace;