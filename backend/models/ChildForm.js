const mongoose = require('mongoose');

const parentTypeSchema = new mongoose.Schema({
  balak: Boolean,
  yuvak: Boolean,
  sanyukt: Boolean,
  shakha: Boolean,
  balika: Boolean,
  yuvati: Boolean,
  mahila: Boolean,
}, { _id: false });

const parentDetailsSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phone: String,
  email: String,
  study: String,
  occupation: String,
  lastSatsangExam: String,
  board: String,
  elderSatsangAttendance: String,
  gharSabha: String,
  ravPrakash: String,
  varg: String,
  satsang: String,
  gunatit: String,
  type: parentTypeSchema
}, { _id: false });

const childFormSchema = new mongoose.Schema({
  // બાળ માહિતી
  childId: String,
  photo: String,
  firstName: String,
  fatherName: String,
  lastName: String,
  dob: Date,
  age: Number,
  phone: String,
  address: String,
  lastExam: String,
  result: String,
  balPrakashSubscriber: String,
  group: String,
  bssMember: String,
  coordinator: String,

  // સંસ્કાર માહિતી (Checkboxes)
  samskar: {
    kanthi: Boolean,
    nityapuja: Boolean,
    tilakChandlo: Boolean,
    panchangPranam: Boolean,
    arti: Boolean,
    ashtak: Boolean,
    regularity: Boolean,
    prayerBeforeMeal: Boolean,
    noAddiction: Boolean,
    noOutsideFood: Boolean,
    ekadashi: Boolean,
    noTvCinema: Boolean,
    study3Hours: Boolean,
    dailySatsangReading: Boolean,
    gharSabhaAttendance: Boolean,
    weeklyTempleVisit: Boolean,
  },

  // અભ્યાસ
  education: {
    standard: String,
    medium: String,
    school: String,
    grades: String,
    standardsProgress: {
      std1: String, std2: String, std3: String, std4: String,
      std5: String, std6: String, std7: String, std8: String,
    }
  },

  // ટેલેન્ટ
  talent: {
    vaktrutva: Boolean, nrutya: Boolean, tabla: Boolean, gayan: Boolean,
    chitra: Boolean, karate: Boolean, vadvivad: Boolean, sevaSanchalan: Boolean,
    computer: Boolean, lekhan: Boolean, vachan: Boolean, abhinay: Boolean,
    other: Boolean,
  },

  // વાલી માહિતી
  parentInfo: {
    father: parentDetailsSchema,
    mother: parentDetailsSchema
  },

  // Bottom Section
  admissionDate: Date,
  departureDate: Date,
  departureReason: String,

}, { timestamps: true });

module.exports = mongoose.model('ChildForm', childFormSchema);
