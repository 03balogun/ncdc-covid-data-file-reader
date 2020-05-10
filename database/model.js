/**
 * Created by PhpStorm.
 * User: Balogun Wahab
 */

const mongoose = require('mongoose');


const { Schema } = mongoose;

const ncdcCovidDataSchema = new Schema({
  state: {
    type: String,
    trim: true,
    required: true,
  },
  total_confirmed_cases: {
    type: Number,
    trim: true,
    required: true,
  },
  total_discharged: {
    type: Number,
    required: true,
    unique: true
  },
  total_deaths: {
    type: Number,
    required: true
  },
  total_active_cases: {
    type: Number,
    default () {
      return this.total_confirmed_cases - (this.total_discharged + this.total_deaths);
    }
  },
  report_date: {
    type: Date,
    required: true
  }
});

ncdcCovidDataSchema.statics = {
  valueExists (query) {
    return this.findOne(query)
      .then(result => result);
  }
};

module.exports = mongoose.model('ncdcCovidRecord', ncdcCovidDataSchema);
