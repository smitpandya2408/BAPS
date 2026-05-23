const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ChildForm = require('../models/ChildForm');

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Get all forms
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { childId: { $regex: search, $options: 'i' } }
                ]
            };
        }
        const forms = await ChildForm.find(query).sort({ createdAt: -1 });
        res.json(forms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single form
router.get('/:id', async (req, res) => {
    try {
        const form = await ChildForm.findById(req.params.id);
        if (!form) return res.status(404).json({ message: 'Form not found' });
        res.json(form);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const cleanFormData = (data) => {
    if (!data || typeof data !== 'object') return {};

    // Helper to recursively clean empty strings
    const deepClean = (obj) => {
        const cleaned = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
            if (obj[key] === '') {
                cleaned[key] = null;
            } else if (obj[key] && typeof obj[key] === 'object' && !(obj[key] instanceof Date)) {
                cleaned[key] = deepClean(obj[key]);
            } else {
                cleaned[key] = obj[key];
            }
        }
        return cleaned;
    };

    let cleaned = deepClean(data);

    // Ensure nested structures are maintained even after deep cleaning
    const defFather = {
        name: '', age: null, phone: '', email: '', study: '', occupation: '',
        lastSatsangExam: '', board: '', elderSatsangAttendance: '', gharSabha: '',
        ravPrakash: '', varg: '', satsang: '', gunatit: '',
        type: { balak: false, yuvak: false, sanyukt: false, shakha: false }
    };

    const defMother = {
        name: '', age: null, phone: '', email: '', study: '', occupation: '',
        lastSatsangExam: '', board: '', elderSatsangAttendance: '', gharSabha: '',
        ravPrakash: '', varg: '', satsang: '', gunatit: '',
        type: { balika: false, yuvati: false, mahila: false, shakha: false }
    };

    if (!cleaned.parentInfo) {
        cleaned.parentInfo = { father: defFather, mother: defMother };
    } else {
        const f = cleaned.parentInfo.father || {};
        cleaned.parentInfo.father = { ...defFather, ...f, type: { ...defFather.type, ...(f.type || {}) } };
        const m = cleaned.parentInfo.mother || {};
        cleaned.parentInfo.mother = { ...defMother, ...m, type: { ...defMother.type, ...(m.type || {}) } };
    }

    if (!cleaned.samskar) {
        cleaned.samskar = {
            kanthi: false, nityapuja: false, tilakChandlo: false, panchangPranam: false,
            arti: false, ashtak: false, regularity: false, prayerBeforeMeal: false,
            noAddiction: false, noOutsideFood: false, ekadashi: false, noTvCinema: false,
            study3Hours: false, dailySatsangReading: false, gharSabhaAttendance: false, weeklyTempleVisit: false
        };
    }

    return cleaned;
};

// Create form
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        console.log('POST Body:', req.body);
        let formData = JSON.parse(req.body.data);
        formData = cleanFormData(formData);

        if (req.file) {
            formData.photo = `/uploads/${req.file.filename}`;
        }

        const form = new ChildForm(formData);
        await form.save();
        res.status(201).json(form);
    } catch (error) {
        console.error('POST Detailed Error:', error);
        const fs = require('fs');
        fs.appendFileSync('server_errors.log', `[${new Date().toISOString()}] POST ERROR: ${error.stack}\nDATA: ${req.body.data}\n\n`);
        res.status(500).json({ message: error.message });
    }
});

// Update form
router.put('/:id', upload.single('photo'), async (req, res) => {
    try {
        console.log('PUT Body:', req.body);
        let formData = JSON.parse(req.body.data);
        formData = cleanFormData(formData);

        if (req.file) {
            formData.photo = `/uploads/${req.file.filename}`;
        }

        const form = await ChildForm.findByIdAndUpdate(req.params.id, formData, { new: true, runValidators: true });
        if (!form) return res.status(404).json({ message: 'Form not found' });
        res.json(form);
    } catch (error) {
        console.error('PUT Detailed Error:', error);
        const fs = require('fs');
        fs.appendFileSync('server_errors.log', `[${new Date().toISOString()}] PUT ERROR: ${error.stack}\nID: ${req.params.id}\nDATA: ${req.body.data}\n\n`);
        res.status(500).json({ message: error.message });
    }
});

// Delete form
router.delete('/:id', async (req, res) => {
    try {
        await ChildForm.findByIdAndDelete(req.params.id);
        res.json({ message: 'Form deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
