import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Save, ArrowLeft, Camera, User, BookOpen, Star, Info } from 'lucide-react';

const FormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);

    const [formData, setFormData] = useState({
        childId: '',
        firstName: '',
        fatherName: '',
        lastName: '',
        dob: '',
        age: '',
        phone: '',
        address: '',
        lastExam: '',
        result: '',
        balPrakashSubscriber: '',
        group: '',
        bssMember: '',
        coordinator: '',
        samskar: {
            kanthi: false, nityapuja: false, tilakChandlo: false, panchangPranam: false,
            arti: false, ashtak: false, regularity: false, prayerBeforeMeal: false,
            noAddiction: false, noOutsideFood: false, ekadashi: false, noTvCinema: false,
            study3Hours: false, dailySatsangReading: false, gharSabhaAttendance: false, weeklyTempleVisit: false
        },
        education: {
            standard: '', medium: '', school: '', grades: '',
            standardsProgress: { std1: '', std2: '', std3: '', std4: '', std5: '', std6: '', std7: '', std8: '' }
        },
        talent: {
            vaktrutva: false, nrutya: false, tabla: false, gayan: false, chitra: false,
            karate: false, vadvivad: false, sevaSanchalan: false, computer: false, lekhan: false, vachan: false, abhinay: false, other: false
        },
        parentInfo: {
            father: {
                name: '', age: '', phone: '', email: '', study: '', occupation: '', lastSatsangExam: '', board: '', elderSatsangAttendance: '', gharSabha: '', ravPrakash: '', varg: '', satsang: '', gunatit: '',
                type: { balak: false, yuvak: false, sanyukt: false, shakha: false }
            },
            mother: {
                name: '', age: '', phone: '', email: '', study: '', occupation: '', lastSatsangExam: '', board: '', elderSatsangAttendance: '', gharSabha: '', ravPrakash: '', varg: '', satsang: '', gunatit: '',
                type: { balika: false, yuvati: false, mahila: false, shakha: false }
            }
        },
        admissionDate: '',
        departureDate: '',
        departureReason: ''
    });

    useEffect(() => {
        if (id) {
            const fetchForm = async () => {
                try {
                    const res = await axios.get(`http://localhost:5000/api/forms/${id}`);
                    const data = res.data;

                    // Format dates for inputs
                    const formatDate = (dateStr) => {
                        if (!dateStr) return '';
                        return new Date(dateStr).toISOString().split('T')[0];
                    };

                    // Deep merge or manual set to preserve structure
                    setFormData(prev => ({
                        ...prev,
                        ...data,
                        dob: formatDate(data.dob),
                        admissionDate: formatDate(data.admissionDate),
                        departureDate: formatDate(data.departureDate),
                        samskar: { ...prev.samskar, ...data.samskar },
                        education: {
                            ...prev.education,
                            ...data.education,
                            standardsProgress: { ...prev.education.standardsProgress, ...data.education?.standardsProgress }
                        },
                        talent: { ...prev.talent, ...data.talent },
                        parentInfo: {
                            father: { ...prev.parentInfo.father, ...data.parentInfo?.father, type: { ...prev.parentInfo.father.type, ...data.parentInfo?.father?.type } },
                            mother: { ...prev.parentInfo.mother, ...data.parentInfo?.mother, type: { ...prev.parentInfo.mother.type, ...data.parentInfo?.mother?.type } },
                        }
                    }));

                    if (data.photo) setPhotoPreview(`http://localhost:5000${data.photo}`);
                } catch (error) {
                    toast.error('ફોર્મ લોડ કરવામાં ભૂલ');
                }
            };
            fetchForm();
        }
    }, [id]);

    const handleInputChange = (e, section, subsection, innerSection, field) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        setFormData(prev => {
            if (section && subsection && innerSection && field) {
                const sectionData = prev[section] || {};
                const subsectionData = sectionData[subsection] || {};
                const innerSectionData = subsectionData[innerSection] || {};
                return {
                    ...prev,
                    [section]: {
                        ...sectionData,
                        [subsection]: {
                            ...subsectionData,
                            [innerSection]: {
                                ...innerSectionData,
                                [field]: val
                            }
                        }
                    }
                };
            } else if (section && subsection && innerSection) {
                const sectionData = prev[section] || {};
                const subsectionData = sectionData[subsection] || {};
                return {
                    ...prev,
                    [section]: {
                        ...sectionData,
                        [subsection]: {
                            ...subsectionData,
                            [innerSection]: val
                        }
                    }
                };
            } else if (section && subsection) {
                const sectionData = prev[section] || {};
                return {
                    ...prev,
                    [section]: {
                        ...sectionData,
                        [subsection]: val
                    }
                };
            } else if (section) {
                const sectionData = prev[section] || {};
                return {
                    ...prev,
                    [section]: {
                        ...sectionData,
                        [name]: val
                    }
                };
            } else {
                return { ...prev, [name]: val };
            }
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Prepare data - convert empty strings to null for Date fields
        const submissionData = { ...formData };
        if (!submissionData.dob) submissionData.dob = null;
        if (!submissionData.admissionDate) submissionData.admissionDate = null;
        if (!submissionData.departureDate) submissionData.departureDate = null;

        const data = new FormData();
        data.append('data', JSON.stringify(submissionData));
        if (photoFile) data.append('photo', photoFile);

        try {
            if (id) {
                await axios.put(`http://localhost:5000/api/forms/${id}`, data, { timeout: 30000 });
                toast.success('ફોર્મ સફળતાપૂર્વક અપડેટ થયું');
            } else {
                await axios.post('http://localhost:5000/api/forms', data, { timeout: 30000 });
                toast.success('ફોર્મ સફળતાપૂર્વક સેવ થયું');
            }
            navigate('/');
        } catch (error) {
            console.error('Submission Error:', error.response?.data || error.message);
            toast.error(`સેવ કરવામાં ભૂલ આવી: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto space-y-6 md:space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 no-print bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button type="button" onClick={() => navigate(-1)} className="p-2 text-gray-500 hover:text-saffron-dark hover:bg-saffron/5 rounded-full transition-all">
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                        {id ? 'ફોર્મ એડિટ કરો' : 'નવું રજીસ્ટ્રેશન'}
                    </h2>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-saffron hover:bg-saffron-dark text-white px-10 py-3 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-saffron/20 disabled:opacity-50 font-bold text-lg transition-all active:scale-95"
                >
                    <Save size={22} />
                    <span>{id ? 'અપડેટ' : 'સેવ કરો'}</span>
                </button>
            </div>

            {/* ૨. બાળ માહિતી */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6 border-b-2 border-saffron/20 pb-2">
                    <User className="text-saffron-dark" />
                    <h3 className="text-xl font-bold text-saffron-dark">બાળ માહિતી</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 border-4 border-dashed border-saffron/30 rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden group bg-gray-50/50 hover:bg-saffron/5 transition-all aspect-[3/4]">
                        {photoPreview ? (
                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-2xl shadow-lg shadow-saffron/10" />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400 py-8 text-center px-4">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                    <Camera size={32} className="text-saffron" />
                                </div>
                                <span className="text-sm font-black text-gray-600">બાળકનો ફોટો અપલોડ કરો</span>
                                <p className="text-[10px] text-gray-400 mt-2">CLICK OR DRAG IMAGE HERE</p>
                            </div>
                        )}
                        <input type="file" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" title=" " />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                            <span className="text-white text-sm font-black uppercase tracking-widest bg-saffron/80 px-4 py-2 rounded-xl">ફોટો બદલો</span>
                        </div>
                    </div>

                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">બાળક ID No.</label>
                            <input type="text" name="childId" value={formData.childId || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">નામ</label>
                            <input type="text" name="firstName" value={formData.firstName || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">પિતાનું નામ</label>
                            <input type="text" name="fatherName" value={formData.fatherName || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">અટક</label>
                            <input type="text" name="lastName" value={formData.lastName || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">જન્મ તારીખ</label>
                            <input type="date" name="dob" value={formData.dob || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">ઉંમર</label>
                            <input type="number" name="age" value={formData.age || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">ફોન નં.</label>
                            <input type="text" name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-sm font-semibold text-gray-700">સરનામું</label>
                            <input type="text" name="address" value={formData.address || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">છેલ્લે બાળ સ્ટાન્ડર્ડ પરીક્ષા કઈ આપી?</label>
                            <input type="text" name="lastExam" value={formData.lastExam || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">પરિણામ</label>
                            <input type="text" name="result" value={formData.result || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">બાળ પ્રકાશ ગ્રાહક</label>
                            <input type="text" name="balPrakashSubscriber" value={formData.balPrakashSubscriber || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">ગૃપ</label>
                            <input type="text" name="group" value={formData.group || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">BSS માં સભ્ય છે?</label>
                            <input type="text" name="bssMember" value={formData.bssMember || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">સહસંયોજક</label>
                            <input type="text" name="coordinator" value={formData.coordinator || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ૨. સંસ્કાર માહિતી */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 border-b-2 border-saffron/20 pb-2">
                    <Star className="text-saffron-dark" />
                    <h3 className="text-xl font-bold text-saffron-dark">સંસ્કાર માહિતી</h3>
                </div>
                <p className="text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded">હા માટે (✓) અને ના માટે (✗) નિશાની પેન્સિલથી કરશો.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { id: 'kanthi', label: 'કંઠી' }, { id: 'nityapuja', label: 'નિત્યપૂજા' },
                        { id: 'tilakChandlo', label: 'તિલક-ચાંદલો' }, { id: 'panchangPranam', label: 'પંચાંગ પ્રણામ' },
                        { id: 'arti', label: 'આરતી' }, { id: 'ashtak', label: 'અષ્ટક' },
                        { id: 'regularity', label: 'સભામાં નિયમિતતા' }, { id: 'prayerBeforeMeal', label: 'જમતા પહેલા શ્લોક' },
                        { id: 'noAddiction', label: 'હુંગળી/વ્યસન ત્યાગ' }, { id: 'noOutsideFood', label: 'બજાર ખાણી-પીણી ત્યાગ' },
                        { id: 'ekadashi', label: 'એકાદશી' }, { id: 'noTvCinema', label: 'ટી.વી./સિનેમા ત્યાગ' },
                        { id: 'study3Hours', label: '૩ કલાક અભ્યાસ' }, { id: 'dailySatsangReading', label: 'નિત્ય સત્સંગ વાંચન' },
                        { id: 'gharSabhaAttendance', label: 'ઘરસભામાં હાજરી' }, { id: 'weeklyTempleVisit', label: 'અઠવાડિયે મંદિર દર્શન' }
                    ].map(item => (
                        <label key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer border border-transparent hover:border-gray-200">
                            <input
                                type="checkbox"
                                checked={formData.samskar?.[item.id] || false}
                                onChange={(e) => handleInputChange(e, 'samskar', item.id)}
                                className="w-5 h-5 accent-primary-600"
                            />
                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* ૩. અભ્યાસ */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 border-b-2 border-saffron/20 pb-2">
                    <BookOpen className="text-saffron-dark" />
                    <h3 className="text-xl font-bold text-saffron-dark">અભ્યાસ</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">ધોરણ</label>
                        <input type="text" value={formData.education.standard || ''} onChange={(e) => handleInputChange(e, 'education', 'standard')} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">માધ્યમ</label>
                        <input type="text" value={formData.education.medium || ''} onChange={(e) => handleInputChange(e, 'education', 'medium')} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">શાળા</label>
                        <input type="text" value={formData.education.school || ''} onChange={(e) => handleInputChange(e, 'education', 'school')} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">વાર્ષિક પરીક્ષાના ટકા/ગ્રેડ</label>
                        <input type="text" value={formData.education.grades || ''} onChange={(e) => handleInputChange(e, 'education', 'grades')} className="w-full p-2 border rounded-lg" />
                    </div>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <div key={num} className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 block text-center">ધોરણ {num}</label>
                            <input
                                type="text"
                                value={formData.education.standardsProgress?.[`std${num}`] || ''}
                                onChange={(e) => handleInputChange(e, 'education', 'standardsProgress', `std${num}`)}
                                className="w-full p-1 border rounded text-center text-sm"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* ૪. ટેલેન્ટ */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 border-b-2 border-saffron/20 pb-2">
                    <Star className="text-saffron-dark" />
                    <h3 className="text-xl font-bold text-saffron-dark">ટેલેન્ટ</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {[
                        { id: 'vaktrutva', label: 'વક્તૃત્વ' }, { id: 'nrutya', label: 'નૃત્ય' },
                        { id: 'tabla', label: 'તબલા' }, { id: 'gayan', label: 'ગાયન' },
                        { id: 'chitra', label: 'ચિત્ર' }, { id: 'karate', label: 'કરાટે' },
                        { id: 'vadvivad', label: 'વાદવિવાદ' }, { id: 'sevaSanchalan', label: 'સેવા સંચાલન' },
                        { id: 'computer', label: 'કોમ્પ્યુટર' }, { id: 'lekhan', label: 'લેખન' },
                        { id: 'vachan', label: 'વાંચન' }, { id: 'abhinay', label: 'અભિનય' },
                        { id: 'other', label: 'અન્ય' }
                    ].map(item => (
                        <label key={item.id} className="flex items-center gap-2 group cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.talent?.[item.id] || false}
                                onChange={(e) => handleInputChange(e, 'talent', item.id)}
                                className="w-4 h-4 accent-primary-600"
                            />
                            <span className="text-sm text-gray-700">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* ૫. વાલી માહિતી */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* પિતાની માહિતી */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-saffron-dark mb-4 border-b-2 border-saffron/20 pb-2">પિતાની માહિતી</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2"><label className="text-xs font-bold text-gray-500">સંપૂર્ણ નામ</label>
                                <input type="text" value={formData.parentInfo.father.name || ''} onChange={(e) => handleInputChange(e, 'parentInfo', 'father', 'name')} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div className="col-span-1"><label className="text-xs font-bold text-gray-500">ઉંમર</label>
                                <input type="number" value={formData.parentInfo.father.age || ''} onChange={(e) => handleInputChange(e, 'parentInfo', 'father', 'age')} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div className="col-span-1"><label className="text-xs font-bold text-gray-500">ફોન/મો.</label>
                                <input type="text" value={formData.parentInfo.father.phone || ''} onChange={(e) => handleInputChange(e, 'parentInfo', 'father', 'phone')} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div className="col-span-2"><label className="text-xs font-bold text-gray-500">ઈ-મેઈલ</label>
                                <input type="email" value={formData.parentInfo.father.email || ''} onChange={(e) => handleInputChange(e, 'parentInfo', 'father', 'email')} className="w-full p-2 border rounded-lg" />
                            </div>
                        </div>
                        {/* Same fields for others ... shortened for space but keeping logic */}
                        {['study', 'occupation', 'lastSatsangExam', 'board', 'elderSatsangAttendance', 'gharSabha', 'ravPrakash', 'varg', 'satsang', 'gunatit'].map(field => (
                            <div key={field}><label className="text-xs font-bold text-gray-500 capitalize">{field === 'ravPrakash' ? 'રવા. પ્રકાશ' : field}</label>
                                <input type="text" value={formData.parentInfo.father[field] || ''} onChange={(e) => handleInputChange(e, 'parentInfo', 'father', field)} className="w-full p-2 border rounded-lg text-sm" />
                            </div>
                        ))}
                        <div className="flex gap-4 pt-2">
                            {['balak', 'yuvak', 'sanyukt', 'shakha'].map(t => (
                                <label key={t} className="flex items-center gap-2 text-xs">
                                    <input type="checkbox" checked={formData.parentInfo.father.type?.[t] || false} onChange={(e) => handleInputChange(e, 'parentInfo', 'father', 'type', t)} className="accent-primary-600" />
                                    {t === 'balak' ? 'બાળક' : t === 'yuvak' ? 'યુવક' : t === 'sanyukt' ? 'સંયુક્ત' : 'શાખ'}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* માતાની માહિતી */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-saffron-dark mb-4 border-b-2 border-saffron/20 pb-2">માતાની માહિતી</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2"><label className="text-xs font-bold text-gray-500">સંપૂર્ણ નામ</label>
                                <input type="text" value={formData.parentInfo.mother.name || ''} onChange={(e) => handleInputChange(e, 'parentInfo', 'mother', 'name')} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div className="col-span-1"><label className="text-xs font-bold text-gray-500">ઉંમર</label>
                                <input type="number" value={formData.parentInfo.mother.age || ''} onChange={(e) => handleInputChange(e, 'parentInfo', 'mother', 'age')} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div className="col-span-1"><label className="text-xs font-bold text-gray-500">ફોન/મો.</label>
                                <input type="text" value={formData.parentInfo.mother.phone || ''} onChange={(e) => handleInputChange(e, 'parentInfo', 'mother', 'phone')} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div className="col-span-2"><label className="text-xs font-bold text-gray-500">ઈ-મેઈલ</label>
                                <input type="email" value={formData.parentInfo.mother.email || ''} onChange={(e) => handleInputChange(e, 'parentInfo', 'mother', 'email')} className="w-full p-2 border rounded-lg" />
                            </div>
                        </div>
                        {['study', 'occupation', 'lastSatsangExam', 'board', 'elderSatsangAttendance', 'gharSabha', 'ravPrakash', 'varg', 'satsang', 'gunatit'].map(field => (
                            <div key={field}><label className="text-xs font-bold text-gray-500 capitalize">
                                {field === 'ravPrakash' ? 'રવા. પ્રકાશ' :
                                    field === 'lastSatsangExam' ? 'છેલ્લી સત્સંગ પરીક્ષા' :
                                        field === 'elderSatsangAttendance' ? 'સભામાં હાજરી' :
                                            field === 'gharSabha' ? 'ઘરસભા' :
                                                field === 'study' ? 'અભ્યાસ' :
                                                    field === 'occupation' ? 'વ્યવસાય' :
                                                        field === 'board' ? 'બોર્ડ' :
                                                            field === 'varg' ? 'વર્ગ' :
                                                                field === 'satsang' ? 'સત્સંગ' :
                                                                    field === 'gunatit' ? 'ગુણાતીત' : field}
                            </label>
                                <input type="text" value={formData.parentInfo.mother[field] || ''} onChange={(e) => handleInputChange(e, 'parentInfo', 'mother', field)} className="w-full p-2 border rounded-lg text-sm" />
                            </div>
                        ))}
                        <div className="flex gap-4 pt-2">
                            {['balika', 'yuvati', 'mahila', 'shakha'].map(t => (
                                <label key={t} className="flex items-center gap-2 text-xs">
                                    <input type="checkbox" checked={formData.parentInfo.mother.type?.[t] || false} onChange={(e) => handleInputChange(e, 'parentInfo', 'mother', 'type', t)} className="accent-primary-600" />
                                    {t === 'balika' ? 'બાળિકા' : t === 'yuvati' ? 'યુવતી' : t === 'mahila' ? 'મહિલા' : 'શાખ'}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 border-b pb-2">
                    <Info className="text-primary-600" />
                    <h3 className="text-xl font-bold text-primary-800">અન્ય વિગતો</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">પ્રવેશ તારીખ</label>
                        <input type="date" name="admissionDate" value={formData.admissionDate || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">વિદાય તારીખ</label>
                        <input type="date" name="departureDate" value={formData.departureDate || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">કારણ</label>
                        <input type="text" name="departureReason" value={formData.departureReason || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg" placeholder="(૧. વધુ અભ્યાસ, ૨. બીજે રહેવું, etc.)" />
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">(કારણ : ૧. વધુ અભ્યાસ, ૨. બીજે રહેવું, ૩. સત સેવા, ૪. અનિયમિતતા, ૫. સમયનો અભાવ, ૬. અન્ય)</p>
            </div>

            <div className="flex justify-center pt-6 no-print">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-saffron hover:bg-saffron-dark text-white px-20 py-4 rounded-2xl font-bold text-xl shadow-2xl shadow-saffron/30 transition-all flex items-center gap-3 active:scale-95"
                >
                    {loading ? 'સેવ થઈ રહ્યું છે...' : (id ? 'અપડેટ કરો' : 'સફળતાપૂરવક સેવ કરો')}
                    <Save size={24} />
                </button>
            </div>
        </form>
    );
};

export default FormPage;
