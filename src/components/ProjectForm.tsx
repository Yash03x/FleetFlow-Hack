import React, { useState } from 'react';
import { Upload, Users, Clock, Wrench, MapPin, DollarSign } from 'lucide-react';
import { ProjectData } from '../types/ProjectData';

interface ProjectFormProps {
  onSubmit: (data: ProjectData) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ProjectData>({
    projectName: '',
    projectType: '',
    location: '',
    laborCount: 0,
    timeline: 0,
    budget: 0,
    existingTools: [],
    blueprint: null,
    specialRequirements: '',
    projectComplexity: 'medium'
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);
    setFormData(prev => ({ ...prev, blueprint: file }));
  };

  const handleExistingToolsChange = (tool: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      existingTools: checked 
        ? [...prev.existingTools, tool]
        : prev.existingTools.filter(t => t !== tool)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const commonTools = [
    'Hammer Drills', 'Rotary Hammers', 'Angle Grinders', 'Circular Saws',
    'Demolition Hammers', 'Measuring Tools', 'Fastening Systems', 'Safety Equipment',
    'Concrete Mixers', 'Laser Levels', 'Cut-off Saws', 'Dust Management'
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
          <h2 className="text-3xl font-bold text-white">Project Assessment</h2>
          <p className="text-red-100 mt-2">Provide project details for intelligent tool recommendations</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Project Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Project Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Enter project name"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Type
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                value={formData.projectType}
                onChange={(e) => handleInputChange('projectType', e.target.value)}
              >
                <option value="">Select project type</option>
                <option value="residential">Residential Construction</option>
                <option value="commercial">Commercial Building</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="industrial">Industrial Facility</option>
                <option value="renovation">Renovation/Retrofit</option>
                <option value="roadwork">Road Construction</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Location
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              placeholder="City, State/Country"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
          </div>

          {/* Resource Information */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Number of Laborers
              </label>
              <input
                type="number"
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="e.g., 25"
                value={formData.laborCount}
                onChange={(e) => handleInputChange('laborCount', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Timeline (months)
              </label>
              <input
                type="number"
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="e.g., 12"
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Budget Range ($)
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', parseInt(e.target.value))}
              >
                <option value={0}>Select budget range</option>
                <option value={100000}>$50K - $100K</option>
                <option value={250000}>$100K - $250K</option>
                <option value={500000}>$250K - $500K</option>
                <option value={1000000}>$500K - $1M</option>
                <option value={2000000}>$1M - $2M</option>
                <option value={5000000}>$2M+</option>
              </select>
            </div>
          </div>

          {/* Project Complexity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Complexity
            </label>
            <div className="flex space-x-4">
              {[
                { value: 'low', label: 'Low', desc: 'Standard construction, basic requirements' },
                { value: 'medium', label: 'Medium', desc: 'Moderate complexity, some specialized work' },
                { value: 'high', label: 'High', desc: 'Complex project, specialized equipment needed' }
              ].map((option) => (
                <label key={option.value} className="flex-1">
                  <input
                    type="radio"
                    name="complexity"
                    value={option.value}
                    checked={formData.projectComplexity === option.value}
                    onChange={(e) => handleInputChange('projectComplexity', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.projectComplexity === option.value
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Existing Tools */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              <Wrench className="inline h-4 w-4 mr-1" />
              Existing Tools & Equipment
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {commonTools.map((tool) => (
                <label key={tool} className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={formData.existingTools.includes(tool)}
                    onChange={(e) => handleExistingToolsChange(tool, e.target.checked)}
                    className="text-red-600 focus:ring-red-500 rounded"
                  />
                  <span className="text-sm text-gray-700">{tool}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Blueprint Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Upload className="inline h-4 w-4 mr-1" />
              Project Blueprint (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="mb-4">
                <label htmlFor="blueprint-upload" className="cursor-pointer">
                  <span className="text-red-600 font-medium hover:text-red-700">Upload blueprint</span>
                  <span className="text-gray-600"> or drag and drop</span>
                </label>
                <input
                  id="blueprint-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.dwg"
                  onChange={handleFileUpload}
                />
              </div>
              <p className="text-sm text-gray-500">PDF, JPG, PNG, or DWG up to 10MB</p>
              {uploadedFile && (
                <p className="mt-2 text-sm text-green-600">✓ {uploadedFile.name} uploaded</p>
              )}
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Special Requirements or Notes
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              placeholder="Any specific requirements, environmental conditions, or special considerations..."
              value={formData.specialRequirements}
              onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-8 rounded-lg text-lg font-semibold hover:from-red-700 hover:to-red-800 transform hover:scale-[1.02] transition-all shadow-lg"
            >
              Generate AI Recommendations & Fleet Proposal
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ProjectForm;