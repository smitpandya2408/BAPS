import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Plus, Eye, Edit, Trash2, User, Phone, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const [forms, setForms] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchForms = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/forms?search=${search}`);
            setForms(res.data);
        } catch (error) {
            toast.error('ડેટા લોડ કરવામાં ભૂલ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForms();
    }, [search]);

    const handleDelete = async (id) => {
        if (window.confirm('શું તમે આ ફોર્મ કાઢી નાખવા માંગો છો?')) {
            try {
                await axios.delete(`http://localhost:5000/api/forms/${id}`);
                toast.success('ફોર્મ કાઢી નાખવામાં આવ્યું');
                fetchForms();
            } catch (error) {
                toast.error('ભૂલ આવી');
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
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
                <Link
                    to="/new-form"
                    className="w-full sm:w-auto bg-saffron hover:bg-saffron-dark text-white px-8 py-3.5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-saffron/20 transition-all active:scale-95 font-black text-lg"
                >
                    <Plus size={24} />
                    <span>નવું ફોર્મ ઉમેરો</span>
                </Link>
            </div>

            {/* Table Section - Desktop */}
            <div className="hidden md:block bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
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
                                                        <img src={`http://localhost:5000${form.photo}`} alt="" className="w-full h-full object-cover" />
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
                                                <Link to={`/view-form/${form._id}`} className="p-3 text-saffron-dark bg-saffron/10 hover:bg-saffron hover:text-white rounded-xl transition-all shadow-sm" title="જુઓ">
                                                    <Eye size={20} />
                                                </Link>
                                                <Link to={`/edit-form/${form._id}`} className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm" title="એડિટ">
                                                    <Edit size={20} />
                                                </Link>
                                                <button onClick={() => handleDelete(form._id)} className="p-3 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm" title="નષ્ટ કરો">
                                                    <Trash2 size={20} />
                                                </button>
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
                        <div key={form._id} className="bg-white p-5 rounded-3xl shadow-md border border-gray-100 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-gray-50 flex-shrink-0">
                                    {form.photo ? (
                                        <img src={`http://localhost:5000${form.photo}`} alt="" className="w-full h-full object-cover" />
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
                                <Link to={`/view-form/${form._id}`} className="flex-1 bg-saffron/10 text-saffron-dark py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-sm">
                                    <Eye size={18} />
                                    <span>જુઓ</span>
                                </Link>
                                <Link to={`/edit-form/${form._id}`} className="flex-1 bg-blue-50 text-blue-600 py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-sm">
                                    <Edit size={18} />
                                    <span>એડિટ</span>
                                </Link>
                                <button onClick={() => handleDelete(form._id)} className="px-4 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
