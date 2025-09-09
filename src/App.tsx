import React, { useState } from 'react';
import { Building2, Users, Clock, Wrench, Upload, FileText, CheckCircle } from 'lucide-react';
import Header from './components/Header';
import ProjectForm from './components/ProjectForm';
import RecommendationReport from './components/RecommendationReport';
import { ProjectData } from './types/ProjectData';

function App() {
  const [currentStep, setCurrentStep] = useState<'form' | 'report'>('form');
  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  const handleFormSubmit = (data: ProjectData) => {
    setProjectData(data);
    setCurrentStep('report');
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {currentStep === 'form' ? (
        <>
          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-5xl font-bold mb-6 leading-tight">
                  AI-Powered Construction Site Analysis
                </h1>
                <p className="text-xl mb-8 max-w-3xl mx-auto opacity-95">
                  Get intelligent Hilti tool recommendations and fleet contract proposals 
                  tailored to your specific construction project needs
                </p>
                <div className="flex items-center justify-center space-x-8 text-red-100">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-6 w-6" />
                    <span>Project Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wrench className="h-6 w-6" />
                    <span>Tool Recommendations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-6 w-6" />
                    <span>Fleet Proposals</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ProjectForm onSubmit={handleFormSubmit} />
        </>
      ) : (
        <RecommendationReport 
          projectData={projectData!} 
          onBack={handleBackToForm} 
        />
      )}
    </div>
  );
}

export default App;