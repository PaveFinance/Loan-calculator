import React, { useState, useEffect } from "react";

export default function LoanCalculator() {
  const [salary, setSalary] = useState('');
  const [rent, setRent] = useState('');
  const [maxBorrow, setMaxBorrow] = useState(0);
  const [upfront, setUpfront] = useState(25); // Default to 25% upfront
  const [paymentSchedule, setPaymentSchedule] = useState("monthly");
  const [loanDetails, setLoanDetails] = useState(null);
  const [step, setStep] = useState(1); // Step control for the flow
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [role, setRole] = useState('');
  const [yearsEmployed, setYearsEmployed] = useState('');
  const [hrManagerName, setHrManagerName] = useState('');
  const [hrManagerEmail, setHrManagerEmail] = useState('');
  const [hrManagerPhone, setHrManagerPhone] = useState('');
  const [consentToContactEmployer, setConsentToContactEmployer] = useState(false);
  const [consentToDeduction, setConsentToDeduction] = useState(false);
  const [consentToProceed, setConsentToProceed] = useState(false);
  const [consentToFees, setConsentToFees] = useState(false);
  const [landlordName, setLandlordName] = useState('');
  const [landlordPhone, setLandlordPhone] = useState('');
  const [landlordEmail, setLandlordEmail] = useState('');
  const [apartmentLocation, setApartmentLocation] = useState('');
  const [guarantorName, setGuarantorName] = useState("");
  const [guarantorEmail, setGuarantorEmail] = useState("");
  const [guarantorPhone, setGuarantorPhone] = useState("");
  const [errors, setErrors] = useState({}); // For validation errors
  const [isSubmitted, setIsSubmitted] = useState(false); // For submission tracking

  const resetForm = () => {
    setSalary("");
    setRent("");
    setName("");
    setEmail("");
    // Reset other fields as necessary
  };

  const handleFormSubmit = () => {
    if (!name || !email || !phone) {
      alert("Please fill out all the required fields.");
      return;
    }
    setIsSubmitted(true);
  };

  const validateInput = (value, fieldName) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, [fieldName]: `${fieldName} is required.` }));
    } else {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const [isConsentChecked, setIsConsentChecked] = useState({
    contactEmployer: false,
    salaryDeduction: false,
    proceedApplication: false,
    feesConsent: false,
  });
   // Helper function to check if all fields are filled in Step 4
  const isFormComplete = () => {
    return (
      landlordName &&
      landlordPhone &&
      landlordEmail &&
      apartmentLocation &&
      guarantorName &&
      guarantorEmail &&
      guarantorPhone
        );
  };
  const handleConsentChange = (e) => {
    setIsConsentChecked({
      ...isConsentChecked,
      [e.target.name]: e.target.checked,
    });
  };

  const interestRates = {
    25: 1.485,
    30: 1.465,
    35: 1.445,
    40: 1.425,
    45: 1.405,
    50: 1.385,
    55: 1.365,
    60: 1.345,
    65: 1.325,
    70: 1.315,
    75: 1.299,
  };

  const periods = {
    monthly: 12,
    quarterly: 4,
    tri_annual: 3,
    bi_annual: 2,
  };

  // Handle Salary Input (Step 1)
  const handleSalaryInput = () => {
    const salaryNum = Number(salary);
    if (salaryNum > 0) {
      setMaxBorrow(salaryNum * 0.35 * 0.82);
      setStep(2); // Proceed to the rent input section
    } else {
      setErrors({ salary: "Salary must be a positive number." });
    }
  };

  // Handle Rent Input (Step 2)
  const handleRentInput = () => {
    const rentNum = Number(rent);
    if (maxBorrow && rentNum <= maxBorrow) {
      setLoanDetails(null);
    } else {
      setLoanDetails({ error: `You can only borrow up to GHS ${maxBorrow.toFixed(2)}` });
    }
  };

  // Loan Calculation Logic
  const calculateLoan = () => {
    const rentNum = Number(rent);
    const yearlyRent = rentNum * 13;
    const upfrontPayment = (upfront / 100) * yearlyRent; // Convert upfront to percentage
    const remainingAmount = yearlyRent - upfrontPayment;
    const totalRepayment = Math.round(remainingAmount * interestRates[upfront]);
    const totalRepaymentPeriods = periods[paymentSchedule];
    const repaymentAmount = totalRepayment / totalRepaymentPeriods;
    setLoanDetails({ upfrontPayment, totalRepayment, repaymentAmount });
  };

  useEffect(() => {
    if (rent && maxBorrow && interestRates[upfront] && periods[paymentSchedule]) {
      calculateLoan();
    }
  }, [rent, upfront, paymentSchedule]);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg space-y-6">


      {/* Step 1: Salary Input */}
      {step === 1 && (
        <>
            <h2 className="text-4xl font-bold text-center text-blue-600">Pave Loan Calculator</h2>
          <h2 className="text-lg font-bold text-center text-blue-900 underline">Please Input Your Monthly Salary</h2>
      
          <input
            id="salary"
            type="number"
            placeholder="Enter Salary"
            className="w-full p-3 border rounded"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
          {errors.salary && <p className="text-red-500">{errors.salary}</p>}
          <button
            onClick={handleSalaryInput}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-700"
          >
            Next
          </button>
        </>
      )}

      {/* Step 2: Rent and Loan Details */}
      {step === 2 && (
        <>
        <h2 className="text-2xl font-bold text-center text-blue-600">Pave Loan Calculator</h2>
        <h2 className="text-lg font-bold text-center text-blue-900 underline">Maximum Amount You Can Borrow: GHS {maxBorrow.toFixed(2)}</h2>
          <label htmlFor="rent" className="block text-sm font-medium text-gray-700">Monthly Rent</label>
          <input
            id="rent"
            type="number"
            placeholder="Enter Monthly Rent Amount"
            className="w-full p-3 border rounded"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            onBlur={handleRentInput}
          />
          {loanDetails?.error ? (
            <p className="text-red-500">{loanDetails.error}</p>
          ) : (
            <>
              <label htmlFor="upfront" className="block text-sm font-medium text-gray-700">Upfront Payment</label>
              <select
                id="upfront"
                className="w-full p-3 border rounded"
                value={upfront}
                onChange={(e) => setUpfront(Number(e.target.value))}
              >
                {Object.keys(interestRates).map((percent) => (
                  <option key={percent} value={percent}>{`${percent}% Upfront`}</option>
                ))}
              </select>

              <label htmlFor="paymentSchedule" className="block text-sm font-medium text-gray-700">Payment Schedule</label>
              <select
                id="paymentSchedule"
                className="w-full p-3 border rounded"
                onChange={(e) => setPaymentSchedule(e.target.value)}
                value={paymentSchedule}
              >
                <option value="monthly">Monthly Repayments</option>
                <option value="quarterly">4 Repayments</option>
                <option value="tri_annual">3 Repayments</option>
                <option value="bi_annual">2 Repayments</option>
              </select>

              <button
                onClick={calculateLoan}
                className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-700 mt-4"
              >
                Calculate Loan
              </button>

              {loanDetails && (
                <div className="mt-4 p-4 border rounded bg-gray-100">
                  <p>Upfront Payment: GHS {loanDetails.upfrontPayment.toFixed(2)}</p>
                  <p>Total Repayment (Includes Interest): GHS {loanDetails.totalRepayment.toFixed(2)}</p>
                  <p>
                    {paymentSchedule === "monthly" && "Monthly Repayments"}
                    {paymentSchedule === "quarterly" && "4 Repayments"}
                    {paymentSchedule === "tri_annual" && "3 Repayments"}
                    {paymentSchedule === "bi_annual" && "2 Repayments"}: GHS{" "}
                    {loanDetails.repaymentAmount.toFixed(2)}
                  </p>
                </div>
              )}
            </>
          )}

          <button
            onClick={() => setStep(3)}
            className="w-full bg-blue-500 text-white p-3 rounded mt-4"
          >
            Proceed to Application
          </button>
        </>
      )}

      {/* Step 3: Loan Application Form */}
      {step === 3 && (
        <>
     <h2 className="text-3xl font-bold text-center text-blue-800 underline">Loan Application Form</h2>

          {/* Application Form Fields */} 
          <input
            id="name"
            type="text"
            className="w-full p-3 border rounded"
            placeholder=" Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}

        
          <input
            id="email"
            type="email"
            className="w-full p-3 border rounded"
            placeholder=" Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}

          <input
            id="phone"
            type="tel"
            className="w-full p-3 border rounded"
            placeholder=" Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <p className="text-red-500">{errors.phone}</p>}
<input
  id="company"
  type="text"
  className="w-full p-3 border rounded"
  placeholder="Company"
  value={company}
  onChange={(e) => setCompany(e.target.value)}
/>
{errors.company && <p className="text-red-500">{errors.company}</p>}
<input
  id="companyAddress"
  type="text"
  className="w-full p-3 border rounded"
  placeholder="Company Address"
  value={companyAddress}
  onChange={(e) => setCompanyAddress(e.target.value)}
/>
{errors.companyAddress && <p className="text-red-500">{errors.companyAddress}</p>}
        
     <input
  id="role"
  type="text"
  className="w-full p-3 border rounded"
  placeholder="Role"
  value={role}
  onChange={(e) => setRole(e.target.value)}
/>
{errors.role && <p className="text-red-500">{errors.role}</p>}

<input
  id="yearsEmployed"
  type="text"
  className="w-full p-3 border rounded"
  placeholder="Years Employed"
  value={yearsEmployed}
  onChange={(e) => setYearsEmployed(e.target.value)}
/>
{errors.yearsEmployed && <p className="text-red-500">{errors.yearsEmployed}</p>}

<input
  id="hrManagerName"
  type="text"
  className="w-full p-3 border rounded"
  placeholder="HR Manager Name"
  value={hrManagerName}
  onChange={(e) => setHrManagerName(e.target.value)}
/>
{errors.hrManagerName && <p className="text-red-500">{errors.hrManagerName}</p>}

<input
  id="hrManagerEmail"
  type="text"
  className="w-full p-3 border rounded"
  placeholder="HR Manager Email"
  value={hrManagerEmail}
  onChange={(e) => setHrManagerEmail(e.target.value)}
/>
{errors.hrManagerEmail && <p className="text-red-500">{errors.hrManagerEmail}</p>}

<input
  id="hrManagerPhone"
  type="text"
  className="w-full p-3 border rounded"
  placeholder="HR Manager Phone Number"
  value={hrManagerPhone}
  onChange={(e) => setHrManagerPhone(e.target.value)}
/>
{errors.hrManagerPhone && <p className="text-red-500">{errors.hrManagerPhone}</p>}

            
            

          {/* Consent Section */}
          <div className="mt-8">
            <p className="mb-4">
              <input
                type="checkbox"
                name="contactEmployer"
                checked={isConsentChecked.contactEmployer}
                onChange={handleConsentChange}
                className="mr-3"
              />
              Do you consent to Pave reaching out to your Employer to provide an undertaking to guarantee your facility?
            </p>
            <p className="mb-4">
              <input
                type="checkbox"
                name="salaryDeduction"
                checked={isConsentChecked.salaryDeduction}
                onChange={handleConsentChange}
                className="mr-3"
              />
              Do you consent to an amount of GHS {loanDetails?.repaymentAmount?.toFixed(2)} being deducted from your salary monthly?
            </p>
            <p className="mb-4">
              <input
                type="checkbox"
                name="proceedApplication"
                checked={isConsentChecked.proceedApplication}
                onChange={handleConsentChange}
                className="mr-3"
              />
              By checking this box and writing your name above, you consent with PAVE proceeding with your Application.
            </p>
            <p className="mb-4">
              <input
                type="checkbox"
                name="feesConsent"
                checked={isConsentChecked.feesConsent}
                onChange={handleConsentChange}
                className="mr-3"
              />
              By checking this box, you consent to paying any applicable fees to proceed with your Application.
            </p>
          </div>

          {/* Submit Button */}
          <button
          onClick={() => setStep(4)} // Move to rental application form
            className="w-full bg-blue-500 text-white p-3 rounded mt-4"
            disabled={!Object.values(isConsentChecked).every(Boolean)} // Disable button if not all checkboxes are checked
          >
            Submit Loan Application
              
          </button>
              <button
            onClick={() => setStep(2)} // Go back to rent and loan details
            className="w-full bg-gray-500 text-white p-3 rounded hover:bg-gray-700 mt-4"
          >
            Back
          </button>
        </>
      )}
          {/* Step 4: Rental Application Form */}
      {step === 4 && (
        <>
     <h2 className="text-2xl font-bold text-center text-blue-800 underline">Landlord Information </h2>
            
          <input
            type="text"
            placeholder="Landlord Name"
            className="w-full p-3 border rounded"
            value={landlordName}
            onChange={(e) => setLandlordName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Landlord Phone"
            className="w-full p-3 border rounded"
            value={landlordPhone}
            onChange={(e) => setLandlordPhone(e.target.value)}
          />
          <input
            type="email"
            placeholder="Landlord Email"
            className="w-full p-3 border rounded"
            value={landlordEmail}
            onChange={(e) => setLandlordEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Apartment Location"
            className="w-full p-3 border rounded"
            value={apartmentLocation}
            onChange={(e) => setApartmentLocation(e.target.value)}
        />
                 {/* Guarantor Section */}
     <h2 className="text-2xl font-bold text-center text-blue-800 underline">Guarantor Information</h2>
        <input
            type="text"
            placeholder="Guarantor's Name"
            className="w-full p-3 border rounded"
            value={guarantorName}
            onChange={(e) => setGuarantorName(e.target.value)}
    
        />
          <input
            type="email"
            placeholder="Guarantor's Email"
            className="w-full p-3 border rounded"
            value={guarantorEmail}
            onChange={(e) => setGuarantorEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Guarantor's Phone"
            className="w-full p-3 border rounded"
            value={guarantorPhone}
            onChange={(e) => setGuarantorPhone(e.target.value)}
          />
         {/* Submit Rental Application Button */}
          <button
            onClick={() => setStep(5)} // Move to final submission (Step 5)
            className={`w-full p-3 rounded mt-4 ${!isFormComplete() ? 'bg-gray-400' : 'bg-green-500'} text-white`}
            disabled={!isFormComplete()} // Disable button if form is incomplete
          >
            Submit Rental Application
          </button>
             <button
            onClick={() => setStep(3)} // Go back to loan application form
            className="w-full bg-gray-500 text-white p-3 rounded hover:bg-gray-700 mt-4"
          >
            Back
          </button>
        
        
        </>
      )}

      {/* Step 5: Application Summary */}
      {step === 5 && (
        <>
     <h2 className="text-3xl font-bold text-center text-blue-900">Application Summary</h2>
            <h3 className="text-lg font-bold text-center text-blue-700 underline decoration-blue-700">Applicant Details</h3>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Phone Number:</strong> {phone}</p>
          <p><strong>Salary:</strong> GHS {salary}</p>
            <h3 className="text-lg font-bold text-center text-blue-700 underline decoration-blue-700 ">Payments Summary</h3>
          <p><strong>Payment Schedule:</strong> 
            {paymentSchedule === "monthly" && "12 Repayments"}
            {paymentSchedule === "quarterly" && "4 Repayments"}
            {paymentSchedule === "tri_annual" && "3 Repayments"}
            {paymentSchedule === "bi_annual" && "2 Repayments"}
          </p>
          <p><strong>Upfront Payment:</strong> GHS {loanDetails?.upfrontPayment?.toFixed(2)}</p>
          <p><strong>Repayment Amount:</strong> GHS {loanDetails?.repaymentAmount?.toFixed(2)}</p>

          {/* Rental Application Summary */}
    <h3 className="text-lg font-bold text-center text-blue-700 underline decoration-blue-700">Landlord Summary</h3>
          <p><strong>Landlord's Name:</strong> {landlordName}</p>
          <p><strong>Landlord's Phone:</strong> {landlordPhone}</p>
          <p><strong>Landlord's Email:</strong> {landlordEmail}</p>
          <p><strong>Apartment Location:</strong> {apartmentLocation}</p>

          <button
            onClick={() => setStep(6)} // Proceed to final submission confirmation
            className="w-full bg-green-500 text-white p-3 rounded mt-4"
          >
            Confirm and Submit
          </button>
             <button
            onClick={() => setStep(4)} // Go back to rent application form
            className="w-full bg-gray-500 text-white p-3 rounded hover:bg-gray-700 mt-4"
          >
            Back
          </button>
        </>
      )}

      {/* Step 6: Final Submission Confirmation */}
      {step === 6 && (
        <>
     <h2 className="text-3xl font-bold text-center text-blue-900 underline"> Huraay! Your Submission  is Complete!</h2>
          <p>We are excited to support you in your rental Journal!  </p> 
            <p>Keep an eye on your inbox</p> 
            <p>we will email you within 3 - 7 business days </p> 
            <p> Got questions?</p>
           <p>Don't hesistate to contact us at 0207337449  </p>
          <button
            onClick={() => setStep(1)} // Exit
            className="w-full bg-blue-500 text-white p-3 rounded mt-4"
          >
            Exit
          </button>
        </>
           )}
    </div>
  );
}

