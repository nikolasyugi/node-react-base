function checkFields(fields, object) {
    /* 
    function checks if object contains all fields
    
    String -> Check if not empty and not null
    Booleans -> Check if false or true
    Numbers -> Check if not null
    Arrays -> Check if not empty array
    Object -> Check if not empty object

    Example:
    fields = ["name", "email"]
    object = {
        name: "John"
        email: ""
    }
    returns false
    */
   if (!fields.length) {
       return true
    } else if (Object.keys(object).length === 0) {
        return false
    } else {
        var field = fields.pop()

        if (object[field] === null) { //Already checks integers, floats and booleans
            return false
        } else if (typeof object[field] == "string" && !object[field]) { //String
            return false
        } else if (object[field] instanceof Array && (object[field].length === 0)) { //Array
            return false
        } else if (object[field] instanceof Object && !(object[field] instanceof Array) && ((Object.keys(object[field]).length === 0))) { //Object
            return false
        } else {
            return checkFields(fields, object)
        }
    }
}

module.exports = checkFields;