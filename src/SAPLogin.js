import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, LogIn, AlertCircle, CheckCircle } from 'lucide-react';

const SAPLogin = () => {
  const [formData, setFormData] = useState({
    userName: 'Administrator',
    password: 'Novolog@P@ss245',
    auth: 'secEnterprise'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const authOptions = [
    { value: 'secEnterprise', label: 'Enterprise' },
    { value: 'secLDAP', label: 'LDAP' },
    { value: 'secWinAD', label: 'Windows AD' },
    { value: 'secSAPR3', label: 'SAP R/3' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createXMLPayload = () => {
    return `<attrs xmlns="http://www.sap.com/rws/bip">
    <attr name="password" type="string">${formData.password}</attr>
    <attr name="auth" type="string" possibilities="secEnterprise,secLDAP,secWinAD,secSAPR3">${formData.auth}</attr>
    <attr name="userName" type="string">${formData.userName}</attr>
</attrs>`;
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const xmlPayload = createXMLPayload();
      
      const response = await fetch('https://4e.novolog.co.il/biprws/logon/long', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          'Accept': 'application/xml',
        },
        body: xmlPayload
      });

      const responseText = await response.text();
      
      if (response.ok) {
        setResponse({
          status: 'success',
          data: responseText,
          statusCode: response.status
        });
      } else {
        setError({
          message: `Login failed: ${response.status} ${response.statusText}`,
          details: responseText
        });
      }
    } catch (err) {
      setError({
        message: 'Network error or CORS issue',
        details: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">BO Secluded Monitor</h1>
            <p className="text-gray-600">Secure BusinessObjects Access Portal</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Authentication Type
              </label>
              <select
                name="auth"
                value={formData.auth}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {authOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">{error.message}</p>
                  {error.details && (
                    <p className="text-red-600 text-sm mt-1">{error.details}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {response && response.status === 'success' && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">Login Successful!</p>
                  <p className="text-green-600 text-sm mt-1">Status: {response.statusCode}</p>
                  <details className="mt-2">
                    <summary className="text-green-700 cursor-pointer text-sm">View Response</summary>
                    <pre className="text-xs bg-green-100 p-2 rounded mt-2 overflow-x-auto">
                      {response.data}
                    </pre>
                  </details>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Endpoint: <code className="bg-gray-100 px-2 py-1 rounded text-xs">4e.novolog.co.il/biprws/logon/long</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SAPLogin;
