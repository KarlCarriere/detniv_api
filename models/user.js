const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Adresse courriel invalide'],
      maxlength: [50, 'Adresse courriel trop longue']
    },
    name: {
      type: String,
      required: true,
      maxlength: [50, 'Nom trop long']
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Mot de passe trop court']
    },
    city: {
      type: String,
      required: true,
      maxlength: [50, 'Nom de ville trop long']
    },
    cart: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
