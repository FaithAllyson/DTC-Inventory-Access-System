import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, Package, User, Building, Phone, Mail, CheckCircle, AlertCircle, X, ArrowLeft, ArrowRight, Search, Filter,
  Plus, Users, Scan, Edit3, Trash2, LogIn, LogOut, Shield, Eye, Settings, BarChart3, Download, MapPin
} from 'lucide-react';

// --- InventoryAppointmentSystem (User-facing) ---
const InventoryAppointmentSystem = ({ onLogout, currentUser, userRole }) => {
  const [appointments, setAppointments] = useState([
    { id: 1, requesterName: 'John Doe', email: 'john.doe@company.com', phone: '+63 912 345 6789', department: 'IT Department', date: '2024-07-08', time: '09:00', purpose: 'Equipment Retrieval', items: ['MacBook Pro 13"', 'Wireless Mouse'], status: 'confirmed', createdAt: '2024-07-02T10:30:00' },
    { id: 2, requesterName: 'Jane Smith', email: 'jane.smith@company.com', phone: '+63 917 654 3210', department: 'Marketing', date: '2024-07-09', time: '14:00', purpose: 'Equipment Return', items: ['Camera Canon EOS', 'Tripod Stand'], status: 'pending', createdAt: '2024-07-02T14:15:00' }
  ]);
  const [currentStep, setCurrentStep] = useState(0); // Start at 0 for dashboard
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, confirmed-items, pending-items, available-items
  const [formData, setFormData] = useState({
    requesterName: '', email: '', phone: '', department: '', purpose: 'retrieval', items: [], date: '', time: '', notes: ''
  });
  const [availableItems] = useState([
    { id: 1, name: 'MacBook Pro 13"', category: 'Electronics', status: 'available' }, { id: 2, name: 'MacBook Pro 15"', category: 'Electronics', status: 'available' }, { id: 3, name: 'iPad Pro', category: 'Electronics', status: 'available' }, { id: 4, name: 'Wireless Mouse', category: 'Electronics', status: 'available' }, { id: 5, name: 'Mechanical Keyboard', category: 'Electronics', status: 'available' }, { id: 6, name: 'Monitor 27"', category: 'Electronics', status: 'available' }, { id: 7, name: 'Projector', category: 'Equipment', status: 'available' }, { id: 8, name: 'Camera Canon EOS', category: 'Equipment', status: 'available' }, { id: 9, name: 'Tripod Stand', category: 'Equipment', status: 'available' }, { id: 10, name: 'Office Chair', category: 'Furniture', status: 'available' }
  ]);
  
  // Admin items data for user to view
  const [adminItems] = useState([
    { id: 1, description: 'MacBook Pro 13"', serialNo: 'MBP001', qrCode: 'QR001', status: 'available', category: 'Electronics', location: 'Storage A1' },
    { id: 2, description: 'Wireless Mouse', serialNo: 'WM002', qrCode: 'QR002', status: 'borrowed', category: 'Electronics', location: 'Storage A2' },
    { id: 3, description: 'Projector', serialNo: 'PJ003', qrCode: 'QR003', status: 'available', category: 'Equipment', location: 'Storage B1' },
    { id: 4, description: 'Camera Canon EOS', serialNo: 'CAM004', qrCode: 'QR004', status: 'available', category: 'Electronics', location: 'Storage A3' },
    { id: 5, description: 'Conference Table', serialNo: 'CT005', qrCode: 'QR005', status: 'available', category: 'Furniture', location: 'Storage C1' },
    { id: 6, description: 'Printer HP LaserJet', serialNo: 'HP006', qrCode: 'QR006', status: 'maintenance', category: 'Electronics', location: 'Storage A4' },
  ]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customItemRequest, setCustomItemRequest] = useState('');
  const [showCustomItemForm, setShowCustomItemForm] = useState(false);
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ];
  const purposes = [
    { value: 'retrieval', label: 'Equipment Retrieval', description: 'Borrow items for temporary use' },
    { value: 'return', label: 'Equipment Return', description: 'Return previously borrowed items' },
    { value: 'inspection', label: 'Equipment Inspection', description: 'Inspect items before borrowing' },
    { value: 'maintenance', label: 'Maintenance Check', description: 'Report or check item condition' }
  ];
  const departments = [
    'IT Department', 'Marketing', 'Human Resources', 'Finance', 'Operations',
    'Research & Development', 'Quality Assurance', 'Customer Service', 'Administration'
  ];
  const categories = ['all', 'Electronics', 'Equipment', 'Furniture'];

  const filteredItems = availableItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleItemSelection = (item) => {
    setSelectedItems(prev => {
      const isSelected = prev.find(i => i.id === item.id);
      if (isSelected) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleSubmit = () => {
    const newAppointment = {
      id: appointments.length + 1,
      ...formData,
      items: selectedItems.map(item => item.name),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setAppointments([...appointments, newAppointment]);
    setFormData({
      requesterName: '', email: '', phone: '', department: '', purpose: 'retrieval', items: [], date: '', time: '', notes: ''
    });
    setSelectedItems([]);
    setCurrentStep(5); // Success step
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.requesterName && formData.email && formData.phone && formData.department;
      case 2:
        return formData.purpose;
      case 3:
        return formData.purpose === 'return' || selectedItems.length > 0;
      case 4:
        return formData.date && formData.time;
      default:
        return true;
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6 sm:mb-8 px-2">
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${
            currentStep >= step
              ? 'text-white'
              : 'border-gray-300 text-gray-400'
          }`} style={{
            backgroundColor: currentStep >= step ? '#C1121F' : 'transparent',
            borderColor: currentStep >= step ? '#C1121F' : '#d1d5db'
          }}>
            {currentStep > step ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : step}
          </div>
          {step < 4 && (
            <div className={`w-8 sm:w-12 h-0.5 ${
              currentStep > step ? '' : 'bg-gray-300'
            }`} style={{
              backgroundColor: currentStep > step ? '#C1121F' : '#d1d5db'
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  if (currentStep === 0 && currentView === 'dashboard') {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <div className="bg-white shadow-sm" style={{ backgroundColor: '#162C49' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#162C49' }} />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg sm:text-xl font-bold text-white">Inventory Access System</h1>
                  <p className="text-xs sm:text-sm text-gray-300">Digital Transformation Center</p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-sm font-bold text-white">IAS</h1>
                  <p className="text-xs text-gray-300">DTC</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                {currentUser && (
                  <div className="hidden sm:flex items-center space-x-2">
                    <User className="w-5 h-5 text-white" />
                    <span className="text-sm font-medium text-white">{currentUser.name} ({userRole})</span>
                  </div>
                )}
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-white text-gray-900 px-3 sm:px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Book Appointment</span>
                  <span className="sm:hidden">Book</span>
                </button>
                <button
                  onClick={onLogout}
                  className="bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#162C49' }}>
              Schedule Your Inventory Access
            </h2>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto px-4" style={{ color: '#6c757d' }}>
              Book appointments to retrieve, return, or inspect equipment.
              Streamline your inventory management with our easy scheduling system.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <button 
              onClick={() => setCurrentView('confirmed-items')}
              className="bg-white rounded-xl p-4 sm:p-6 text-center transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-200 cursor-pointer" 
              style={{ 
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => {
                e.target.style.boxShadow = '0 8px 25px rgba(193, 18, 31, 0.2)';
                e.target.style.transform = 'translateY(-4px) scale(1.02)';
              }}
              onMouseOut={(e) => {
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                e.target.style.transform = 'translateY(0) scale(1)';
              }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4" style={{ 
                backgroundColor: '#C1121F',
                boxShadow: '0 4px 15px rgba(193, 18, 31, 0.3)'
              }}>
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#162C49' }}>
                {appointments.filter(a => a.status === 'confirmed').length}
              </h3>
              <p className="text-xs sm:text-sm" style={{ color: '#6c757d' }}>Confirmed Today</p>
            </button>
            <button 
              onClick={() => setCurrentView('pending-items')}
              className="bg-white rounded-xl p-4 sm:p-6 text-center transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200 cursor-pointer" 
              style={{ 
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => {
                e.target.style.boxShadow = '0 8px 25px rgba(22, 44, 73, 0.2)';
                e.target.style.transform = 'translateY(-4px) scale(1.02)';
              }}
              onMouseOut={(e) => {
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                e.target.style.transform = 'translateY(0) scale(1)';
              }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4" style={{ 
                backgroundColor: '#162C49',
                boxShadow: '0 4px 15px rgba(22, 44, 73, 0.3)'
              }}>
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#162C49' }}>
                {appointments.filter(a => a.status === 'pending').length}
              </h3>
              <p className="text-xs sm:text-sm" style={{ color: '#6c757d' }}>Pending Approval</p>
            </button>
            <button 
              onClick={() => setCurrentView('available-items')}
              className="bg-white rounded-xl p-4 sm:p-6 text-center transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-200 cursor-pointer" 
              style={{ 
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => {
                e.target.style.boxShadow = '0 8px 25px rgba(193, 18, 31, 0.2)';
                e.target.style.transform = 'translateY(-4px) scale(1.02)';
              }}
              onMouseOut={(e) => {
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                e.target.style.transform = 'translateY(0) scale(1)';
              }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4" style={{ 
                backgroundColor: '#C1121F',
                boxShadow: '0 4px 15px rgba(193, 18, 31, 0.3)'
              }}>
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#162C49' }}>
                {availableItems.filter(i => i.status === 'available').length}
              </h3>
              <p className="text-xs sm:text-sm" style={{ color: '#6c757d' }}>Items Available</p>
            </button>
            <button 
              onClick={() => setCurrentStep(1)}
              className="bg-white rounded-xl p-4 sm:p-6 text-center transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200 cursor-pointer" 
              style={{ 
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => {
                e.target.style.boxShadow = '0 8px 25px rgba(22, 44, 73, 0.2)';
                e.target.style.transform = 'translateY(-4px) scale(1.02)';
              }}
              onMouseOut={(e) => {
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                e.target.style.transform = 'translateY(0) scale(1)';
              }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4" style={{ 
                backgroundColor: '#162C49',
                boxShadow: '0 4px 15px rgba(22, 44, 73, 0.3)'
              }}>
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#162C49' }}>24/7</h3>
              <p className="text-xs sm:text-sm" style={{ color: '#6c757d' }}>Online Booking</p>
            </button>
          </div>
          <div className="rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300" style={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 4px 15px rgba(22, 44, 73, 0.1)',
            border: '1px solid rgba(22, 44, 73, 0.1)'
          }}>
            <div className="px-4 sm:px-6 py-4 border-b" style={{ borderColor: 'rgba(22, 44, 73, 0.1)' }}>
              <h3 className="text-base sm:text-lg font-semibold" style={{ color: '#162C49' }}>Recent Appointments</h3>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(22, 44, 73, 0.1)' }}>
              {appointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 transition-colors duration-200 space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                      appointment.status === 'confirmed' ? 'bg-green-500' :
                        appointment.status === 'pending' ? 'bg-yellow-500' : 'bg-yellow-500'
                    }`} style={{
                      boxShadow: appointment.status === 'confirmed' ? '0 0 10px rgba(34, 197, 94, 0.3)' : '0 0 10px rgba(234, 179, 8, 0.3)'
                    }} />
                    <div>
                      <p className="font-medium text-sm sm:text-base" style={{ color: '#162C49' }}>{appointment.requesterName}</p>
                      <p className="text-xs sm:text-sm" style={{ color: '#6c757d' }}>{appointment.department}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs sm:text-sm font-medium" style={{ color: '#162C49' }}>
                      {appointment.date} at {appointment.time}
                    </p>
                    <p className="text-xs sm:text-sm" style={{ color: '#6c757d' }}>{appointment.purpose}</p>
                  </div>
                  <div className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs font-medium text-white transition-all duration-200 self-start sm:self-auto`} style={{
                    backgroundColor: appointment.status === 'confirmed' ? '#C1121F' : '#162C49',
                    boxShadow: appointment.status === 'confirmed' ? '0 2px 8px rgba(193, 18, 31, 0.3)' : '0 2px 8px rgba(22, 44, 73, 0.3)'
                  }}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Confirmed Items View
  if (currentView === 'confirmed-items') {
    const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <div className="bg-white shadow-sm" style={{ backgroundColor: '#162C49' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6" style={{ color: '#162C49' }} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Inventory Access System</h1>
                  <p className="text-sm text-gray-300">Digital Transformation Center</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="bg-white text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={onLogout}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#162C49' }}>
              Confirmed Appointments - Borrowed Items
            </h2>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto px-4" style={{ color: '#6c757d' }}>
              View items that have been borrowed through confirmed appointments.
            </p>
          </div>
          {confirmedAppointments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {confirmedAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-lg transition-all duration-300" style={{ 
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(22, 44, 73, 0.1)'
                }}>
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4" style={{ backgroundColor: '#C1121F' }}>
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base" style={{ color: '#162C49' }}>{appointment.requesterName}</h3>
                      <p className="text-xs sm:text-sm" style={{ color: '#6c757d' }}>{appointment.department}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm"><span className="font-medium" style={{ color: '#162C49' }}>Date:</span> {appointment.date}</p>
                    <p className="text-xs sm:text-sm"><span className="font-medium" style={{ color: '#162C49' }}>Time:</span> {appointment.time}</p>
                    <p className="text-xs sm:text-sm"><span className="font-medium" style={{ color: '#162C49' }}>Purpose:</span> {appointment.purpose}</p>
                    {appointment.items.length > 0 && (
                      <div>
                        <p className="text-xs sm:text-sm font-medium mb-2" style={{ color: '#162C49' }}>Borrowed Items:</p>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {appointment.items.map((item, index) => (
                            <span key={index} className="px-2 py-1 text-xs rounded-full text-white" style={{ backgroundColor: '#C1121F' }}>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4" style={{ color: '#6c757d' }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#162C49' }}>No Confirmed Appointments</h3>
              <p style={{ color: '#6c757d' }}>You don't have any confirmed appointments yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Pending Items View
  if (currentView === 'pending-items') {
    const pendingAppointments = appointments.filter(a => a.status === 'pending');
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <div className="bg-white shadow-sm" style={{ backgroundColor: '#162C49' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6" style={{ color: '#162C49' }} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Inventory Access System</h1>
                  <p className="text-sm text-gray-300">Digital Transformation Center</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="bg-white text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={onLogout}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#162C49' }}>
              Pending Appointments - Items Not Yet Returned
            </h2>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto px-4" style={{ color: '#6c757d' }}>
              View items that are borrowed and not yet returned based on pending appointments.
            </p>
          </div>
          {pendingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {pendingAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-lg transition-all duration-300" style={{ 
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(22, 44, 73, 0.1)'
                }}>
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4" style={{ backgroundColor: '#162C49' }}>
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base" style={{ color: '#162C49' }}>{appointment.requesterName}</h3>
                      <p className="text-xs sm:text-sm" style={{ color: '#6c757d' }}>{appointment.department}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium" style={{ color: '#162C49' }}>Date:</span> {appointment.date}</p>
                    <p className="text-sm"><span className="font-medium" style={{ color: '#162C49' }}>Time:</span> {appointment.time}</p>
                    <p className="text-sm"><span className="font-medium" style={{ color: '#162C49' }}>Purpose:</span> {appointment.purpose}</p>
                    {appointment.items.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2" style={{ color: '#162C49' }}>Items to Borrow:</p>
                        <div className="flex flex-wrap gap-2">
                          {appointment.items.map((item, index) => (
                            <span key={index} className="px-2 py-1 text-xs rounded-full text-white" style={{ backgroundColor: '#162C49' }}>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 mx-auto mb-4" style={{ color: '#6c757d' }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#162C49' }}>No Pending Appointments</h3>
              <p style={{ color: '#6c757d' }}>You don't have any pending appointments.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Available Items View
  if (currentView === 'available-items') {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <div className="bg-white shadow-sm" style={{ backgroundColor: '#162C49' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6" style={{ color: '#162C49' }} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Inventory Access System</h1>
                  <p className="text-sm text-gray-300">Digital Transformation Center</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="bg-white text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={onLogout}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#162C49' }}>
              Available Equipment & Items
            </h2>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto px-4" style={{ color: '#6c757d' }}>
              Browse all available equipment. Only available items are clickable for booking.
            </p>
          </div>
          
          {/* Custom Item Request Section */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6" style={{ 
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(22, 44, 73, 0.1)'
            }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#162C49' }}>Request Custom Item</h3>
              {!showCustomItemForm ? (
                <button
                  onClick={() => setShowCustomItemForm(true)}
                  className="px-6 py-3 rounded-lg text-white transition-all duration-200"
                  style={{ backgroundColor: '#C1121F' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#a50f1a'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#C1121F'}
                >
                  Request Item Not in List
                </button>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={customItemRequest}
                    onChange={(e) => setCustomItemRequest(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg transition-all duration-200"
                    style={{ 
                      borderColor: '#d1d5db',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#C1121F';
                      e.target.style.boxShadow = '0 0 0 3px rgba(193, 18, 31, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }}
                    rows="3"
                    placeholder="Describe the item you want to borrow..."
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        if (customItemRequest.trim()) {
                          alert('Custom item request submitted! We will review your request.');
                          setCustomItemRequest('');
                          setShowCustomItemForm(false);
                        }
                      }}
                      className="px-6 py-2 rounded-lg text-white transition-all duration-200"
                      style={{ backgroundColor: '#C1121F' }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#a50f1a'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#C1121F'}
                    >
                      Submit Request
                    </button>
                    <button
                      onClick={() => {
                        setCustomItemRequest('');
                        setShowCustomItemForm(false);
                      }}
                      className="px-6 py-2 rounded-lg transition-all duration-200"
                      style={{ backgroundColor: '#6c757d', color: 'white' }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Available Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {adminItems.map((item) => (
              <div key={item.id} className={`rounded-xl shadow-sm p-4 sm:p-6 transition-all duration-300 ${
                item.status === 'available' ? 'bg-white hover:shadow-lg cursor-pointer' : 'bg-gray-100'
              }`} style={{ 
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(22, 44, 73, 0.1)'
              }}
              onClick={() => {
                if (item.status === 'available') {
                  setCurrentStep(1);
                  setFormData({ ...formData, items: [item.description] });
                }
              }}
              >
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4 ${
                    item.status === 'available' ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm sm:text-base" style={{ color: '#162C49' }}>{item.description}</h3>
                    <p className="text-xs sm:text-sm" style={{ color: '#6c757d' }}>{item.category}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm"><span className="font-medium" style={{ color: '#162C49' }}>Serial:</span> {item.serialNo}</p>
                  <p className="text-xs sm:text-sm"><span className="font-medium" style={{ color: '#162C49' }}>Location:</span> {item.location}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full ${
                      item.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : item.status === 'borrowed'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status === 'available' ? 'Available' : 
                       item.status === 'borrowed' ? 'On Pending' : 'Maintenance'}
                    </span>
                    {item.status === 'available' && (
                      <span className="text-xs" style={{ color: '#C1121F' }}>Click to Book</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 5) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <div className="max-w-md w-full mx-4">
          <div className="rounded-2xl p-6 sm:p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105" style={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 10px 30px rgba(22, 44, 73, 0.15)',
            border: '1px solid rgba(22, 44, 73, 0.1)'
          }}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6" style={{ 
              background: 'linear-gradient(135deg, #C1121F 0%, #a50f1a 100%)',
              boxShadow: '0 8px 25px rgba(193, 18, 31, 0.3)'
            }}>
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: '#162C49' }}>
              Appointment Booked Successfully!
            </h2>
            <p className="mb-6 sm:mb-8 text-sm sm:text-base" style={{ color: '#6c757d' }}>
              Your appointment request has been submitted. You will receive a confirmation email shortly.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setCurrentStep(0)}
                className="w-full text-white py-3 px-4 rounded-lg transition-colors font-medium"
                style={{ backgroundColor: '#C1121F' }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#a50f1a'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#C1121F'}
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => setCurrentStep(1)}
                className="w-full py-3 px-4 rounded-lg transition-colors font-medium"
                style={{ backgroundColor: '#162C49', color: 'white' }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#0f1f2e'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#162C49'}
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm" style={{ backgroundColor: '#162C49' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setCurrentStep(0)}
                className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white">Book Appointment</h1>
                <p className="text-sm text-gray-300">Step {currentStep} of 4</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentStep(0)}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {renderStepIndicator()}
        <div className="rounded-xl p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300" style={{ 
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: '0 4px 15px rgba(22, 44, 73, 0.1)',
          border: '1px solid rgba(22, 44, 73, 0.1)'
        }}>
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.requesterName}
                    onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg transition-all duration-200"
                    style={{ 
                      borderColor: '#d1d5db',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#C1121F';
                      e.target.style.boxShadow = '0 0 0 3px rgba(193, 18, 31, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg transition-all duration-200"
                    style={{ 
                      borderColor: '#d1d5db',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#C1121F';
                      e.target.style.boxShadow = '0 0 0 3px rgba(193, 18, 31, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }}
                    placeholder="your.email@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg transition-all duration-200"
                    style={{ 
                      borderColor: '#d1d5db',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#C1121F';
                      e.target.style.boxShadow = '0 0 0 3px rgba(193, 18, 31, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }}
                    placeholder="+63 912 345 6789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg transition-all duration-200"
                    style={{ 
                      borderColor: '#d1d5db',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#C1121F';
                      e.target.style.boxShadow = '0 0 0 3px rgba(193, 18, 31, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Appointment Purpose</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {purposes.map((purpose) => (
                  <div
                    key={purpose.value}
                    onClick={() => setFormData({ ...formData, purpose: purpose.value })}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      formData.purpose === purpose.value
                        ? 'border-red-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      background: formData.purpose === purpose.value 
                        ? 'linear-gradient(135deg, rgba(193, 18, 31, 0.1) 0%, rgba(193, 18, 31, 0.05) 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      boxShadow: formData.purpose === purpose.value 
                        ? '0 4px 15px rgba(193, 18, 31, 0.2)'
                        : '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <h3 className="font-semibold mb-2" style={{ color: '#162C49' }}>{purpose.label}</h3>
                    <p className="text-sm" style={{ color: '#6c757d' }}>{purpose.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                {formData.purpose === 'return' ? 'Items to Return' : 'Select Items'}
              </h2>
              {formData.purpose === 'return' ? (
                <div className="rounded-lg p-6" style={{
                  background: 'linear-gradient(135deg, rgba(193, 18, 31, 0.1) 0%, rgba(193, 18, 31, 0.05) 100%)',
                  border: '1px solid rgba(193, 18, 31, 0.2)',
                  boxShadow: '0 4px 15px rgba(193, 18, 31, 0.1)'
                }}>
                  <p className="mb-4" style={{ color: '#C1121F' }}>
                    Please bring all items you wish to return. Our staff will verify and process them during your appointment.
                  </p>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg transition-all duration-200"
                    style={{ 
                      borderColor: '#d1d5db',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#C1121F';
                      e.target.style.boxShadow = '0 0 0 3px rgba(193, 18, 31, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }}
                    rows="4"
                    placeholder="List the items you're returning or add any special notes..."
                  />
                </div>
              ) : (
                <div>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200"
                          style={{ 
                            borderColor: '#d1d5db',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#C1121F';
                            e.target.style.boxShadow = '0 0 0 3px rgba(193, 18, 31, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db';
                            e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                          }}
                          placeholder="Search items..."
                        />
                      </div>
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-3 border rounded-lg transition-all duration-200"
                      style={{ 
                        borderColor: '#d1d5db',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#C1121F';
                        e.target.style.boxShadow = '0 0 0 3px rgba(193, 18, 31, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedItems.length > 0 && (
                    <div className="mb-6 p-4 rounded-lg" style={{
                      background: 'linear-gradient(135deg, rgba(22, 44, 73, 0.1) 0%, rgba(22, 44, 73, 0.05) 100%)',
                      border: '1px solid rgba(22, 44, 73, 0.2)',
                      boxShadow: '0 4px 15px rgba(22, 44, 73, 0.1)'
                    }}>
                      <h3 className="font-medium mb-2" style={{ color: '#162C49' }}>
                        Selected Items ({selectedItems.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedItems.map((item) => (
                          <span
                            key={item.id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm text-white transition-all duration-200"
                            style={{
                              backgroundColor: '#162C49',
                              boxShadow: '0 2px 8px rgba(22, 44, 73, 0.3)'
                            }}
                          >
                            {item.name}
                            <button
                              onClick={() => handleItemSelection(item)}
                              className="ml-2 text-white hover:text-gray-300 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map((item) => {
                      const isSelected = selectedItems.find(i => i.id === item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleItemSelection(item)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            isSelected
                              ? 'border-red-500'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          style={{
                            background: isSelected 
                              ? 'linear-gradient(135deg, rgba(193, 18, 31, 0.1) 0%, rgba(193, 18, 31, 0.05) 100%)'
                              : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                            boxShadow: isSelected 
                              ? '0 4px 15px rgba(193, 18, 31, 0.2)'
                              : '0 2px 8px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium" style={{ color: '#162C49' }}>{item.name}</h3>
                              <p className="text-sm" style={{ color: '#6c757d' }}>{item.category}</p>
                            </div>
                            {isSelected && (
                              <CheckCircle className="w-5 h-5" style={{ color: '#C1121F' }} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Select Date & Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border rounded-lg transition-all duration-200"
                    style={{ 
                      borderColor: '#d1d5db',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#C1121F';
                      e.target.style.boxShadow = '0 0 0 3px rgba(193, 18, 31, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time *
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setFormData({ ...formData, time })}
                        className={`p-2 text-sm border rounded-lg transition-all duration-200 ${
                          formData.time === time
                            ? 'text-white border-transparent'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{
                          backgroundColor: formData.time === time ? '#C1121F' : 'transparent',
                          boxShadow: formData.time === time ? '0 2px 8px rgba(193, 18, 31, 0.3)' : 'none'
                        }}
                        onMouseOver={(e) => {
                          if (formData.time !== time) {
                            e.target.style.backgroundColor = '#f8f9fa';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (formData.time !== time) {
                            e.target.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg transition-all duration-200"
                  style={{ 
                    borderColor: '#d1d5db',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#C1121F';
                    e.target.style.boxShadow = '0 0 0 3px rgba(193, 18, 31, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                  rows="3"
                  placeholder="Any special requirements or notes..."
                />
              </div>
            </div>
          )}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: '#6c757d' }}
              onMouseOver={(e) => !e.target.disabled && (e.target.style.color = '#162C49')}
              onMouseOut={(e) => !e.target.disabled && (e.target.style.color = '#6c757d')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!isStepValid(currentStep)}
                className="flex items-center px-6 py-3 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ backgroundColor: '#162C49' }}
                onMouseOver={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#0f1f2e')}
                onMouseOut={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#162C49')}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid(currentStep)}
                className="flex items-center px-6 py-3 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ backgroundColor: '#C1121F' }}
                onMouseOver={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#a50f1a')}
                onMouseOut={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#C1121F')}
              >
                Submit Appointment
                <CheckCircle className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- InventoryAccessSystem (Admin-facing) ---
const InventoryAccessSystem = ({ onLogout, currentUser, userRole }) => {
  const [items, setItems] = useState([
    { id: 1, description: 'MacBook Pro 13"', serialNo: 'MBP001', qrCode: 'QR001', status: 'available', category: 'Electronics', location: 'Storage A1' },
    { id: 2, description: 'Wireless Mouse', serialNo: 'WM002', qrCode: 'QR002', status: 'borrowed', category: 'Electronics', location: 'Storage A2' },
    { id: 3, description: 'Projector', serialNo: 'PJ003', qrCode: 'QR003', status: 'available', category: 'Equipment', location: 'Storage B1' },
    { id: 4, description: 'Camera Canon EOS', serialNo: 'CAM004', qrCode: 'QR004', status: 'available', category: 'Electronics', location: 'Storage A3' },
    { id: 5, description: 'Conference Table', serialNo: 'CT005', qrCode: 'QR005', status: 'available', category: 'Furniture', location: 'Storage C1' },
    { id: 6, description: 'Printer HP LaserJet', serialNo: 'HP006', qrCode: 'QR006', status: 'maintenance', category: 'Electronics', location: 'Storage A4' },
  ]);
  const [transactions, setTransactions] = useState([
    { id: 1, itemId: 2, borrowerName: 'John Doe', borrowerEmail: 'john.doe@company.com', office: 'IT Department', dateBorrowed: '2024-06-25', dateReturned: null, expectedReturn: '2024-07-05', status: 'borrowed' }
  ]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [scanMode, setScanMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [borrowForm, setBorrowForm] = useState({
    borrowerName: '', borrowerEmail: '', office: '', expectedReturn: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [newItem, setNewItem] = useState({
    description: '', serialNo: '', category: '', location: ''
  });

  const generateQRCode = () => {
    return 'QR' + String(Date.now()).slice(-6);
  };

  const simulateQRScan = (qrCode) => {
    const item = items.find(i => i.qrCode === qrCode);
    if (item) {
      setSelectedItem(item);
      setScanMode(false);
      setCurrentView('borrow');
    } else {
      alert('Item not found!');
    }
  };

  const handleBorrow = () => {
    if (!selectedItem || !borrowForm.borrowerName || !borrowForm.borrowerEmail || !borrowForm.office) {
      alert('Please fill all required fields');
      return;
    }
    const newTransaction = {
      id: transactions.length + 1,
      itemId: selectedItem.id,
      borrowerName: borrowForm.borrowerName,
      borrowerEmail: borrowForm.borrowerEmail,
      office: borrowForm.office,
      dateBorrowed: new Date().toISOString().split('T')[0],
      dateReturned: null,
      expectedReturn: borrowForm.expectedReturn,
      status: 'borrowed'
    };
    setTransactions([...transactions, newTransaction]);
    setItems(items.map(item =>
      item.id === selectedItem.id
        ? { ...item, status: 'borrowed' }
        : item
    ));
    setBorrowForm({ borrowerName: '', borrowerEmail: '', office: '', expectedReturn: '' });
    setSelectedItem(null);
    setCurrentView('dashboard');
    alert('Item borrowed successfully!');
  };

  const handleReturn = (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      setTransactions(transactions.map(t =>
        t.id === transactionId
          ? { ...t, dateReturned: new Date().toISOString().split('T')[0], status: 'returned' }
          : t
      ));
      setItems(items.map(item =>
        item.id === transaction.itemId
          ? { ...item, status: 'available' }
          : item
      ));
      alert('Item returned successfully!');
    }
  };

  const handleAddItem = () => {
    if (!newItem.description || !newItem.serialNo) {
      alert('Please fill all required fields');
      return;
    }
    const item = {
      id: items.length + 1,
      description: newItem.description,
      serialNo: newItem.serialNo,
      qrCode: generateQRCode(),
      status: 'available',
      category: newItem.category || 'General',
      location: newItem.location || 'Storage'
    };
    setItems([...items, item]);
    setNewItem({ description: '', serialNo: '', category: '', location: '' });
    alert('Item added successfully!');
  };

  const activeBorrowings = transactions.filter(t => t.status === 'borrowed');
  const availableItems = items.filter(i => i.status === 'available');
  const borrowedItems = items.filter(i => i.status === 'borrowed');
  const maintenanceItems = items.filter(i => i.status === 'maintenance');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || item.category === filterCategory;
    const matchesStatus = !filterStatus || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(items.map(item => item.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-40" style={{ backgroundColor: '#162C49' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Inventory Access System</h1>
                <p className="text-sm text-gray-300">Digital Transformation Center</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setScanMode(true)}
                className="flex items-center space-x-2 bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                <Scan className="w-5 h-5" />
                <span>Scan QR</span>
              </button>
              <div className="flex items-center space-x-3 px-4 py-2 bg-white bg-opacity-20 rounded-lg">
                <div className="flex items-center space-x-2">
                  {userRole === 'admin' ? <Shield className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                  <div className="text-sm">
                    <p className="font-medium text-white">{currentUser?.name}</p>
                    <p className="text-gray-300 capitalize">{userRole}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="text-white hover:text-gray-300 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['dashboard', 'items', 'borrowings', ...(userRole === 'admin' ? ['add-item', 'analytics'] : [])].map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`py-4 px-2 border-b-2 text-sm font-medium capitalize transition-colors ${
                  currentView === view
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {view.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome back, {currentUser?.name}!</h2>
                  <p className="text-red-100">Here's what's happening with your inventory today.</p>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Package className="w-12 h-12" />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left focus:outline-none"
                onClick={() => {
                  setCurrentView('items');
                  setFilterStatus('');
                }}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Package className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">{items.length}</p>
                  </div>
                </div>
              </button>
              <button
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left focus:outline-none"
                onClick={() => {
                  setCurrentView('items');
                  setFilterStatus('available');
                }}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-rose-100 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-rose-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available</p>
                    <p className="text-2xl font-bold text-gray-900">{availableItems.length}</p>
                  </div>
                </div>
              </button>
              <button
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left focus:outline-none"
                onClick={() => {
                  setCurrentView('items');
                  setFilterStatus('borrowed');
                }}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Borrowed</p>
                    <p className="text-2xl font-bold text-gray-900">{borrowedItems.length}</p>
                  </div>
                </div>
              </button>
              <button
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left focus:outline-none"
                onClick={() => setCurrentView('borrowings')}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-rose-100 rounded-lg">
                    <Users className="w-8 h-8 text-rose-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Loans</p>
                    <p className="text-2xl font-bold text-gray-900">{activeBorrowings.length}</p>
                  </div>
                </div>
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Borrowings</h3>
                </div>
                <div className="p-6">
                  {activeBorrowings.length > 0 ? (
                    <div className="space-y-4">
                      {activeBorrowings.slice(0, 3).map((transaction) => {
                        const item = items.find(i => i.id === transaction.itemId);
                        return (
                          <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-red-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{item?.description}</p>
                                <p className="text-sm text-gray-500">{transaction.borrowerName}</p>
                              </div>
                            </div>
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              Borrowed
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No active borrowings</p>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setCurrentView('items')}
                      className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"

                    >
                      <Search className="w-8 h-8 text-red-600 mb-2" />
                      <span className="text-sm font-medium text-red-600">Browse Items</span>
                    </button>
                    <button
                      onClick={() => setScanMode(true)}
                      className="flex flex-col items-center p-4 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                    >
                      <Scan className="w-8 h-8 text-rose-600 mb-2" />
                      <span className="text-sm font-medium text-rose-600">Scan QR Code</span>
                    </button>
                    {userRole === 'admin' && (
                      <>
                        <button
                          onClick={() => setCurrentView('add-item')}
                          className="flex flex-col items-center p-4 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                        >
                          <Plus className="w-8 h-8 text-rose-600 mb-2" />
                          <span className="text-sm font-medium text-rose-600">Add Item</span>
                        </button>
                        <button
                          onClick={() => setCurrentView('analytics')}
                          className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <BarChart3 className="w-8 h-8 text-red-600 mb-2" />
                          <span className="text-sm font-medium text-red-600">Analytics</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentView === 'items' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Inventory Items</h2>
                <p className="text-gray-600">Manage and track all your inventory items</p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="borrowed">Borrowed</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.description}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-center">
                            <Package className="w-4 h-4 mr-2" />
                            Serial: {item.serialNo}
                          </p>
                          <p className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            Location: {item.location}
                          </p>
                          <p className="text-xs text-gray-500">QR: {item.qrCode}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'available'
                          ? 'bg-rose-100 text-rose-800'
                          : item.status === 'borrowed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      {item.status === 'available' && (
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setCurrentView('borrow');
                          }}
                          className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-rose-700 transition-all transform hover:scale-105 text-sm font-medium"
                        >
                          Borrow
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {currentView === 'borrow' && selectedItem && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Borrow Item</h2>
                <p className="text-gray-600">Fill out the form below to borrow this item</p>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Item Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Item:</span>
                      <p className="font-medium">{selectedItem.description}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Serial No:</span>
                      <p className="font-medium">{selectedItem.serialNo}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <p className="font-medium">{selectedItem.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <p className="font-medium">{selectedItem.location}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Borrower Name *
                    </label>
                    <input
                      type="text"
                      value={borrowForm.borrowerName}
                      onChange={(e) => setBorrowForm({ ...borrowForm, borrowerName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={borrowForm.borrowerEmail}
                      onChange={(e) => setBorrowForm({ ...borrowForm, borrowerEmail: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Office/Department *
                    </label>
                    <input
                      type="text"
                      value={borrowForm.office}
                      onChange={(e) => setBorrowForm({ ...borrowForm, office: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="Enter department"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Expected Return Date
                    </label>
                    <input
                      type="date"
                      value={borrowForm.expectedReturn}
                      onChange={(e) => setBorrowForm({ ...borrowForm, expectedReturn: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={handleBorrow}
                    className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 px-6 rounded-lg hover:from-red-700 hover:to-rose-700 transition-all transform hover:scale-105 font-medium"
                  >
                    Confirm Borrow
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('dashboard');
                      setSelectedItem(null);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-all font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentView === 'add-item' && userRole === 'admin' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-rose-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Item</h2>
                <p className="text-gray-600">Add a new item to the inventory system</p>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Package className="w-4 h-4 inline mr-1" />
                      Item Description *
                    </label>
                    <input
                      type="text"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="e.g., MacBook Pro 13-inch"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number *</label>
                    <input
                      type="text"
                      value={newItem.serialNo}
                      onChange={(e) => setNewItem({ ...newItem, serialNo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="e.g., MBP001"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Office Supplies">Office Supplies</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Storage Location
                    </label>
                    <input
                      type="text"
                      value={newItem.location}
                      onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="e.g., Storage A1"
                    />
                  </div>
                </div>
                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={handleAddItem}
                    className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-rose-700 hover:to-pink-700 transition-all transform hover:scale-105 font-medium"
                  >
                    Add Item
                  </button>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-all font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentView === 'borrowings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Borrowings</h2>
              <p className="text-gray-600">Track all borrowing transactions and returns</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Office</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Borrowed</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Return</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Returned</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      {userRole === 'admin' && (
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => {
                      const item = items.find(i => i.id === transaction.itemId);
                      return (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                                <Package className="w-5 h-5 text-red-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item?.description}</div>
                                <div className="text-sm text-gray-500">{item?.serialNo}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.borrowerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.borrowerEmail}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.office}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.dateBorrowed}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.expectedReturn || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.dateReturned || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              transaction.status === 'returned'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          {userRole === 'admin' && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {transaction.status === 'borrowed' && (
                                <button
                                  onClick={() => handleReturn(transaction.id)}
                                  className="text-rose-600 hover:text-rose-900 font-medium"
                                >
                                  Mark Returned
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {currentView === 'analytics' && userRole === 'admin' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
              <p className="text-gray-600">Insights and statistics about your inventory</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round((borrowedItems.length / items.length) * 100)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-rose-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Items in Maintenance</p>
                    <p className="text-2xl font-bold text-gray-900">{maintenanceItems.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Loan Duration</p>
                    <p className="text-2xl font-bold text-gray-900">7 days</p>
                  </div>
                  <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-rose-600" />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Items by Category</h3>
                <div className="space-y-4">
                  {categories.map(category => {
                    const categoryItems = items.filter(item => item.category === category);
                    const percentage = Math.round((categoryItems.length / items.length) * 100);
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{category}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 w-8">{categoryItems.length}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Status Overview</h3>
                <div className="space-y-4">
                  {[
                    { status: 'Available', count: availableItems.length, color: 'bg-rose-600' },
                    { status: 'Borrowed', count: borrowedItems.length, color: 'bg-red-600' },
                    { status: 'Maintenance', count: maintenanceItems.length, color: 'bg-red-600' }
                  ].map(({ status, count, color }) => {
                    const percentage = Math.round((count / items.length) * 100);
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{status}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`${color} h-2 rounded-full`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {scanMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">QR Code Scanner</h3>
              <button
                onClick={() => setScanMode(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-64 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Scan className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Camera preview would appear here</p>
                  <p className="text-sm text-gray-500 mt-2">Point camera at QR code to scan</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Demo - Click to simulate scanning:</p>
                <div className="grid grid-cols-2 gap-3">
                  {items.slice(0, 4).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => simulateQRScan(item.qrCode)}
                      className="text-xs bg-red-50 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
                    >
                      {item.qrCode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Application Component ---
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'user'
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [currentSystem, setCurrentSystem] = useState('user'); // 'user' or 'admin'

  const demoUsers = {
    'admin@company.com': { password: 'admin123', role: 'admin', name: 'Admin User' },
    'user@company.com': { password: 'user123', role: 'user', name: 'Regular User' }
  };

  const handleLogin = () => {
    const user = demoUsers[loginForm.email];
    if (user && user.password === loginForm.password) {
      setIsAuthenticated(true);
      setCurrentUser({ email: loginForm.email, name: user.name });
      setUserRole(user.role);
      setCurrentSystem(user.role === 'admin' ? 'admin' : 'user');
    } else {
      alert('Invalid credentials. Try admin@company.com/admin123 or user@company.com/user123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserRole(null);
    setLoginForm({ email: '', password: '' });
    setCurrentSystem('user'); // Default to user system after logout
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
        <div className="flex min-h-screen">
          <div
            className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 to-rose-700 relative overflow-hidden"
            style={{
              backgroundImage: "url('/dtc-bg.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-black opacity-20"></div>
                      <div className="relative z-10 flex flex-col justify-center px-6 sm:px-12 text-white">
            <div className="flex items-center mb-6 sm:mb-8">
              <Package className="w-8 h-8 sm:w-12 sm:h-12 mr-3 sm:mr-4" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Inventory Access System</h1>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-light mb-4 sm:mb-6">Digital Transformation Center</h2>
            <p className="text-base sm:text-lg lg:text-xl opacity-90 mb-6 sm:mb-8">Streamline your inventory operations with our comprehensive tracking and borrowing system.</p>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                <span className="text-sm sm:text-base">2F STEER Hub Bldg., Batangas State University, TNEU - Alangilan Campus, Golden Country Homes, Alangilan, Batangas City</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="text-sm sm:text-base">dtc@g.batstate-u.edu.ph</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="text-sm sm:text-base">(043) 425-0139</span>
              </div>
            </div>
          </div>

          </div>
          <div className="w-full lg:w-1/2 flex items-center justify-center px-8 bg-secondary-light min-h-screen">
            <div className="max-w-md w-full relative">
              {/* Red accent bar at the top */}
              <div className="h-2 w-24 rounded-full bg-primary absolute -top-6 left-1/2 transform -translate-x-1/2 shadow-lg"></div>
              <div className="text-center mb-6 sm:mb-8">
                <div className="flex items-center justify-center mb-4 lg:hidden">
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-primary mr-2 sm:mr-3" />
                  <h1 className="text-xl sm:text-2xl font-bold text-secondary">InventoryPro</h1>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">Welcome Back</h2>
                <p className="text-secondary text-sm sm:text-base">Sign in to access your inventory system</p>
              </div>
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-secondary/30">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Email Address</label>
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-secondary-light/40 text-secondary"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">Password</label>
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-secondary-light/40 text-secondary"
                      placeholder="Enter your password"
                    />
                  </div>
                  <button
                    onClick={handleLogin}
                    className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105 font-medium shadow-md"
                  >
                    Sign In
                  </button>
                  <div className="mt-6 p-4 bg-secondary-light/60 rounded-lg">
                    <p className="text-sm text-secondary font-medium mb-2">Demo Accounts:</p>
                    <div className="space-y-1 text-xs text-secondary/70">
                      <p><strong>Admin:</strong> admin@company.com / admin123</p>
                      <p><strong>User:</strong> user@company.com / user123</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {currentSystem === 'user' && (
        <InventoryAppointmentSystem onLogout={handleLogout} currentUser={currentUser} userRole={userRole} />
      )}
      {currentSystem === 'admin' && userRole === 'admin' && (
        <InventoryAccessSystem onLogout={handleLogout} currentUser={currentUser} userRole={userRole} />
      )}
      {currentSystem === 'admin' && userRole !== 'admin' && (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600">You do not have administrative privileges to view this system.</p>
            <button
              onClick={() => setCurrentSystem('user')}
              className="mt-6 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Go to User System
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

