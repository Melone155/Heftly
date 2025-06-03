import React, {Fragment, useEffect, useState} from 'react';
import { Book, LogOut, UserPlus, Trash2, PencilLine, Shield, GraduationCap, UserCog, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import {Bounce, toast, ToastContainer} from 'react-toastify';

type Role = 'admin' | 'trainer' | 'trainee';

interface User {
    id: string;
    name: string;
    role: Role;
    department?: string;
    startDate?: string;
    assignedTrainer?: string;
    password?: string;
}

/*
 { id: '1', name: 'Max Mustermann', role: 'trainee', department: 'IT', startDate: '2023-09-01', assignedTrainer: '2' },
        { id: '2', name: 'Anna Schmidt', role: 'trainer', department: 'IT' },
        { id: '3', name: 'Thomas Weber', role: 'admin' },
 */

const UserManagement: React.FC = () => {
    const navigate = useNavigate();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState<Partial<User>>({
        name: '',
        role: 'trainee',
        department: '',
        startDate: '',
        password: '',
        assignedTrainer: ''
    });

    useEffect(() => {
        const ReadData  = async () => {
            try {
                const response = await fetch("http://localhost:5000/user", {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (!response.ok) {
                    console.log(response);
                    return;
                }

                const result = await response.json();
                setUsers(result);

            } catch (error) {
                console.error(error);
            }
        };

        ReadData();
    }, []);


    const handleLogout = () => {
        navigate('/');
    };

    const handleCreateUser = () => {
        if (!newUser.name || !newUser.role || !newUser.password) {
            toast.error('Bitte füllen sie alle Pflichtfelder aus.', {
                position: "top-right",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            return;
        }

        if (newUser.role === 'trainee' && !newUser.assignedTrainer) {
            toast.error('Bitte füllen sie einen Ausbilder aus.', {
                position: "top-right",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            return;
        }

        const CreateUser  = async () => {
            const id = (users.length + 1).toString();
            const userToCreate = { ...newUser, id };
            try {
                const response = await fetch("http://localhost:5000/user/create", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "userdata": JSON.stringify(userToCreate),
                    }
                });

                if (!response.ok) {
                    console.log(response);
                    return;
                }

                const result = await response.json();

                setIsCreateModalOpen(false);
                setUsers(prevUsers => [...prevUsers, result.newUser]);
                setNewUser({
                    name: '',
                    role: 'trainee',
                    department: '',
                    startDate: '',
                    password: '',
                    assignedTrainer: ''
                });
                toast.success('Benutzer erfolgreich erstellt!', {
                    position: "top-right",
                    autoClose: 7000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });


            } catch (error) {
                console.error(error);
            }
        };

        CreateUser();
    };

    const handleDeleteUser = (id: string) => {
        setUsers(users.filter(user => user.id !== id));

        const Deletuser  = async () => {
            try {
                const response = await fetch(`http://localhost:5000/user/delete/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    console.log(response);
                    return;
                }

                toast.success('Benutzer erfolgreich gelöscht!', {
                    position: "top-right",
                    autoClose: 7000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });

            } catch (error) {
                console.error(error);
            }
        };

        Deletuser();
    };

    const getTrainers = () => {
        return users.filter(user => user.role === 'trainer');
    };

    const getTrainerName = (trainerId?: string) => {
        if (!trainerId) return '-';
        const trainer = users.find(user => user.id === trainerId);
        return trainer ? trainer.name : '-';
    };

    const getRoleIcon = (role: Role) => {
        switch (role) {
            case 'admin':
                return <Shield className="h-5 w-5" />;
            case 'trainer':
                return <UserCog className="h-5 w-5" />;
            case 'trainee':
                return <GraduationCap className="h-5 w-5" />;
        }
    };

    const getRoleColor = (role: Role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800';
            case 'trainer':
                return 'bg-blue-100 text-blue-800';
            case 'trainee':
                return 'bg-green-100 text-green-800';
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenEditModal = (user: User) => {
        setNewUser(user);
        setIsEditModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <Book className="h-8 w-8 text-blue-600 mr-3" />
                        <h1 className="text-xl font-bold text-gray-900">Benutzerverwaltung</h1>
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
                        <h2 className="text-2xl font-bold text-gray-900">Benutzer</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Verwalten Sie alle Benutzer und deren Rollen
                        </p>
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Suchen..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <UserPlus className="h-5 w-5 mr-2" />
                            Benutzer erstellen
                        </button>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rolle
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Abteilung
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ausbilder
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Startdatum
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aktionen
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                          <span className="ml-1 capitalize">{user.role}</span>
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.department || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.role === 'trainee' ? getTrainerName(user.assignedTrainer) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.startDate || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                            onClick={() => handleOpenEditModal(user)}
                                        >
                                            <PencilLine className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <Transition appear show={isCreateModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsCreateModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 backdrop-blur-sm bg-white/10"/>
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        Neuen Benutzer erstellen
                                    </Dialog.Title>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={newUser.name}
                                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                Passwort *
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                value={newUser.password}
                                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                                Rolle *
                                            </label>
                                            <select
                                                id="role"
                                                value={newUser.role}
                                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            >
                                                <option value="trainee">Auszubildender</option>
                                                <option value="trainer">Ausbilder</option>
                                                <option value="admin">Administrator</option>
                                            </select>
                                        </div>
                                        {newUser.role === 'trainee' && (
                                            <div>
                                                <label htmlFor="trainer" className="block text-sm font-medium text-gray-700">
                                                    Ausbilder *
                                                </label>
                                                <select
                                                    id="trainer"
                                                    value={newUser.assignedTrainer}
                                                    onChange={(e) => setNewUser({ ...newUser, assignedTrainer: e.target.value })}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                >
                                                    <option value="">Ausbilder auswählen</option>
                                                    {getTrainers().map(trainer => (
                                                        <option key={trainer.id} value={trainer.id}>
                                                            {trainer.name} ({trainer.department || 'Keine Abteilung'})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        <div>
                                            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                                                Abteilung
                                            </label>
                                            <input
                                                type="text"
                                                id="department"
                                                value={newUser.department}
                                                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                                Startdatum
                                            </label>
                                            <input
                                                type="date"
                                                id="startDate"
                                                value={newUser.startDate}
                                                onChange={(e) => setNewUser({ ...newUser, startDate: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                            onClick={() => setIsCreateModalOpen(false)}
                                        >
                                            Abbrechen
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                            onClick={handleCreateUser}
                                        >
                                            Erstellen
                                        </button>
                                    </div>
                                </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Transition appear show={isEditModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsEditModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 backdrop-blur-sm bg-white/10"/>
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                   Benutzer bearbeiten
                                </Dialog.Title>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={newUser.name}
                                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Passwort
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                            Rolle *
                                        </label>
                                        <select
                                            id="role"
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        >
                                            <option value="trainee">Auszubildender</option>
                                            <option value="trainer">Ausbilder</option>
                                            <option value="admin">Administrator</option>
                                        </select>
                                    </div>
                                    {newUser.role === 'trainee' && (
                                        <div>
                                            <label htmlFor="trainer" className="block text-sm font-medium text-gray-700">
                                                Ausbilder *
                                            </label>
                                            <select
                                                id="trainer"
                                                value={newUser.assignedTrainer}
                                                onChange={(e) => setNewUser({ ...newUser, assignedTrainer: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            >
                                                <option value="">Ausbilder auswählen</option>
                                                {getTrainers().map(trainer => (
                                                    <option key={trainer.id} value={trainer.id}>
                                                        {trainer.name} ({trainer.department || 'Keine Abteilung'})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    <div>
                                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                                            Abteilung
                                        </label>
                                        <input
                                            type="text"
                                            id="department"
                                            value={newUser.department}
                                            onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                            Startdatum
                                        </label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            value={newUser.startDate}
                                            onChange={(e) => setNewUser({ ...newUser, startDate: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        onClick={() => setIsEditModalOpen(false)}
                                    >
                                        Abbrechen
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        onClick={handleCreateUser}
                                    >
                                        Ändern
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <ToastContainer />
        </div>
    );
};

export default UserManagement;