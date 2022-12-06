class Decorator {
    static PlaceDecorator(id, editorial_summary, geometry) {
        let response = {
            id,
            overview: editorial_summary,
            lat: geometry.location.lat,
            lon: geometry.location.lng
        }
        return response
    }
}


module.exports = {Decorator}