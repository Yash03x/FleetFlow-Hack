import React from 'react';
import { ArrowLeft, Download, CheckCircle, TrendingUp, Shield, Clock, DollarSign, Users, Wrench, ExternalLink, Info } from 'lucide-react';
import { ProjectData, ToolRecommendation, FleetContract } from '../types/ProjectData';
import { generateRecommendations, generateFleetContract } from '../utils/recommendationEngine';

interface RecommendationReportProps {
  projectData: ProjectData;
  onBack: () => void;
}

const RecommendationReport: React.FC<RecommendationReportProps> = ({ projectData, onBack }) => {
  const recommendations = generateRecommendations(projectData);
  const fleetContract = generateFleetContract(projectData, recommendations);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Form</span>
        </button>
        <button className="flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
          <Download className="h-5 w-5" />
          <span>Export Report</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Report Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-8 text-white">
          <h1 className="text-4xl font-bold mb-4">Construction Site Analysis Report</h1>
          <div className="grid md:grid-cols-4 gap-6 text-red-100">
            <div>
              <div className="text-2xl font-bold text-white">{projectData.projectName}</div>
              <div className="text-sm">{projectData.projectType}</div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <div>
                <div className="font-semibold text-white">{projectData.laborCount}</div>
                <div className="text-sm">Laborers</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <div>
                <div className="font-semibold text-white">{projectData.timeline}</div>
                <div className="text-sm">Months</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <div>
                <div className="font-semibold text-white capitalize">{projectData.projectComplexity}</div>
                <div className="text-sm">Complexity</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Executive Summary */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="h-6 w-6 text-red-600 mr-2" />
              Executive Summary
            </h2>
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <p className="text-gray-700 leading-relaxed text-lg">
                Based on our AI analysis of your <strong>{projectData.projectType}</strong> project in <strong>{projectData.location}</strong>, 
                we recommend a comprehensive Hilti fleet solution that will optimize productivity, ensure safety, and deliver cost savings. 
                Our recommendation includes <strong>{recommendations.length} specialized tools</strong> for your {projectData.laborCount}-person team 
                over the {projectData.timeline}-month timeline, resulting in an estimated <strong>25% increase in productivity</strong> and 
                <strong>30% reduction in equipment-related downtime</strong>.
              </p>
            </div>
          </section>

          {/* Tool Recommendations */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Wrench className="h-6 w-6 text-red-600 mr-2" />
              Recommended Hilti Tools & Equipment
            </h2>
            <div className="grid gap-6">
              {recommendations.map((tool, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{tool.name}</h3>
                        <a 
                          href={tool.productUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          <span>View Product</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="text-sm text-gray-500 mb-2 font-mono">Model: {tool.model}</div>
                      <p className="text-gray-600 mb-3">{tool.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Quantity: <strong className="text-gray-900">{tool.quantity}</strong></span>
                        <span>Duration: <strong className="text-gray-900">{tool.rentalDuration} months</strong></span>
                        <span>Monthly Cost: <strong className="text-red-600">{formatCurrency(tool.monthlyCost)}</strong></span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(tool.totalCost)}
                      </div>
                      <div className="text-sm text-gray-500">Total Cost</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Info className="h-4 w-4 text-blue-600 mr-2" />
                      Key Specifications
                    </h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {tool.specifications.map((spec, idx) => (
                        <div key={idx} className="text-sm text-gray-700 flex items-center">
                          <div className="w-2 h-2 bg-red-600 rounded-full mr-2 flex-shrink-0"></div>
                          {spec}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Why This Tool?</h4>
                    <ul className="space-y-1">
                      {tool.justification.map((reason, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Competitive Advantages</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-700">Industry-leading safety</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">40% higher productivity</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-gray-700">Minimal downtime</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Fleet Contract Proposal */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <DollarSign className="h-6 w-6 text-red-600 mr-2" />
              Hilti Fleet Contract Proposal
            </h2>
            
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-white mb-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{formatCurrency(fleetContract.totalCost)}</div>
                  <div className="text-red-100">Total Contract Value</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{formatCurrency(fleetContract.monthlyCost)}</div>
                  <div className="text-red-100">Monthly Payment</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{formatCurrency(fleetContract.estimatedSavings)}</div>
                  <div className="text-red-100">Estimated Savings vs. Purchase</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  Contract Benefits
                </h3>
                <ul className="space-y-3">
                  {fleetContract.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contract Terms</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span>Contract Duration:</span>
                    <span className="font-semibold">{fleetContract.duration} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Terms:</span>
                    <span className="font-semibold">Monthly</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maintenance:</span>
                    <span className="font-semibold text-green-600">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>24/7 Support:</span>
                    <span className="font-semibold text-green-600">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tool Replacement:</span>
                    <span className="font-semibold text-green-600">Covered</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ROI Analysis */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 text-red-600 mr-2" />
              Return on Investment Analysis
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Impact</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Equipment Cost Savings:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(fleetContract.estimatedSavings)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Productivity Increase (25%):</span>
                      <span className="font-semibold text-green-600">{formatCurrency(Math.round(projectData.budget * 0.15))}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Reduced Downtime Savings:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(Math.round(projectData.budget * 0.08))}</span>
                    </div>
                    <div className="flex justify-between py-3 border-t-2 border-gray-300 font-bold text-lg">
                      <span>Total ROI:</span>
                      <span className="text-green-600">{formatCurrency(fleetContract.estimatedSavings + Math.round(projectData.budget * 0.23))}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Operational Benefits</h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4">
                      <div className="font-semibold text-red-600">25% Faster Project Completion</div>
                      <p className="text-sm text-gray-600 mt-1">Advanced tools and technology reduce task time</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="font-semibold text-blue-600">50% Reduction in Equipment Issues</div>
                      <p className="text-sm text-gray-600 mt-1">Professional maintenance and quality assurance</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="font-semibold text-green-600">Enhanced Safety Compliance</div>
                      <p className="text-sm text-gray-600 mt-1">Latest safety features and certifications</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Next Steps */}
          <section className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Next Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Technical Consultation</h3>
                <p className="text-red-100 text-sm">Schedule a detailed site assessment with our technical experts</p>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Contract Finalization</h3>
                <p className="text-red-100 text-sm">Review terms and finalize your customized Hilti Fleet agreement</p>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Delivery & Training</h3>
                <p className="text-red-100 text-sm">Equipment delivery with comprehensive operator training included</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RecommendationReport;