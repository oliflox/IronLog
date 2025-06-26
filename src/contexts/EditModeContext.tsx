
import React, { createContext, useContext, useState } from 'react';

type EditModeContextType = {
  editMode: boolean;
  toggleEditMode: () => void;
  setEditMode: (value: boolean) => void;
};

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export const EditModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => setEditMode(prev => !prev);

  return (
    <EditModeContext.Provider value={{ editMode, toggleEditMode, setEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (!context) throw new Error('useEditMode must be used within EditModeProvider');
  return context;
};