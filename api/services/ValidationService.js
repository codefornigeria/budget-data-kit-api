module.exports = {
    jsonResolveError: function(err, res, message) {
        var response = {
            response: {
                message: 'Validation error has occured',
            }
        };

        if (typeof message !== 'undefined') {
            response.response.message = message;
        }
        if (err.Errors) {
            response.response.errors = err.Errors;
            return res.status(400).json(response);
        }
        return res.negotiate(err);
    },

    /*
     * Validate profile
     */
    checkProfile: function(profile) {
        var required = [
            'firstname',
            'lastname',
            'dob',
            'gender',
        ];

        for (var i = 0, j = required.length; i < j; i++) {
            if (!profile.hasOwnProperty(required[i]) || typeof profile[required[i]] == 'undefined') {
                return { status: false, msg: required[i] + " is not set" };
            }

        }
        return { status: true, msg: null };
    },

    /*
     * Check the address durations and make sure its over 5 years
     */
    checkAddresses: function(addresses, user) {
        var data = addresses;
        var sum = 0;
        var _currentAddress = 0,
            _previousAddress = 0;

        if (!Array.isArray(addresses)) {
            return { status: false, msg: "Invalid input format - Addresses must be an array" };
        }

        for (var i = 0, j = data.length; i < j; i++) {
            if (isNaN(parseInt(data[i].duration)) && data[i].type == 'residential') {
                return { status: false, msg: "Addresses duration should be integers" };
            }
            if (data[i].currentAddress && data[i].type == 'residential') {
                _currentAddress += 1;
            } else if (!data[i].currentAddress && data[i].type == 'residential') {
                _previousAddress += 1;
            }

            // when the postal address doesn't have a duration
            if (data[i].duration) {
                sum += parseInt(data[i].duration);
            }
            addresses[i].user = user;
        }

        if (!_previousAddress) {
            return { status: false, msg: "User must have a previous address" };
        }

        if (!_currentAddress) {
            return { status: false, msg: "User must have a current address" };
        }

        if (sum < 60) {
            return { status: false, msg: "Addresses must have a combined duration of at least 5 years" };
        }

        return { status: true, msg: null, data: data };
    },

};
