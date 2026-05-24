import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../api/config';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Edit, Trash2, Shield, ShieldCheck, X, Eye, EyeOff, Save, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        permissions: {
            canView: true,
            canAdd: false,
            canEdit: false,
            canDelete: false,
        },
    });

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/users`);
            setUsers(res.data);
        } catch (error) {
            toast.error('યુઝર ડેટા લોડ કરવામાં ભૂલ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'user',
            permissions: {
                canView: true,
                canAdd: false,
                canEdit: false,
                canDelete: false,
            },
        });
        setEditingUser(null);
        setShowPassword(false);
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name || '',
            email: user.email,
            password: '',
            role: user.role,
            permissions: user.permissions || {
                canView: true,
                canAdd: false,
                canEdit: false,
                canDelete: false,
            },
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password;
                await axios.put(`${API_URL}/api/users/${editingUser._id}`, updateData);
                toast.success('યુઝર અપડેટ થયો');
            } else {
                if (!formData.password) {
                    toast.error('પાસવર્ડ જરૂરી છે');
                    return;
                }
                await axios.post(`${API_URL}/api/users`, formData);
                toast.success('નવો યુઝર બનાવ્યો');
            }
            setShowModal(false);
            resetForm();
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'ભૂલ આવી');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('શું તમે આ યુઝર કાઢી નાખવા માંગો છો?')) {
            try {
                await axios.delete(`${API_URL}/api/users/${id}`);
                toast.success('યુઝર કાઢી નાખ્યો');
                fetchUsers();
            } catch (error) {
                toast.error(error.response?.data?.message || 'ભૂલ આવી');
            }
        }
    };

    const handleToggleActive = async (user) => {
        try {
            await axios.put(`${API_URL}/api/users/${user._id}`, {
                ...user,
                isActive: !user.isActive,
            });
            toast.success(`યુઝર ${!user.isActive ? 'એક્ટીવ' : 'ડીએક્ટીવ'} થયો`);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'ભૂલ આવી');
        }
    };

    const permissionLabels = {
        canView: { label: 'જોવા', icon: '👁️' },
        canAdd: { label: 'નવું ઉમેરવા', icon: '➕' },
        canEdit: { label: 'એડિટ', icon: '✏️' },
        canDelete: { label: 'ડિલીટ', icon: '🗑️' },
    };

    if (currentUser?.role !== 'admin') {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-lg border border-red-100">
                    <Shield size={48} className="mx-auto text-red-400 mb-4" />
                    <h2 className="text-xl font-black text-gray-800">પ્રવેશ નિષેધ</h2>
                    <p className="text-gray-500 mt-2 font-bold">ફક્ત એડમિન જ આ પેજ જોઈ શકે છે.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="relative z-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                    <Users size={28} className="text-saffron-dark" />
                    <h1 className="text-2xl font-black text-gray-800">યુઝર મેનેજમેન્ટ</h1>
                    <span className="bg-saffron/10 text-saffron-dark text-sm font-black px-3 py-1 rounded-full">
                        {users.length} યુઝર
                    </span>
                </div>
                <button
                    onClick={openCreateModal}
                    className="w-full sm:w-auto bg-saffron hover:bg-saffron-dark text-white px-8 py-3.5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-saffron/20 transition-all active:scale-95 font-black text-lg"
                >
                    <UserPlus size={24} />
                    <span>નવો યુઝર ઉમેરો</span>
                </button>
            </div>

            {/* Users Table */}
            <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-saffron text-white shadow-sm font-bold">
                                <th className="px-6 py-5 text-sm font-black uppercase tracking-widest">નામ</th>
                                <th className="px-6 py-5 text-sm font-black uppercase tracking-widest">ઈમેલ</th>
                                <th className="px-6 py-5 text-sm font-black uppercase tracking-widest">ભૂમિકા</th>
                                <th className="px-6 py-5 text-sm font-black uppercase tracking-widest">પરવાનગીઓ</th>
                                <th className="px-6 py-5 text-sm font-black uppercase tracking-widest">સ્ટેટસ</th>
                                <th className="px-6 py-5 text-sm font-black uppercase tracking-widest text-center">એક્શન</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center">
                                        <div className="flex justify-center flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
                                            <span className="font-black text-saffron-dark text-lg">ડેટા લોડ થઈ રહ્યો છે...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center text-gray-400 font-bold">કોઈ યુઝર મળ્યો નથી</td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u._id} className="hover:bg-primary-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${u.role === 'admin' ? 'bg-saffron/10' : 'bg-blue-50'}`}>
                                                    {u.role === 'admin' ? <ShieldCheck size={20} className="text-saffron-dark" /> : <Shield size={20} className="text-blue-500" />}
                                                </div>
                                                <span className="font-black text-gray-900">{u.name || u.email.split('@')[0]}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-bold text-gray-600">{u.email}</td>
                                        <td className="px-6 py-5">
                                            <span className={`text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${u.role === 'admin' ? 'bg-saffron/10 text-saffron-dark' : 'bg-blue-50 text-blue-600'}`}>
                                                {u.role === 'admin' ? 'એડમિન' : 'યુઝર'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-wrap gap-1.5">
                                                {Object.entries(u.permissions || {}).map(([key, value]) => (
                                                    value && (
                                                        <span key={key} className="text-[10px] font-black px-2 py-1 rounded-lg bg-green-50 text-green-600">
                                                            {permissionLabels[key]?.label}
                                                        </span>
                                                    )
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <button
                                                onClick={() => handleToggleActive(u)}
                                                disabled={u._id === currentUser?._id}
                                                className={`text-xs font-black px-3 py-1.5 rounded-full cursor-pointer transition-all ${u.isActive
                                                        ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                                        : 'bg-red-50 text-red-500 hover:bg-red-100'
                                                    } ${u._id === currentUser?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {u.isActive ? 'એક્ટીવ' : 'ડીએક્ટીવ'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-3">
                                                <button onClick={() => openEditModal(u)} className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm" title="એડિટ">
                                                    <Edit size={18} />
                                                </button>
                                                {u._id !== currentUser?._id && (
                                                    <button onClick={() => handleDelete(u._id)} className="p-3 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm" title="ડિલીટ">
                                                        <Trash2 size={18} />
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

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {users.map((u) => (
                    <div key={u._id} className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl shadow-md border border-gray-100 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${u.role === 'admin' ? 'bg-saffron/10' : 'bg-blue-50'}`}>
                                {u.role === 'admin' ? <ShieldCheck size={24} className="text-saffron-dark" /> : <Shield size={24} className="text-blue-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-black text-gray-900 truncate">{u.name || u.email.split('@')[0]}</h3>
                                <p className="text-xs text-gray-500 font-bold">{u.email}</p>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-saffron/10 text-saffron-dark' : 'bg-blue-50 text-blue-600'}`}>
                                {u.role === 'admin' ? 'એડમિન' : 'યુઝર'}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {Object.entries(u.permissions || {}).map(([key, value]) => (
                                value && (
                                    <span key={key} className="text-[10px] font-black px-2 py-1 rounded-lg bg-green-50 text-green-600">
                                        {permissionLabels[key]?.icon} {permissionLabels[key]?.label}
                                    </span>
                                )
                            ))}
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-gray-50">
                            <button onClick={() => openEditModal(u)} className="flex-1 bg-blue-50 text-blue-600 py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-sm">
                                <Edit size={16} /> એડિટ
                            </button>
                            {u._id !== currentUser?._id && (
                                <button onClick={() => handleDelete(u._id)} className="px-4 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowModal(false); resetForm(); }}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-saffron text-white px-6 py-5 rounded-t-3xl flex justify-between items-center">
                            <h2 className="text-xl font-black">
                                {editingUser ? 'યુઝર એડિટ કરો' : 'નવો યુઝર ઉમેરો'}
                            </h2>
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2">નામ</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-saffron outline-none transition-all font-bold"
                                    placeholder="યુઝરનું નામ"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2">ઈમેલ *</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-saffron outline-none transition-all font-bold"
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2">
                                    પાસવર્ડ {editingUser ? '(ખાલી રાખો તો બદલાશે નહીં)' : '*'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-100 focus:border-saffron outline-none transition-all font-bold"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required={!editingUser}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2">ભૂમિકા</label>
                                <div className="flex gap-3">
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all font-bold ${formData.role === 'admin' ? 'border-saffron bg-saffron/10 text-saffron-dark' : 'border-gray-100 hover:border-gray-200'}`}>
                                        <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="hidden" />
                                        <ShieldCheck size={18} />
                                        એડમિન
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all font-bold ${formData.role === 'user' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-100 hover:border-gray-200'}`}>
                                        <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="hidden" />
                                        <Shield size={18} />
                                        યુઝર
                                    </label>
                                </div>
                            </div>

                            {/* Permissions (only for user role) */}
                            {formData.role === 'user' && (
                                <div>
                                    <label className="block text-sm font-black text-gray-700 mb-3">પરવાનગીઓ</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(permissionLabels).map(([key, { label, icon }]) => (
                                            <label
                                                key={key}
                                                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.permissions[key] ? 'border-green-400 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 rounded accent-saffron"
                                                    checked={formData.permissions[key]}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        permissions: { ...formData.permissions, [key]: e.target.checked }
                                                    })}
                                                />
                                                <span className="font-bold text-sm text-gray-700">{icon} {label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {formData.role === 'user' && (
                                        <p className="text-xs text-gray-400 mt-2 font-bold">
                                            * એડમિન ને બધી પરવાનગીઓ ઓટોમેટીક છે
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full bg-saffron hover:bg-saffron-dark text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-saffron/20 transition-all active:scale-95"
                            >
                                <Save size={22} />
                                {editingUser ? 'અપડેટ કરો' : 'યુઝર બનાવો'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
