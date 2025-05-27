import React, { createContext, useContext, useState, ReactNode } from 'react';

type UsecaseContextType = {
    usecases: Usecases[];
    setUsecases: (usecases: Usecases[]) => void;
}

const UsecaseContext = createContext<UsecaseContextType | undefined>(undefined);

interface UsecaseProviderProps {
    children: ReactNode;
}

export const UsecaseProvider: React.FC<UsecaseProviderProps> = ({ children }) => {
    const [usecases, setUsecases] = useState<Usecases[]>([]);

    return (
        <UsecaseContext.Provider value={{ usecases, setUsecases }}>
            {children}
        </UsecaseContext.Provider>
    );
};

export const useUsecaseContext = (): UsecaseContextType => {
    const context = useContext(UsecaseContext);
    if (!context) {
        throw new Error('useUsecaseContext must be used within a UsecaseProvider');
    }
    return context;
};