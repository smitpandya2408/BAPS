import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('સફળ લોગિન!');
            navigate('/');
        } catch (error) {
            toast.error('ખોટો ઈમેલ અથવા પાસવર્ડ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-saffron to-saffron-dark flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] w-full max-w-md transform transition-all">
                <div className="text-center mb-10">
                    <div className="bg-primary-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-primary-100">
                        <LogIn className="text-saffron-dark" size={48} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">લોગિન</h1>
                    <p className="text-gray-500 mt-3 font-medium">BAPS સંસ્કારધામ મેનેજમેન્ટ</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <label className="text-sm font-semibold text-gray-700 block mb-2">ઈ-મેઈલ</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                required
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="text-sm font-semibold text-gray-700 block mb-2">પાસવર્ડ</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                required
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-saffron hover:bg-saffron-dark text-white font-bold py-4 px-4 rounded-2xl shadow-xl shadow-saffron/20 transform transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <LogIn size={20} />
                                <span>લોગિન કરો</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
