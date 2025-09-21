const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')


const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour must have less or equal than 40 characters'],
    minlength: [10, 'A tour must have more or equal than 10 characters'],
    validate: {
      validator: function(val) {
        return validator.isAlpha(val, 'en-US', {ignore: ' '})
      },
      message: 'Tour name must contains only characters'
    }
  },
  slug: String,
  duration: {
    type: Number,
    require: [true, 'A tour must have duration']
  },
  maxGroupSize: {
    type: Number,
    require: [true, 'A tour must have group size']
  },
  difficulty: {
    type: String,
    require: [true,'A tour must have difficulty'],
    trim: true,
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'A tour rating must be above or equal 1'],
    max: [5, 'A tour rating must be below or equal 5'],
    set: val => Math.round(val * 10) / 10
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        return val < this.price
      },
      message: 'Price Discount ({VALUE}) must be less than the price'
    }
  },
  summary: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    require: [true, 'A tour must have a Description']
  },
  imageCover: {
    type: String,
    require: [true, 'A tour must have an Image Cover']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  },
  startLocation: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    }
  ],
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ]
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
})

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
})

// DOCUMENT MIDDLEWARE
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower: true})
  next()
})

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
// tourSchema.pre('find', function(next){
  this.find({secretTour: {$ne: true}})
  next()
})

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v'
    })
    next()
})

tourSchema.index({price: 1, ratingsAverage: -1})
tourSchema.index({slug: 1})
tourSchema.index({startLocation: '2dsphere'})

// AGGREGATE MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift( {$match: {secretTour: {$ne: true}}})
//   next()
// })

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour