import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, ClipboardList, LayoutList, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Demo login logic - in production, this would call an authentication API
        if (username && password.length >= 6) {
            setTimeout(() => {
                setLoading(false);
                navigate('/dashboard');
            }, 1000);
        } else {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <motion.div
                className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-8 flex-col justify-between"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col h-full justify-between">
                    <div>
                        <div className="flex items-center text-white">
                            <Book className="h-8 w-8"/>
                            <span className="ml-2 text-2xl font-bold">Heftly</span>
                        </div>

                        <motion.h1
                            className="text-4xl font-bold text-white mt-16 mb-4"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.2, duration: 0.5}}
                        >
                            Willkommen im Berichtsheft
                        </motion.h1>
                        <motion.p
                            className="text-xl text-white/90 max-w-md"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.3, duration: 0.5}}
                        >
                            Dokumentiere deinen Ausbildungsfortschritt einfach und übersichtlich.
                        </motion.p>
                    </div>

                    <motion.div
                        className="rounded-xl bg-white/10 backdrop-blur-sm p-6 mt-8"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.4, duration: 0.5}}
                    >
                        <div className="flex items-start mb-4">
                            <div className="mr-4 bg-white/20 rounded-full p-2">
                                <ClipboardList className="h-6 w-6 text-white"/>
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-lg">Wochenberichte</h3>
                                <p className="text-white/80">Erfasse deine Tätigkeiten und Lernerfolge.</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="mr-4 bg-white/20 rounded-full p-2">
                                <LayoutList className="h-6 w-6 text-white"/>
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-lg">Übersichtlich</h3>
                                <p className="text-white/80">Alle Einträge chronologisch sortiert.</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.p
                        className="text-white/70 text-sm mt-8"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.6, duration: 0.5}}
                    >
                        © 2025 Azubi Portal. Created by{' '}
                        <a
                            href="https://www.linkedin.com/in/maximilian-wolf-89532a28b/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-white transition-colors"
                        >
                            Maximilian Wolf
                        </a>
                    </motion.p>

                </div>
            </motion.div>

            <motion.div
                className="flex-1 flex items-center justify-center p-8"
                initial={{opacity: 0, x: 50}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.5}}
            >
                <div className="w-full max-w-md">
                    <div className="flex justify-center md:hidden mb-12">
                        <div className="flex items-center text-blue-600">
                            <Book className="h-8 w-8" />
                            <span className="ml-2 text-2xl font-bold">Azubi</span>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Anmelden</h2>
                        <p className="text-gray-500 mb-8">Melde dich mit deinem Benutzerkonto an</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Benutzername
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="max.mustermann"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Passwort
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Anmelden...' : 'Anmelden'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;