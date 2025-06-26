export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-2 text-sm text-gray-500">Effective Date: June 23, 2025</p>
      <p className="mb-6">Company: 3WB Labs Inc.<br/>Platform: 3WB Fleet Financing Platform</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
      <p>We collect the following personal information:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Full name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Government-issued ID (e.g., passport or national ID)</li>
        <li>Wallet address or payment reference (if applicable)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. Why We Collect It</h2>
      <p>We use this data to:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Verify identity (KYC)</li>
        <li>Process fleet financing applications</li>
        <li>Ensure compliance with legal requirements</li>
        <li>Communicate with users</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. How We Protect It</h2>
      <p className="mb-4">Your data is stored securely and only accessed by authorized personnel. We implement encryption and other security measures to prevent unauthorized access.</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Sharing of Data</h2>
      <p>We may share your information with:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Identity verification partners</li>
        <li>Payment processors</li>
        <li>Legal or regulatory authorities if required</li>
      </ul>
      <p className="mb-4">We do not sell or rent your personal data.</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Your Rights</h2>
      <p>You have the right to:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Access or update your personal data</li>
        <li>Request deletion of your data (unless required to retain it by law)</li>
      </ul>
      <p className="mb-4">To exercise your rights, contact: <a href="mailto:3wheelerbikeclub@gmail.com" className="text-blue-600 underline">3wheelerbikeclub@gmail.com</a></p>
    </div>
  );
}
