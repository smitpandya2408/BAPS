import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Printer, Download, ArrowLeft, User, Phone, MapPin, Calendar, BookOpen, Star, Info } from 'lucide-react';

const ViewDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/forms/${id}`);
                setForm(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchForm();
    }, [id]);

    if (!form) return <div className="p-8 text-center text-gray-500 font-bold">ડેટા લોડ થઈ રહ્યો છે...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20 p-4 md:p-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 no-print bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-saffron font-bold w-full sm:w-auto">
                    <ArrowLeft size={20} />
                    <span>પાછા જાઓ</span>
                </button>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button onClick={() => window.print()} className="flex-1 sm:flex-none bg-gray-800 text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-900 transition-all font-bold">
                        <Printer size={20} />
                        <span>પ્રિન્ટ</span>
                    </button>
                    <button className="flex-1 sm:flex-none bg-saffron text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-saffron-dark transition-all font-bold shadow-lg shadow-saffron/20">
                        <Download size={20} />
                        <span>PDF</span>
                    </button>
                </div>
            </div>

            {/* Printable Area */}
            <div className="bg-white p-6 md:p-12 shadow-2xl print:shadow-none print:p-0 border border-gray-100 rounded-3xl" id="printable-form">
                <div className="text-center mb-10 border-b-4 border-saffron pb-6">
                    <h1 className="text-4xl md:text-5xl font-black text-saffron-dark tracking-tighter">BAPS સંસ્કારધામ</h1>
                    <p className="text-gray-500 font-black mt-2 text-lg uppercase tracking-widest">બાળ રજીસ્ટ્રેશન ફોર્મ</p>
                </div>

                {/* બાળક માહિતી */}
                <Section title="૧. બાળકની વિગત">
                    <div className="flex flex-col md:flex-row gap-10 mb-6">
                        <div className="w-full md:w-48 flex flex-col items-center flex-shrink-0">
                            <div className="w-48 h-60 border-4 border-gray-50 rounded-2xl overflow-hidden shadow-inner bg-gray-50">
                                {form.photo ? (
                                    <img src={`http://localhost:5000${form.photo}`} alt="Child" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><User size={80} className="text-gray-200" /></div>
                                )}
                            </div>
                            <div className="mt-4 bg-saffron text-white px-6 py-1 rounded-full font-black text-sm shadow-md">
                                ID: {form.childId || '-'}
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <DetailItem label="નામ" value={form.firstName} important />
                            <DetailItem label="પિતાનું નામ" value={form.fatherName} important />
                            <DetailItem label="અટક" value={form.lastName} important />
                            <DetailItem label="જન્મ તારીખ" value={form.dob ? new Date(form.dob).toLocaleDateString('gu-IN') : '-'} />
                            <DetailItem label="ઉંમર" value={form.age ? `${form.age} વર્ષ` : '-'} />
                            <DetailItem label="ફોન નં." value={form.phone} />
                            <DetailItem label="બાળ પ્રકાશ ગ્રાહક" value={form.balPrakashSubscriber} />
                            <DetailItem label="ગૃપ" value={form.group} />
                            <DetailItem label="BSS માં સભ્ય" value={form.bssMember} />
                            <DetailItem label="સહસંયોજક" value={form.coordinator} />
                            <div className="sm:col-span-2">
                                <DetailItem label="સરનામું" value={form.address} />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <DetailItem label="છેલ્લે બાળ સ્ટાન્ડર્ડ પરીક્ષા કઈ આપી?" value={form.lastExam} />
                        <DetailItem label="પરીક્ષાનું પરિણામ" value={form.result} />
                    </div>
                </Section>

                {/* સંસ્કાર માહિતી */}
                <Section title="૨. સંસ્કાર માહિતી">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {form.samskar && Object.entries(form.samskar).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${value ? 'bg-saffron border-saffron text-white shadow-md shadow-saffron/20' : 'border-gray-200 bg-gray-50 opacity-50'
                                    }`}>
                                    {value && <span className="font-bold text-xs">✓</span>}
                                </div>
                                <span className={`text-[13px] font-bold ${value ? 'text-gray-900' : 'text-gray-400'}`}>{getGujaratiLabel(key)}</span>
                            </div>
                        ))}
                        {(!form.samskar || Object.keys(form.samskar).length === 0) && <span className="text-gray-400 italic font-medium col-span-4">કોઈ સંસ્કાર માહિતી ઉપલબ્ધ નથી</span>}
                    </div>
                </Section>

                {/* અભ્યાસ */}
                <Section title="૩. અભ્યાસ વિગતો">
                    {form.education ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
                                <DetailItem label="શાળા" value={form.education?.school} />
                                <DetailItem label="ધોરણ" value={form.education?.standard} />
                                <DetailItem label="માધ્યમ" value={form.education?.medium} />
                                <DetailItem label="પરિણામ / ગ્રેડ" value={form.education?.grades} />
                            </div>
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-inner">
                                <p className="text-[10px] uppercase font-black text-gray-400 mb-4 tracking-[0.2em] text-center">શૈક્ષણિક પ્રગતિ (ધોરણ ૧-૮)</p>
                                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                        <div key={num} className="bg-white p-3 rounded-xl border border-gray-100 text-center shadow-sm">
                                            <span className="text-[10px] font-black text-saffron block mb-1">Std {num}</span>
                                            <span className="font-bold text-sm text-gray-900">{form.education?.standardsProgress?.[`std${num}`] || '-'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <span className="text-gray-400 italic font-medium">કોઈ અભ્યાસ માહિતી ઉપલબ્ધ નથી</span>
                    )}
                </Section>

                {/* ટેલેન્ટ */}
                <Section title="૪. ટેલેન્ટ / કલા">
                    <div className="flex flex-wrap gap-3">
                        {form.talent ? (
                            <>
                                {Object.entries(form.talent)
                                    .filter(([_, value]) => value === true)
                                    .map(([key]) => (
                                        <span key={key} className="bg-saffron/10 text-saffron-dark px-4 py-2 rounded-xl font-bold text-sm border border-saffron/20 shadow-sm flex items-center gap-2">
                                            <Star size={14} fill="currentColor" />
                                            {getTalentLabel(key)}
                                        </span>
                                    ))}
                                {Object.values(form.talent).every(v => !v) && <span className="text-gray-400 italic font-medium">કોઈ ટેલેન્ટ પસંદ કરેલ નથી</span>}
                            </>
                        ) : (
                            <span className="text-gray-400 italic font-medium">કોઈ ટેલેન્ટ માહિતી ઉપલબ્ધ નથી</span>
                        )}
                    </div>
                </Section>

                {/* વાલી માહિતી */}
                {form.parentInfo ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 mt-10">
                        <ParentCard title="પિતાની માહિતી" data={form.parentInfo?.father} color="saffron" />
                        <ParentCard title="માતાની માહિતી" data={form.parentInfo?.mother} color="pink" />
                    </div>
                ) : (
                    <div className="mb-10 mt-10">
                        <span className="text-gray-400 italic font-medium">કોઈ વાલી માહિતી ઉપલબ્ધ નથી</span>
                    </div>
                )}

                {/* Footer Section */}
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <DetailItem label="પ્રવેશ તારીખ" value={form.admissionDate ? new Date(form.admissionDate).toLocaleDateString('gu-IN') : '-'} />
                    <DetailItem label="વિદાય તારીખ" value={form.departureDate ? new Date(form.departureDate).toLocaleDateString('gu-IN') : '-'} />
                    <DetailItem label="વિદાયનું કારણ" value={form.departureReason || '-'} />
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value, important }) => (
    <div className="flex flex-col min-w-0">
        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 truncate">{label}</span>
        <span className={`${important ? 'text-xl font-black text-gray-900' : 'font-bold text-gray-700'} truncate`}>{value || '-'}</span>
    </div>
);

const Section = ({ title, children }) => (
    <div className="mb-12">
        <h3 className="text-saffron-dark font-black text-base uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
            <div className="h-3 w-3 bg-saffron rotate-45"></div>
            {title}
            <div className="h-px flex-1 bg-gradient-to-r from-saffron/30 to-transparent"></div>
        </h3>
        <div className="md:px-4">{children}</div>
    </div>
);

const ParentCard = ({ title, data, color }) => (
    <div className={`bg-white border-2 border-gray-50 rounded-[2rem] p-8 shadow-xl shadow-gray-100`}>
        <h4 className={`font-black text-gray-900 border-b-2 border-${color}-500/10 mb-6 pb-2 flex items-center gap-3`}>
            <div className={`w-3 h-3 rounded-full bg-saffron`}></div>
            {title}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div className="sm:col-span-2"><DetailItem label="સંપૂર્ણ નામ" value={data?.name} important /></div>
            <DetailItem label="ઉંમર" value={data?.age} />
            <DetailItem label="મોબાઈલ/ફોન" value={data?.phone} />
            <div className="sm:col-span-2"><DetailItem label="ઈ-મેઈલ" value={data?.email} /></div>
            <DetailItem label="અભ્યાસ" value={data?.study} />
            <DetailItem label="વ્યવસાય" value={data?.occupation} />
            <DetailItem label="છેલ્લી સત્સંગ પરીક્ષા" value={data?.lastSatsangExam} />
            <DetailItem label="બોર્ડ" value={data?.board} />
            <DetailItem label="રવિસભા હાજરી" value={data?.elderSatsangAttendance} />
            <DetailItem label="ઘરસભા" value={data?.gharSabha} />
            <DetailItem label="રવા. પ્રકાશ" value={data?.ravPrakash} />
            <DetailItem label="વર્ગ" value={data?.varg} />
            <DetailItem label="સત્સંગ" value={data?.satsang} />
            <DetailItem label="ગુણાતીત" value={data?.gunatit} />
            <div className="sm:col-span-2 pt-4">
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3 block">પ્રકાર</span>
                <div className="flex flex-wrap gap-2">
                    {data?.type && Object.entries(data.type).map(([key, val]) => (
                        <span key={key} className={`px-4 py-1.5 rounded-full text-xs font-black ${val ? 'bg-saffron text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                            {getTypeLabel(key)}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const getGujaratiLabel = (key) => {
    const labels = {
        kanthi: 'કંઠી', nityapuja: 'નિત્યપૂજા', tilakChandlo: 'તિલક-ચાંદલો', panchangPranam: 'પંચાંગ પ્રણામ',
        arti: 'આરતી', ashtak: 'અષ્ટક', regularity: 'નિયમિતતા', prayerBeforeMeal: 'જમતા પહેલા શ્લોક',
        noAddiction: 'વ્યસન ત્યાગ', noOutsideFood: 'બજાર ખોણી-પીણી ત્યાગ', ekadashi: 'એકાદશી', noTvCinema: 'ટી.વી. ત્યાગ',
        study3Hours: '૩ કલાક અભ્યાસ', dailySatsangReading: 'સત્સંગ વાંચન', gharSabhaAttendance: 'ઘરસભા', weeklyTempleVisit: 'મંદિર દર્શન'
    };
    return labels[key] || key;
};

const getTalentLabel = (key) => {
    const labels = {
        vaktrutva: 'વક્તૃત્વ', nrutya: 'નૃત્ય', tabla: 'તબલા', gayan: 'ગાયન', chitra: 'ચિત્ર',
        karate: 'કરાટે', vadvivad: 'વાદવિવાદ', sevaSanchalan: 'સેવા સંચાલન', computer: 'કોમ્પ્યુટર',
        lekhan: 'લેખન', vachan: 'વાંચન', abhinay: 'અભિનય', other: 'અન્ય'
    };
    return labels[key] || key;
};

const getTypeLabel = (key) => {
    const labels = {
        balak: 'બાળક', yuvak: 'યુવક', sanyukt: 'સંયુક્ત', shakha: 'શાખા',
        balika: 'બાળિકા', yuvati: 'યુવતી', mahila: 'મહિલા'
    };
    return labels[key] || key;
};

export default ViewDetails;
