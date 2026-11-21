import Globalbanner from '@/component/global/banner';
import React from 'react';

function Page() {
  return (
    <> 
     <Globalbanner title="Privacy Policy" slug="privacy-policy" />
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 lg:p-12">
        {/* Header */}
        <header className="border-b border-slate-200 pb-8 mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700 mb-2">
            Legal & Compliance
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            PRIVACY POLICY
          </h1>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              At <strong className="font-semibold text-slate-900">RealtyCults</strong>, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, store and protect your information when you visit our website, submit an enquiry or communicate with our team.
            </p>
            <p>
              By using our website or submitting your information through our contact forms, you agree to the practices described in this policy.
            </p>
          </div>
        </header>

        {/* Policy Sections */}
        <div className="space-y-10 leading-relaxed text-slate-600">
          {/* 1. Information We Collect */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              1. Information We Collect
            </h2>
            <p className="mb-4">
              We may collect personal and non-personal information when you visit our website or interact with our services.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-2.5">
                  Personal Information may include:
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base">
                  <li>Full name.</li>
                  <li>Contact number.</li>
                  <li>Email address.</li>
                  <li>Preferred property location.</li>
                  <li>Property type and size preferences.</li>
                  <li>Budget and other property requirements.</li>
                  <li>Any additional information you voluntarily share with us.</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-2.5">
                  Non-Personal Information may include:
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base">
                  <li>Browser type and device information.</li>
                  <li>IP address.</li>
                  <li>Website pages visited.</li>
                  <li>Date and time of website visits.</li>
                  <li>General website usage and interaction data.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              2. How We Use Your Information
            </h2>
            <p className="mb-3">
              The information collected by RealtyCults may be used for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>To respond to your property enquiries and requests.</li>
              <li>To share relevant residential plots, agricultural land and other property opportunities.</li>
              <li>To understand your property preferences and requirements.</li>
              <li>To provide information about available properties and related services.</li>
              <li>To communicate updates regarding your enquiry.</li>
              <li>To improve our website, services and customer support.</li>
              <li>To maintain website security and prevent misuse.</li>
              <li>To meet applicable legal and regulatory requirements.</li>
            </ul>
            <p className="text-slate-700 font-medium">
              We use your information only for legitimate business purposes and in accordance with applicable laws.
            </p>
          </section>

          {/* 3. How We Share Your Information */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              3. How We Share Your Information
            </h2>
            <p className="mb-3 font-medium text-slate-800">
              RealtyCults does not sell your personal information to third parties.
            </p>
            <p className="mb-3">
              We may share relevant information in limited circumstances, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong className="font-semibold text-slate-900">Property-Related Partners:</strong> With relevant developers, sellers or property representatives when necessary to respond to your specific enquiry.
              </li>
              <li>
                <strong className="font-semibold text-slate-900">Service Providers:</strong> With trusted service providers who assist with website hosting, communication, analytics or technical support.
              </li>
              <li>
                <strong className="font-semibold text-slate-900">Legal Authorities:</strong> When disclosure is required by applicable law, regulation or a lawful request from an authorised authority.
              </li>
              <li>
                <strong className="font-semibold text-slate-900">Business Operations:</strong> Where necessary for legitimate business operations, subject to appropriate safeguards.
              </li>
            </ul>
            <p>
              We aim to share only the information necessary for the relevant purpose.
            </p>
          </section>

          {/* 4. Cookies and Website Tracking */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              4. Cookies and Website Tracking
            </h2>
            <p className="mb-3">
              Our website may use cookies and similar technologies to improve website functionality and understand visitor activity.
            </p>
            <p className="mb-2 font-medium text-slate-800">Cookies may help us:</p>
            <ul className="list-disc pl-6 space-y-1.5 mb-4">
              <li>Remember certain website preferences.</li>
              <li>Understand how visitors use our website.</li>
              <li>Improve website performance.</li>
              <li>Analyse website traffic and user interactions.</li>
            </ul>
            <p>
              You can manage or disable cookies through your browser settings. Please note that disabling certain cookies may affect some website features.
            </p>
          </section>

          {/* 5. Data Storage and Security */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              5. Data Storage and Security
            </h2>
            <div className="space-y-3">
              <p>
                We take reasonable technical and organisational measures to protect the personal information shared with us against unauthorised access, loss, misuse, alteration or disclosure.
              </p>
              <p>
                Access to personal information is limited to authorised individuals and service providers who need it for relevant business purposes.
              </p>
              <p>
                Although we take reasonable precautions, no method of electronic storage or internet transmission can be guaranteed to be completely secure.
              </p>
            </div>
          </section>

          {/* 6. Data Retention */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              6. Data Retention
            </h2>
            <div className="space-y-3">
              <p>
                We retain personal information only for as long as necessary to fulfil the purposes for which it was collected, respond to enquiries, maintain relevant business records or meet applicable legal requirements.
              </p>
              <p>
                When information is no longer required, we take reasonable steps to delete it or anonymise it, subject to applicable legal obligations.
              </p>
            </div>
          </section>

          {/* 7. Your Privacy Rights */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              7. Your Privacy Rights
            </h2>
            <p className="mb-3">
              Depending on applicable laws, you may have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 mb-4">
              <li>Request access to the personal information we hold about you.</li>
              <li>Ask for correction of inaccurate or incomplete information.</li>
              <li>Request deletion of your personal information, subject to legal requirements.</li>
              <li>Withdraw consent where processing is based on your consent.</li>
              <li>Raise concerns about how your information is being used.</li>
            </ul>
            <p>
              To exercise these rights, you can contact us using the details provided below.
            </p>
          </section>

          {/* 8. Third-Party Websites and Services */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              8. Third-Party Websites and Services
            </h2>
            <div className="space-y-3">
              <p>
                Our website may contain links to third-party websites, platforms or services. These websites may have their own privacy policies and data collection practices.
              </p>
              <p>
                RealtyCults is not responsible for the privacy practices or content of external websites. We recommend reviewing their privacy policies before sharing personal information with them.
              </p>
            </div>
          </section>

          {/* 9. Children's Privacy */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              9. Children&apos;s Privacy
            </h2>
            <div className="space-y-3">
              <p>
                Our website and services are not specifically directed towards children. We do not knowingly collect personal information from children in violation of applicable laws.
              </p>
              <p>
                If we become aware that personal information has been collected from a child without the required consent, we will take appropriate steps in accordance with applicable legal requirements.
              </p>
            </div>
          </section>

          {/* 10. Changes to This Privacy Policy */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              10. Changes to This Privacy Policy
            </h2>
            <div className="space-y-3">
              <p>
                RealtyCults may update this Privacy Policy from time to time to reflect changes in our business practices, website features or applicable legal requirements.
              </p>
              <p>
                Any updates will be published on this page along with the revised date. We encourage visitors to review this page periodically.
              </p>
            </div>
          </section>

          {/* 11. Contact Us */}
          <section className="pt-4 border-t border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              11. Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions, concerns or requests regarding this Privacy Policy or the handling of your personal information, please contact us:
            </p>
            
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-2.5 text-sm sm:text-base mb-4">
              <p>
                <span className="font-semibold text-slate-900">Company Name:</span>{' '}
                RealtyCults
              </p>
              <p>
                <span className="font-semibold text-slate-900">Email:</span>{' '}
                <span className="text-slate-700">[Add Official Email Address]</span>
              </p>
              <p>
                <span className="font-semibold text-slate-900">Phone:</span>{' '}
                <span className="text-slate-700">[Add Official Contact Number]</span>
              </p>
              <p>
                <span className="font-semibold text-slate-900">Address:</span>{' '}
                <span className="text-slate-700">[Add Registered or Business Address]</span>
              </p>
              <p>
                <span className="font-semibold text-slate-900">Website:</span>{' '}
                <span className="text-slate-700">[Add Official Website URL]</span>
              </p>
            </div>

            <p className="text-sm text-slate-500">
              We will make reasonable efforts to address your privacy-related queries and requests in accordance with applicable laws.
            </p>
          </section>
        </div>
      </div>
    </main>
    </>
  );
}

export default Page;