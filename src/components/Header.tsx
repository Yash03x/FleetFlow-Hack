import React from 'react';
import { Hammer } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-lg border-b-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="bg-red-600 p-3 rounded-lg">
              <Hammer className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HILTI</h1>
              <p className="text-sm text-gray-600">Construction Intelligence Platform</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Consultant Tool</p>
            <p className="text-xs text-gray-500">Fleet Contract Advisor</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;