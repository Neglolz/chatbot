'use strict';

/**
 * Created by johnnyribeiro on 12/09/2017.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var userSchema = new Schema({
    email: { type: String, required: true },
    rating: { type: Number, default: 0 },
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    username: {
        type: String,
        required: true,
        validate: {
            validator: function validator(username) {
                return username.length > 4;
            }
        }
    },
    password: { type: String, required: true },
    role: { type: Number, default: 0 },
    confirmed: { type: Boolean, default: false }
}, {
    timestamps: true
});

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('idPlayer', userSchema);
//# sourceMappingURL=idplayer.js.map