class Decorator {
    static PlaceDecorator(id, editorial_summary, geometry, name) {
        let response = {
            id,
            overview: editorial_summary,
            lat: geometry.location.lat,
            lon: geometry.location.lng,
            name
        }
        return response
    }
}


module.exports = {Decorator}