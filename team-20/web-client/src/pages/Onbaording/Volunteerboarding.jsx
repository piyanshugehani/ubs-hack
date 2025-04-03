import  { useState } from 'react';
import { Heart, ChevronRight, ChevronLeft, User, CheckCircle2, UserPlus, BookOpen, Calendar, Home } from 'lucide-react';

function VolunteerForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    birthdate: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    skills: [],
    availability: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    preferredHours: 'morning',
    experience: '',
    motivation: '',
    heardFrom: '',
    agreeToTerms: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'agreeToTerms') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (type === 'checkbox' && name.startsWith('availability.')) {
      const day = name.split('.')[1];
      setFormData({
        ...formData,
        availability: {
          ...formData.availability,
          [day]: checked,
        },
      });
    } else if (type === 'checkbox' && name === 'skills') {
      const updatedSkills = [...formData.skills];
      if (checked) {
        updatedSkills.push(value);
      } else {
        const index = updatedSkills.indexOf(value);
        if (index > -1) {
          updatedSkills.splice(index, 1);
        }
      }
      setFormData({
        ...formData,
        skills: updatedSkills,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email address is invalid';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        break;
      case 2:
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required';
        break;
      case 3:
        if (!formData.emergencyContactName.trim()) {
          newErrors.emergencyContactName = 'Emergency contact name is required';
        }
        if (!formData.emergencyContactPhone.trim()) {
          newErrors.emergencyContactPhone = 'Emergency contact phone is required';
        }
        break;
      case 4:
        const hasAvailability = Object.values(formData.availability).some(day => day);
        if (!hasAvailability) {
          newErrors.availability = 'Please select at least one day of availability';
        }
        break;
      case 5:
        if (!formData.agreeToTerms) {
          newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        }
        break;
    }

    return newErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length === 0) {
      setErrors({});
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      setErrors(stepErrors);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const stepErrors = validateStep(currentStep);
    
    if (Object.keys(stepErrors).length === 0) {
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      setErrors({});
    } else {
      setErrors(stepErrors);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      birthdate: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      skills: [],
      availability: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
      preferredHours: 'morning',
      experience: '',
      motivation: '',
      heardFrom: '',
      agreeToTerms: false,
    });
    setErrors({});
    setIsSubmitted(false);
    setCurrentStep(1);
  };

  const ProgressBar = () => (
    <div className="w-full py-4">
      <div className="flex justify-between mb-4">
        {[...Array(totalSteps)].map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep > index + 1 ? 'bg-indigo-600' :
              currentStep === index + 1 ? 'bg-indigo-500' :
              'bg-gray-200'
            } transition-colors duration-200`}>
              {index + 1 <= currentStep ? (
                <span className="text-white font-medium">{index + 1}</span>
              ) : (
                <span className="text-gray-500 font-medium">{index + 1}</span>
              )}
            </div>
            <div className="text-xs mt-2 text-gray-500">
              {index === 0 && 'Personal Info'}
              {index === 1 && 'Address'}
              {index === 2 && 'Emergency Contact'}
              {index === 3 && 'Availability'}
              {index === 4 && 'Review'}
            </div>
          </div>
        ))}
      </div>
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  const FormField = ({ label, name, type = "text", error, children, required = false }) => (
    <div className="col-span-6 sm:col-span-3">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        {children || (
          <input
            type={type}
            name={name}
            id={name}
            value={formData[name]}
            onChange={handleChange}
            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
              error ? 'border-red-300' : ''
            }`}
          />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );

  const SuccessMessage = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Thank You for Volunteering!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Your application has been submitted successfully. We will contact you shortly.
          </p>
        </div>
        <div className="mt-6">
          <button
            onClick={handleReset}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    </div>
  );

  const StepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900 mb-6">
              <User className="h-6 w-6 text-indigo-500" />
              <span>Personal Information</span>
            </div>
            <div className="grid grid-cols-6 gap-6">
              <FormField label="First Name" name="firstName" required error={errors.firstName} />
              <FormField label="Last Name" name="lastName" required error={errors.lastName} />
              <FormField label="Email" name="email" type="email" required error={errors.email} />
              <FormField label="Phone" name="phone" type="tel" required error={errors.phone} />
              <FormField label="Date of Birth" name="birthdate" type="date" className="col-span-6" />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900 mb-6">
              <Home className="h-6 w-6 text-indigo-500" />
              <span>Address Information</span>
            </div>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <FormField label="Street Address" name="address" required error={errors.address} />
              </div>
              <FormField label="City" name="city" required error={errors.city} />
              <FormField label="State" name="state" required error={errors.state} />
              <FormField label="ZIP Code" name="zip" required error={errors.zip} />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900 mb-6">
              <UserPlus className="h-6 w-6 text-indigo-500" />
              <span>Emergency Contact</span>
            </div>
            <div className="grid grid-cols-6 gap-6">
              <FormField
                label="Emergency Contact Name"
                name="emergencyContactName"
                required
                error={errors.emergencyContactName}
              />
              <FormField
                label="Emergency Contact Phone"
                name="emergencyContactPhone"
                type="tel"
                required
                error={errors.emergencyContactPhone}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900 mb-6">
              <Calendar className="h-6 w-6 text-indigo-500" />
              <span>Skills and Availability</span>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Skills and Interests
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    'teaching',
                    'mentoring',
                    'administration',
                    'eventPlanning',
                    'fundraising',
                    'marketing'
                  ].map((skill) => (
                    <div key={skill} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`skills${skill}`}
                        name="skills"
                        value={skill}
                        checked={formData.skills.includes(skill)}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`skills${skill}`} className="ml-2 text-sm text-gray-700">
                        {skill.charAt(0).toUpperCase() + skill.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Availability <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.keys(formData.availability).map((day) => (
                    <div key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`availability-${day}`}
                        name={`availability.${day}`}
                        checked={formData.availability[day]}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`availability-${day}`} className="ml-2 text-sm text-gray-700">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.availability && (
                  <p className="mt-1 text-sm text-red-600">{errors.availability}</p>
                )}
              </div>

              <div>
                <label htmlFor="preferredHours" className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Hours
                </label>
                <select
                  id="preferredHours"
                  name="preferredHours"
                  value={formData.preferredHours}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="morning">Morning (8am - 12pm)</option>
                  <option value="afternoon">Afternoon (12pm - 5pm)</option>
                  <option value="evening">Evening (5pm - 9pm)</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900 mb-6">
              <BookOpen className="h-6 w-6 text-indigo-500" />
              <span>Additional Information</span>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Previous Volunteer Experience
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  rows={4}
                  value={formData.experience}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-1">
                  Why do you want to volunteer with us?
                </label>
                <textarea
                  id="motivation"
                  name="motivation"
                  rows={4}
                  value={formData.motivation}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="heardFrom" className="block text-sm font-medium text-gray-700 mb-1">
                  How did you hear about our volunteer program?
                </label>
                <select
                  id="heardFrom"
                  name="heardFrom"
                  value={formData.heardFrom}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Please select an option</option>
                  <option value="website">Website</option>
                  <option value="socialMedia">Social Media</option>
                  <option value="friend">Friend/Family</option>
                  <option value="volunteer">Current Volunteer</option>
                  <option value="event">Community Event</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                    I agree to the terms and conditions, including the volunteer code of conduct and privacy policy <span className="text-red-500">*</span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const Form = () => (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white px-8 py-6 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <Heart className="mx-auto h-12 w-12 text-indigo-600" />
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Volunteer Onboarding Form</h1>
            <p className="mt-2 text-gray-600">
              Join our team of dedicated volunteers and make a difference in your community
            </p>
          </div>

          <ProgressBar />

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <StepContent />
            </div>

            <div className="flex justify-between pt-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </button>
              )}
              <div className="ml-auto">
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit Application
                    <CheckCircle2 className="h-4 w-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return isSubmitted ? <SuccessMessage /> : <Form />;
}

export default VolunteerForm;