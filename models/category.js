const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: [50, 'Nom trop long']
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: false
    }
  }
);

module.exports = mongoose.model('Category', categorySchema);