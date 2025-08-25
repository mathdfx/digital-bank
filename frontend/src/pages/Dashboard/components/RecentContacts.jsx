import React from 'react';
import { Plus } from 'lucide-react';

const mockContacts = [
    { id: 1, name: 'Daniel', avatarUrl: 'https://i.pravatar.cc/150?u=daniel' },
    { id: 2, name: 'Emily', avatarUrl: 'https://i.pravatar.cc/150?u=emily' },
    { id: 3, name: 'Ryan', avatarUrl: 'https://i.pravatar.cc/150?u=ryan' },
    { id: 4, name: 'Jason', avatarUrl: 'https://i.pravatar.cc/150?u=jason' },
    { id: 5, name: 'Luke', avatarUrl: 'https://i.pravatar.cc/150?u=luke' },
];

const ContactAvatar = ({ contact }) => {
    return (
        <div className="flex flex-col items-center gap-2 cursor-pointer">
            <img 
                src={contact.avatarUrl} 
                alt={`Avatar de ${contact.name}`}
                className="w-14 h-14 rounded-full object-cover border-2 border-transparent hover:border-purple-400 transition-all"
            />
            <p className="text-sm text-gray-300">{contact.name}</p>
        </div>
    );
};

export const RecentContacts = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Recent Contacts</h2>
                <button className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition-colors">
                    <Plus size={20} />
                </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
                {mockContacts.map(contact => (
                    <ContactAvatar key={contact.id} contact={contact} />
                ))}
            </div>
        </div>
    );
};