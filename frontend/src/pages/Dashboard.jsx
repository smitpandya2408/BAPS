import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api/config';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Eye, Edit, Trash2, User, Phone, MapPin, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';

const Dashboard = () => {
    const { hasPermission } = useAuth();
    const [forms, setForms] = useState([]);
    const [search, setSearch] = useState('');
    const [talentFilter, setTalentFilter] = useState([]);
    const [isTalentOpen, setIsTalentOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchForms = async () => {
        try {
            const talentQuery = talentFilter.join(',');
            const res = await axios.get(`${API_URL}/api/forms?search=${search}&talent=${talentQuery}`);
            setForms(res.data);
        } catch (error) {
            toast.error('ડેટા લોડ કરવામાં ભૂલ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForms();
    }, [search, talentFilter]);

    const handleDelete = async (id) => {
        if (window.confirm('શું તમે આ ફોર્મ કાઢી નાખવા માંગો છો?')) {
            try {
                await axios.delete(`${API_URL}/api/forms/${id}`);
                toast.success('ફોર્મ કાઢી નાખવામાં આવ્યું');
                fetchForms();
            } catch (error) {
                toast.error('ભૂલ આવી');
            }
        }
    };

    const handleExport = () => {
        if (forms.length === 0) {
            toast.error('એક્સપોર્ટ માટે કોઈ ડેટા નથી');
            return;
        }

        const boolToYesNo = (val) => val ? 'હા' : 'ના';
        const formatDate = (d) => d ? new Date(d).toLocaleDateString('gu-IN') : '';

        const exportData = forms.map((form, index) => ({
            'ક્રમ': index + 1,
            'બાળક ID': form.childId || '',
            'પ્રથમ નામ': form.firstName || '',
            'પિતાનું નામ': form.fatherName || '',
            'અટક': form.lastName || '',
            'જન્મ તારીખ': formatDate(form.dob),
            'ઉંમર': form.age || '',
            'ફોન નં.': form.phone || '',
            'સરનામું': form.address || '',
            'છેલ્લી પરીક્ષા': form.lastExam || '',
            'પરિણામ': form.result || '',
            'બાલપ્રકાશ ગ્રાહક': form.balPrakashSubscriber || '',
            'ગ્રૂપ': form.group || '',
            'BSS સભ્ય': form.bssMember || '',
            'કોઓર્ડિનેટર': form.coordinator || '',

            // Education
            'ધોરણ': form.education?.standard || '',
            'માધ્યમ': form.education?.medium || '',
            'શાળા': form.education?.school || '',
            'ગ્રેડ': form.education?.grades || '',

            // Sanskar
            'કંઠી': boolToYesNo(form.samskar?.kanthi),
            'નિત્યપૂજા': boolToYesNo(form.samskar?.nityapuja),
            'તિલક-ચાંદલો': boolToYesNo(form.samskar?.tilakChandlo),
            'પંચાંગ પ્રણામ': boolToYesNo(form.samskar?.panchangPranam),
            'આરતી': boolToYesNo(form.samskar?.arti),
            'અષ્ટક': boolToYesNo(form.samskar?.ashtak),
            'નિયમિતતા': boolToYesNo(form.samskar?.regularity),
            'જમતા પહેલા પ્રાર્થના': boolToYesNo(form.samskar?.prayerBeforeMeal),
            'વ્યસનમુક્ત': boolToYesNo(form.samskar?.noAddiction),
            'બહારનું ખાવાનું નહીં': boolToYesNo(form.samskar?.noOutsideFood),
            'એકાદશી': boolToYesNo(form.samskar?.ekadashi),
            'TV/સિનેમા નહીં': boolToYesNo(form.samskar?.noTvCinema),
            '૭ કલાક અભ્યાસ': boolToYesNo(form.samskar?.study3Hours),
            'દૈનિક સત્સંગ વાંચન': boolToYesNo(form.samskar?.dailySatsangReading),
            'ઘરસભા હાજરી': boolToYesNo(form.samskar?.gharSabhaAttendance),
            'સાપ્તાહિક મંદિર મુલાકાત': boolToYesNo(form.samskar?.weeklyTempleVisit),

            // Talent
            'વકતૃત્વ': boolToYesNo(form.talent?.vaktrutva),
            'નૃત્ય': boolToYesNo(form.talent?.nrutya),
            'તબલા': boolToYesNo(form.talent?.tabla),
            'ગાયન': boolToYesNo(form.talent?.gayan),
            'ચિત્ર': boolToYesNo(form.talent?.chitra),
            'કરાટે': boolToYesNo(form.talent?.karate),
            'વાદવિવાદ': boolToYesNo(form.talent?.vadvivad),
            'સેવા સંચાલન': boolToYesNo(form.talent?.sevaSanchalan),
            'કોમ્પ્યુટર': boolToYesNo(form.talent?.computer),
            'લેખન': boolToYesNo(form.talent?.lekhan),
            'વાંચન': boolToYesNo(form.talent?.vachan),
            'અભિનય': boolToYesNo(form.talent?.abhinay),
            'અન્ય ટેલેન્ટ': boolToYesNo(form.talent?.other),

            // Father Info
            'પિતા - નામ': form.parentInfo?.father?.name || '',
            'પિતા - ઉંમર': form.parentInfo?.father?.age || '',
            'પિતા - ફોન': form.parentInfo?.father?.phone || '',
            'પિતા - ઈમેલ': form.parentInfo?.father?.email || '',
            'પિતા - અભ્યાસ': form.parentInfo?.father?.study || '',
            'પિતા - વ્યવસાય': form.parentInfo?.father?.occupation || '',
            'પિતા - છેલ્લી સત્સંગ પરીક્ષા': form.parentInfo?.father?.lastSatsangExam || '',
            'પિતા - બોર્ડ': form.parentInfo?.father?.board || '',
            'પિતા - સત્સંગ': form.parentInfo?.father?.satsang || '',

            // Mother Info
            'માતા - નામ': form.parentInfo?.mother?.name || '',
            'માતા - ઉંમર': form.parentInfo?.mother?.age || '',
            'માતા - ફોન': form.parentInfo?.mother?.phone || '',
            'માતા - ઈમેલ': form.parentInfo?.mother?.email || '',
            'માતા - અભ્યાસ': form.parentInfo?.mother?.study || '',
            'માતા - વ્યવસાય': form.parentInfo?.mother?.occupation || '',
            'માતા - છેલ્લી સત્સંગ પરીક્ષા': form.parentInfo?.mother?.lastSatsangExam || '',
            'માતા - બોર્ડ': form.parentInfo?.mother?.board || '',
            'માતા - સત્સંગ': form.parentInfo?.mother?.satsang || '',

            // Dates
            'પ્રવેશ તારીખ': formatDate(form.admissionDate),
            'વિદાય તારીખ': formatDate(form.departureDate),
            'વિદાયનું કારણ': form.departureReason || '',
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);

        // Auto-width columns
        const maxWidths = {};
        exportData.forEach(row => {
            Object.keys(row).forEach(key => {
                const val = String(row[key] || '');
                maxWidths[key] = Math.max(maxWidths[key] || key.length, val.length);
            });
        });
        ws['!cols'] = Object.keys(maxWidths).map(key => ({ wch: Math.min(maxWidths[key] + 2, 30) }));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'BAPS બાળક ડેટા');

        const today = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `BAPS_બાળક_ડેટા_${today}.xlsx`);
        toast.success(`${forms.length} રેકોર્ડ એક્સપોર્ટ થયા`);
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="relative z-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="નામ અથવા આઈડી દ્વારા શોધો..."
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-gray-50 focus:border-saffron focus:bg-white bg-gray-50/50 outline-none transition-all placeholder:text-gray-400 font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="w-full sm:w-64 relative">
                    <button
                        onClick={() => setIsTalentOpen(!isTalentOpen)}
                        className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-50 focus:border-saffron focus:bg-white bg-gray-50/50 outline-none transition-all font-bold text-gray-700 flex items-center justify-between shadow-sm"
                    >
                        <span className="truncate">
                            {talentFilter.length === 0 ? 'બધા ટેલેન્ટ' : `ટેલેન્ટ (${talentFilter.length})`}
                        </span>
                        <div className={`transition-transform ${isTalentOpen ? 'rotate-180' : ''}`}>▼</div>
                    </button>

                    {isTalentOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsTalentOpen(false)}></div>
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-100 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto p-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {[
                                    { id: 'vaktrutva', label: 'વકતૃત્વ' },
                                    { id: 'nrutya', label: 'નૃત્ય' },
                                    { id: 'tabla', label: 'તબલા' },
                                    { id: 'gayan', label: 'ગાયન' },
                                    { id: 'chitra', label: 'ચિત્ર' },
                                    { id: 'karate', label: 'કરાટે' },
                                    { id: 'vadvivad', label: 'વાદવિવાદ' },
                                    { id: 'sevaSanchalan', label: 'સેવા સંચાલન' },
                                    { id: 'computer', label: 'કોમ્પ્યુટર' },
                                    { id: 'lekhan', label: 'લેખન' },
                                    { id: 'vachan', label: 'વાંચન' },
                                    { id: 'abhinay', label: 'અભિનય' },
                                    { id: 'other', label: 'અન્ય' }
                                ].map((t) => (
                                    <label key={t.id} className="flex items-center gap-3 p-2 hover:bg-saffron/5 rounded-xl cursor-pointer transition-colors group">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-lg border-2 border-gray-200 text-saffron focus:ring-saffron accent-saffron"
                                            checked={talentFilter.includes(t.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setTalentFilter([...talentFilter, t.id]);
                                                } else {
                                                    setTalentFilter(talentFilter.filter(item => item !== t.id));
                                                }
                                            }}
                                        />
                                        <span className="font-bold text-gray-700 group-hover:text-saffron-dark transition-colors">{t.label}</span>
                                    </label>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleExport}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-green-600/20 transition-all active:scale-95 font-black text-base"
                    >
                        <Download size={22} />
                        <span>એક્સપોર્ટ</span>
                    </button>
                    {hasPermission('canAdd') && (
                        <Link
                            to="/new-form"
                            className="w-full sm:w-auto bg-saffron hover:bg-saffron-dark text-white px-8 py-3.5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-saffron/20 transition-all active:scale-95 font-black text-lg"
                        >
                            <Plus size={24} />
                            <span>નવું ફોર્મ ઉમેરો</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Table Section - Desktop */}
            <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-saffron text-white shadow-sm font-bold">
                                <th className="px-8 py-5 text-sm font-black uppercase tracking-widest">બાળક ID</th>
                                <th className="px-8 py-5 text-sm font-black uppercase tracking-widest">નામ</th>
                                <th className="px-8 py-5 text-sm font-black uppercase tracking-widest">શાળા / ધોરણ</th>
                                <th className="px-8 py-5 text-sm font-black uppercase tracking-widest">ફોન નં.</th>
                                <th className="px-8 py-5 text-sm font-black uppercase tracking-widest text-center">એક્શન</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex justify-center flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
                                            <span className="font-black text-saffron-dark text-lg">ડેટા લોડ થઈ રહ્યો છે...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : forms.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-400 font-bold">કોઈ ડેટા મળ્યો નથી</td>
                                </tr>
                            ) : (
                                forms.map((form) => (
                                    <tr key={form._id} className="hover:bg-primary-50/30 transition-colors group">
                                        <td className="px-8 py-5 font-black text-saffron-dark">{form.childId}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden border-2 border-gray-100 shadow-sm group-hover:border-saffron/30 transition-all">
                                                    {form.photo ? (
                                                        <img src={form.photo.startsWith('http') ? form.photo : `${API_URL}${form.photo}`} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="text-gray-300" size={28} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 group-hover:text-saffron-dark transition-colors">{form.firstName} {form.lastName}</p>
                                                    <p className="text-xs text-gray-400 font-bold">{form.fatherName ? `પિતા: ${form.fatherName}` : ''}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-bold text-gray-700">{form.education?.school || '-'}</p>
                                            <p className="font-black text-[10px] bg-saffron/10 inline-block px-3 py-1 rounded-full text-saffron-dark mt-2 uppercase tracking-wider">
                                                ધોરણ: {form.education?.standard || '-'}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-black text-gray-600">{form.phone}</td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-3">
                                                {hasPermission('canView') && (
                                                    <Link to={`/view-form/${form._id}`} className="p-3 text-saffron-dark bg-saffron/10 hover:bg-saffron hover:text-white rounded-xl transition-all shadow-sm" title="જુઓ">
                                                        <Eye size={20} />
                                                    </Link>
                                                )}
                                                {hasPermission('canEdit') && (
                                                    <Link to={`/edit-form/${form._id}`} className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm" title="એડિટ">
                                                        <Edit size={20} />
                                                    </Link>
                                                )}
                                                {hasPermission('canDelete') && (
                                                    <button onClick={() => handleDelete(form._id)} className="p-3 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm" title="નષ્ટ કરો">
                                                        <Trash2 size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-4">
                {loading ? (
                    <div className="p-10 text-center">
                        <div className="w-10 h-10 border-4 border-saffron border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <span className="font-bold text-saffron-dark">લોડ થઈ રહ્યું છે...</span>
                    </div>
                ) : forms.length === 0 ? (
                    <div className="bg-white p-10 rounded-2xl text-center text-gray-400 font-bold border border-gray-100">કોઈ ડેટા મળ્યો નથી</div>
                ) : (
                    forms.map((form) => (
                        <div key={form._id} className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl shadow-md border border-gray-100 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-gray-50 flex-shrink-0">
                                    {form.photo ? (
                                        <img src={form.photo.startsWith('http') ? form.photo : `${API_URL}${form.photo}`} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="text-gray-200 w-full h-full p-3" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <span className="bg-saffron/10 text-saffron-dark text-[10px] font-black px-2 py-0.5 rounded-full mb-1 inline-block">ID: {form.childId}</span>
                                    </div>
                                    <h3 className="font-black text-gray-900 truncate">{form.firstName} {form.lastName}</h3>
                                    <p className="text-xs text-gray-500 font-bold">Std: {form.education?.standard || '-'} | {form.phone}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2 border-t border-gray-50">
                                {hasPermission('canView') && (
                                    <Link to={`/view-form/${form._id}`} className="flex-1 bg-saffron/10 text-saffron-dark py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-sm">
                                        <Eye size={18} />
                                        <span>જુઓ</span>
                                    </Link>
                                )}
                                {hasPermission('canEdit') && (
                                    <Link to={`/edit-form/${form._id}`} className="flex-1 bg-blue-50 text-blue-600 py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-sm">
                                        <Edit size={18} />
                                        <span>એડિટ</span>
                                    </Link>
                                )}
                                {hasPermission('canDelete') && (
                                    <button onClick={() => handleDelete(form._id)} className="px-4 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
