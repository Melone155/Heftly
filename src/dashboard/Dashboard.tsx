import React, { useState } from 'react';
import { Book, LogOut, Building2, Calendar, ClipboardList, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RichTextEditor from './RichTextEditor';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [selectedWeek, setSelectedWeek] = useState<string>(getCurrentWeek());
    const [betrieblicheTaetigkeiten, setBetrieblicheTaetigkeiten] = useState('');
    const [berufsschule, setBerufsschule] = useState('');
    const [unterweisungen, setUnterweisungen] = useState('');

    function getCurrentWeek(): string {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
        return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
    }

    const handleLogout = () => {
        navigate('/');
    };

    const getMonthsOfYear = () => {
        const currentYear = new Date().getFullYear();
        const months: string[] = [];

        for (let month = 1; month <= 12; month++) {
            months.push(`${month}/${currentYear}`);
        }

        return months;
    };

    const getWeeksInYear = () => {
        const weeks = [];
        const currentYear = new Date().getFullYear();
        for (let week = 1; week <= 52; week++) {
            weeks.push(`${currentYear}-W${week.toString().padStart(2, '0')}`);
        }
        return weeks;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <Book className="h-8 w-8 text-blue-600 mr-3" />
                        <h1 className="text-xl font-bold text-gray-900">Azubi Berichtsheft</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Abmelden
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Wochenberichte</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Verwalte deine wöchentlichen Berichte
                        </p>
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                            <select
                                value={selectedWeek}
                                onChange={(e) => setSelectedWeek(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                {getMonthsOfYear().map((month) => (
                                    <option key={month} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Wochenübersicht</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {getWeeksInYear().slice(0, 12).map((week) => (
                                <button
                                    key={week}
                                    onClick={() => setSelectedWeek(week)}
                                    className={`p-4 rounded-lg border ${
                                        selectedWeek === week
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300'
                                    }`}
                                >
                                    <div className="font-medium">KW {week.split('-W')[1]}</div>
                                    <div className="text-sm text-gray-500">{week.split('-')[0]}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <Building2 className="h-6 w-6 text-blue-600 mr-2" />
                                <h3 className="text-lg font-medium text-gray-900">Betriebliche Tätigkeiten</h3>
                            </div>
                            <div className="space-y-4">
                                <RichTextEditor
                                    value={betrieblicheTaetigkeiten}
                                    onChange={setBetrieblicheTaetigkeiten}
                                    placeholder="Beschreibe hier die betrieblichen Tätigkeiten dieser Woche..."
                                    className="min-h-[300px]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <ClipboardList className="h-6 w-6 text-blue-600 mr-2" />
                                <h3 className="text-lg font-medium text-gray-900">Unterweisungen</h3>
                            </div>
                            <div className="space-y-4">
                                <RichTextEditor
                                    value={unterweisungen}
                                    onChange={setUnterweisungen}
                                    placeholder="Beschreibe hier die Unterweisungen dieser Woche..."
                                    className="min-h-[300px]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
                                <h3 className="text-lg font-medium text-gray-900">Berufsschule</h3>
                            </div>
                            <div className="space-y-4">
                                <RichTextEditor
                                    value={berufsschule}
                                    onChange={setBerufsschule}
                                    placeholder="Beschreibe hier die Unterweisungen dieser Woche..."
                                    className="min-h-[300px]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Speichern
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Abgeben
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;