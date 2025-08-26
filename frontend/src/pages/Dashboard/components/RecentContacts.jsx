import React from 'react';

const mockContacts = [
    { id: 1, name: 'Daniel', avatarUrl: 'https://i.pravatar.cc/150?u=daniel' },
    { id: 2, name: 'Emily', avatarUrl: 'https://i.pravatar.cc/150?u=emily' },
    { id: 3, name: 'Ryan', avatarUrl: 'https://i.pravatar.cc/150?u=ryan' },
    { id: 4, name: 'Jason', avatarUrl: 'https://i.pravatar.cc/150?u=jason' },
    { id: 5, name: 'Luke', avatarUrl: 'https://i.pravatar.cc/150?u=luke' },
];

const ContactAvatar = ({ contact }) => {
    return (
        <div className="flex flex-col items-center gap-2 cursor-pointer group">
            <div className="relative">
                <img 
                    src={contact.avatarUrl} 
                    alt={`Avatar de ${contact.name}`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-700 group-hover:border-purple-500 transition-all"
                />
                {/* Online indicator for some contacts */}
                {contact.id <= 3 && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-gray-900 rounded-full"></div>
                )}
            </div>
            <p className="text-xs text-gray-300 group-hover:text-white transition-colors">{contact.name}</p>
        </div>
    );
};

export const RecentContacts = () => {
    return (
        <div className="grid grid-cols-5 gap-4">
            {mockContacts.map(contact => (
                <ContactAvatar key={contact.id} contact={contact} />
            ))}
        </div>
    );
};