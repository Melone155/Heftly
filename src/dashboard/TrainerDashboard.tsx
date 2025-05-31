import React, { useState } from 'react';
import { Book, LogOut, CheckCircle, XCircle, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';

const TrainerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [selectedTrainee, setSelectedTrainee] = useState<string>('max.mustermann');
    const [selectedWeek, setSelectedWeek] = useState<string>(getCurrentWeek());

    // Mock data for demonstration
    const trainees = [
        { id: 'max.mustermann', name: 'Max Mustermann', status: 'pending' },
        { id: 'anna.schmidt', name: 'Anna Schmidt', status: 'approved' },
        { id: 'leon.mueller', name: 'Leon Müller', status: 'rejected' },
    ];

    function getCurrentWeek(): string {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
        return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
    }

    const handleLogout = () => {
        navigate('/');
    };

    const getWeeksInYear = () => {
        const weeks = [];
        const currentYear = new Date().getFullYear();
        for (let week = 1; week <= 52; week++) {
            weeks.push(`${currentYear}-W${week.toString().padStart(2, '0')}`);
        }
        return weeks;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'text-green-600';
            case 'rejected': return 'text-red-600';
            default: return 'text-yellow-600';
        }
    };

    const editorConfig = {
        height: 300,
        menubar: false,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
            'searchreplace', 'visualblocks', 'fullscreen',
            'insertdatetime', 'table', 'wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
            'bold italic underline strikethrough | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px }',
        readonly: true
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <Book className="h-8 w-8 text-blue-600 mr-3" />
                        <h1 className="text-xl font-bold text-gray-900">Ausbilder Dashboard</h1>
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
                        <h2 className="text-2xl font-bold text-gray-900">Azubi Berichte</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Verwalte und überprüfe die Wochenberichte deiner Azubis
                        </p>
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                        <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-2" />
                            <select
                                value={selectedTrainee}
                                onChange={(e) => setSelectedTrainee(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                {trainees.map((trainee) => (
                                    <option key={trainee.id} value={trainee.id}>
                                        {trainee.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                            <select
                                value={selectedWeek}
                                onChange={(e) => setSelectedWeek(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                {getWeeksInYear().map((week) => (
                                    <option key={week} value={week}>
                                        KW {week.split('-W')[1]}/{week.split('-')[0]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Azubi Übersicht</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktionen</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {trainees.map((trainee) => (
                                    <tr key={trainee.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <User className="h-6 w-6 text-gray-500" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{trainee.name}</div>
                                                    <div className="text-sm text-gray-500">{trainee.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(trainee.status)}`}>
                          {trainee.status}
                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => setSelectedTrainee(trainee.id)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                Berichte ansehen
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Betriebliche Tätigkeiten</h3>
                            <Editor
                                apiKey="your-tinymce-api-key"
                                initialValue="<p>Beispiel für betriebliche Tätigkeiten...</p>"
                                init={editorConfig}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Unterweisungen</h3>
                            <Editor
                                apiKey="your-tinymce-api-key"
                                initialValue="<p>Beispiel für Unterweisungen...</p>"
                                init={editorConfig}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Berufsschule</h3>
                            <Editor
                                apiKey="your-tinymce-api-key"
                                initialValue="<p>Beispiel für Berufsschule...</p>"
                                init={editorConfig} //<- Fehler
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        type="button"
                        className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                        <XCircle className="h-5 w-5 inline-block mr-2" />
                        Ablehnen
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                        <CheckCircle className="h-5 w-5 inline-block mr-2" />
                        Genehmigen
                    </button>
                </div>
            </main>
        </div>
    );
};

export default TrainerDashboard;