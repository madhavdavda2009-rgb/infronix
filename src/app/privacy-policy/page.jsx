"use client";
import SEO from '@/components/SEO';

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy | Infronix"
        description="Comprehensive Privacy Policy for Infronix Web Agency. Understand how we collect, use, store, process, disclose, and protect your personal information."
      />
      <main className="w-full pt-32 pb-section-gap bg-surface text-on-surface" id="main-content">
        <div className="max-w-[900px] mx-auto px-margin-mobile md:px-margin-desktop">
          {/* Header Section */}
          <header className="border-b border-outline-variant pb-8 mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-secondary mb-2 block">
              Legal & Compliance
            </span>
            <h1 className="font-headline-lg text-4xl md:text-5xl font-bold text-primary mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm font-medium text-on-surface-variant">
              <strong className="text-primary">Last Updated:</strong> August 14, 2026
            </p>
          </header>

          {/* Document Content */}
          <div className="flex flex-col gap-10 font-body-md text-body-md text-on-surface-variant leading-relaxed">
            
            {/* 1. Introduction */}
            <section aria-labelledby="section-1" className="space-y-4">
              <h2 id="section-1" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                1. Introduction
              </h2>
              <p>
                This Privacy Policy explains how we collect, use, store, process, disclose, and protect personal information when you visit our website, contact us, use our chatbot, or interact with our services.
              </p>
              <p>
                Our services may include website development, SEO services, AI automation, AI chatbot development, digital solutions, and related technology services.
              </p>
              <p>
                By using our website, you acknowledge this Privacy Policy.
              </p>
              <p>
                We aim to handle personal information in accordance with applicable privacy and data-protection laws of India and other applicable jurisdictions.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 2. Information We Collect */}
            <section aria-labelledby="section-2" className="space-y-6">
              <h2 id="section-2" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                2. Information We Collect
              </h2>
              <p>
                Depending on how you interact with us, we may collect:
              </p>

              {/* 2.1 Information You Provide */}
              <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/60 space-y-3">
                <h3 className="text-lg font-semibold text-primary">
                  2.1 Information You Provide
                </h3>
                <ul className="list-disc pl-6 space-y-1.5 marker:text-secondary">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>WhatsApp contact information</li>
                  <li>Business or company name</li>
                  <li>Job title or role, where voluntarily provided</li>
                  <li>Project requirements</li>
                  <li>Website or business information</li>
                  <li>Messages and enquiries</li>
                  <li>Information submitted through contact forms</li>
                  <li>Information submitted through our AI chatbot</li>
                  <li>Information provided during consultations</li>
                  <li>Information required for project delivery</li>
                </ul>
              </div>

              {/* 2.2 Technical Information */}
              <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/60 space-y-3">
                <h3 className="text-lg font-semibold text-primary">
                  2.2 Technical Information
                </h3>
                <p>
                  When you visit our website, certain technical information may be collected automatically, including:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 marker:text-secondary">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Device information</li>
                  <li>Pages visited</li>
                  <li>Approximate location derived from technical information</li>
                  <li>Referral/source information</li>
                  <li>Date and time of visits</li>
                  <li>Website interaction information</li>
                  <li>Error and diagnostic information</li>
                </ul>
              </div>

              {/* 2.3 Cookies and Similar Technologies */}
              <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/60 space-y-3">
                <h3 className="text-lg font-semibold text-primary">
                  2.3 Cookies and Similar Technologies
                </h3>
                <p>
                  We may use cookies and similar technologies for:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 marker:text-secondary">
                  <li>Essential website functionality</li>
                  <li>Security</li>
                  <li>Analytics</li>
                  <li>Performance monitoring</li>
                  <li>Remembering preferences</li>
                  <li>Understanding how visitors use our website</li>
                </ul>
                <p className="pt-2 italic text-sm text-on-surface-variant">
                  You may control cookies through your browser settings where technically possible.
                </p>
              </div>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 3. Information Collected Through Our Chatbot */}
            <section aria-labelledby="section-3" className="space-y-4">
              <h2 id="section-3" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                3. Information Collected Through Our Chatbot
              </h2>
              <p>
                Our website may contain an AI-powered chatbot.
              </p>
              <p>
                Information entered into the chatbot may include:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 marker:text-secondary">
                <li>Name</li>
                <li>Email</li>
                <li>Phone number</li>
                <li>Business information</li>
                <li>Service requirements</li>
                <li>Questions and messages</li>
                <li>Project requirements</li>
                <li>Other information voluntarily provided by the visitor</li>
              </ul>
              
              <p className="pt-2">
                Chatbot information may be processed to:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 marker:text-secondary">
                <li>Answer questions</li>
                <li>Explain our services</li>
                <li>Understand customer requirements</li>
                <li>Qualify enquiries</li>
                <li>Generate leads</li>
                <li>Provide relevant information</li>
                <li>Connect visitors with our team</li>
                <li>Improve our services</li>
              </ul>

              {/* Important Alert Box */}
              <div className="mt-4 p-5 bg-error-container/20 border-l-4 border-error text-on-error-container rounded-r-lg space-y-2">
                <h4 className="font-bold text-base flex items-center gap-2 text-error">
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  Important
                </h4>
                <p className="text-sm font-medium text-on-surface">
                  Do not submit highly sensitive information through the chatbot unless specifically requested through an appropriate secure process.
                </p>
                <p className="text-sm text-on-surface-variant">
                  This may include:
                </p>
                <ul className="list-disc pl-6 text-sm space-y-1 text-on-surface-variant">
                  <li>Passwords</li>
                  <li>Banking credentials</li>
                  <li>Credit/debit card details</li>
                  <li>Authentication codes</li>
                  <li>Government identification numbers</li>
                  <li>Private security credentials</li>
                  <li>Other highly sensitive information</li>
                </ul>
              </div>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 4. How We Use Personal Information */}
            <section aria-labelledby="section-4" className="space-y-4">
              <h2 id="section-4" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                4. How We Use Personal Information
              </h2>
              <p>
                We may use collected information to:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 marker:text-secondary">
                <li>Respond to enquiries</li>
                <li>Communicate with prospective clients</li>
                <li>Provide requested services</li>
                <li>Prepare proposals and quotations</li>
                <li>Manage projects</li>
                <li>Provide customer support</li>
                <li>Deliver websites and software</li>
                <li>Provide SEO services</li>
                <li>Develop and operate AI automation</li>
                <li>Operate AI chatbots</li>
                <li>Maintain business records</li>
                <li>Improve our website</li>
                <li>Analyze website performance</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Maintain system security</li>
                <li>Investigate security incidents</li>
                <li>Comply with applicable legal obligations</li>
                <li>Enforce our agreements and policies</li>
                <li>Protect our rights and legitimate business interests</li>
              </ul>
              <p className="font-semibold text-primary pt-2">
                We do not sell personal information as a business practice.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 5. Legal Basis and Consent */}
            <section aria-labelledby="section-5" className="space-y-4">
              <h2 id="section-5" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                5. Legal Basis and Consent
              </h2>
              <p>
                Where applicable law requires consent for processing personal information, we will seek the required consent.
              </p>
              <p>
                Depending on the applicable law and circumstances, information may also be processed where necessary for:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 marker:text-secondary">
                <li>Providing requested services</li>
                <li>Performing a contract</li>
                <li>Responding to enquiries</li>
                <li>Complying with legal obligations</li>
                <li>Protecting security and preventing abuse</li>
                <li>Other legally permitted purposes</li>
              </ul>
              <p>
                Where consent is relied upon, users may have the right to withdraw consent subject to applicable law and reasonable operational requirements.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 6. AI Processing */}
            <section aria-labelledby="section-6" className="space-y-4">
              <h2 id="section-6" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                6. AI Processing
              </h2>
              <p>
                We may use third-party AI services to provide chatbot, automation, analysis, or other AI-related functionality.
              </p>
              <p>
                Information submitted to an AI-powered feature may be processed by the relevant technology provider where necessary to provide that functionality.
              </p>
              <p>
                We take reasonable measures to avoid sending unnecessary personal information to AI services.
              </p>
              <p>
                AI-generated responses may contain errors.
              </p>
              <p className="font-medium text-primary">
                AI-generated information should not automatically be relied upon for legal, financial, medical, security, or other high-risk decisions.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 7. Third-Party Service Providers */}
            <section aria-labelledby="section-7" className="space-y-4">
              <h2 id="section-7" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                7. Third-Party Service Providers
              </h2>
              <p>
                We may use trusted third-party providers for:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Website hosting",
                  "Cloud infrastructure",
                  "Databases",
                  "Analytics",
                  "AI services",
                  "Email delivery",
                  "Communication",
                  "WhatsApp or messaging integrations",
                  "Payment processing",
                  "Security services",
                  "Customer relationship management",
                  "Project management",
                  "Domain and DNS services",
                  "Software development infrastructure"
                ].map((item, idx) => (
                  <div key={idx} className="bg-surface-container-low px-4 py-2.5 rounded border border-outline-variant/40 flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className="pt-2">
                These providers may process information on our behalf or independently according to their applicable terms and privacy policies.
              </p>
              <p>
                We do not control the privacy practices of third-party services that we do not operate.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 8. Client Data */}
            <section aria-labelledby="section-8" className="space-y-4">
              <h2 id="section-8" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                8. Client Data
              </h2>
              <p>
                When we provide services to a client, we may process information belonging to that client or the client&apos;s customers.
              </p>
              <p>
                The client remains responsible for ensuring that it has the necessary rights, permissions, notices, and lawful basis to provide such information to us for processing.
              </p>
              <p>
                Where appropriate, additional contractual data-protection terms may apply between us and the client.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 9. Data Security */}
            <section aria-labelledby="section-9" className="space-y-4">
              <h2 id="section-9" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                9. Data Security
              </h2>
              <p>
                We implement reasonable technical and organizational safeguards designed to protect information against unauthorized access, misuse, alteration, disclosure, loss, or destruction.
              </p>
              <p>
                Security measures may include:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 marker:text-secondary">
                <li>Access controls</li>
                <li>Authentication</li>
                <li>Environment-variable based secret management</li>
                <li>Encryption where appropriate</li>
                <li>Secure API practices</li>
                <li>Database access restrictions</li>
                <li>Logging and monitoring</li>
                <li>Regular maintenance</li>
                <li>Least-privilege access</li>
              </ul>
              <p className="italic text-sm pt-1">
                However, no internet-based system can be guaranteed to be completely secure.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 10. Data Retention */}
            <section aria-labelledby="section-10" className="space-y-4">
              <h2 id="section-10" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                10. Data Retention
              </h2>
              <p>
                We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, including:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 marker:text-secondary">
                <li>Providing services</li>
                <li>Maintaining business records</li>
                <li>Handling disputes</li>
                <li>Meeting contractual requirements</li>
                <li>Preventing fraud</li>
                <li>Complying with legal obligations</li>
                <li>Maintaining security records</li>
              </ul>
              <p>
                Retention periods may vary depending on the type of information and applicable legal requirements.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 11. Data Deletion */}
            <section aria-labelledby="section-11" className="space-y-4">
              <h2 id="section-11" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                11. Data Deletion
              </h2>
              <p>
                Where applicable, you may request deletion of personal information that we hold about you.
              </p>
              <p>
                Certain information may need to be retained where required by law, necessary for legitimate business purposes, required to resolve disputes, or otherwise permitted by applicable law.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 12. Your Rights */}
            <section aria-labelledby="section-12" className="space-y-4">
              <h2 id="section-12" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                12. Your Rights
              </h2>
              <p>
                Depending on applicable law, you may have rights relating to your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 marker:text-secondary">
                <li>Requesting access to personal information</li>
                <li>Requesting correction of inaccurate information</li>
                <li>Requesting deletion of information</li>
                <li>Withdrawing consent where applicable</li>
                <li>Requesting information about processing</li>
                <li>Raising privacy-related complaints</li>
                <li>Exercising other rights provided by applicable law</li>
              </ul>
              <p className="pt-2">
                Requests may be submitted through our official contact channels.
              </p>
              <p>
                We may need to verify the identity of the requester before processing certain requests.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 13. Children's Privacy */}
            <section aria-labelledby="section-13" className="space-y-4">
              <h2 id="section-13" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                13. Children&apos;s Privacy
              </h2>
              <p>
                Our website is not intentionally designed to collect personal information from children.
              </p>
              <p>
                We do not knowingly request unnecessary personal information from children.
              </p>
              <p>
                If we become aware that personal information has been collected from a child in circumstances where collection was not permitted, we may take reasonable steps to delete it where required.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 14. International Data Processing */}
            <section aria-labelledby="section-14" className="space-y-4">
              <h2 id="section-14" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                14. International Data Processing
              </h2>
              <p>
                Some third-party service providers used by us may process information outside India.
              </p>
              <p>
                Where applicable, such processing will be subject to applicable contractual, technical, organizational, and legal safeguards.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 15. Data Breaches and Security Incidents */}
            <section aria-labelledby="section-15" className="space-y-4">
              <h2 id="section-15" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                15. Data Breaches and Security Incidents
              </h2>
              <p>
                If a personal-data breach or security incident occurs, we will take reasonable steps to investigate, contain, mitigate, and respond to the incident.
              </p>
              <p>
                Where notification is required by applicable law, we will make the required notifications within the applicable timeframes.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 16. Fraud, Abuse, and Security Monitoring */}
            <section aria-labelledby="section-16" className="space-y-4">
              <h2 id="section-16" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                16. Fraud, Abuse, and Security Monitoring
              </h2>
              <p>
                We may process technical and usage information to detect:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 marker:text-secondary">
                <li>Fraud</li>
                <li>Unauthorized access</li>
                <li>Abuse</li>
                <li>Malicious activity</li>
                <li>Attempts to compromise our systems</li>
                <li>Spam</li>
                <li>Automated attacks</li>
                <li>Violations of our Terms and Conditions</li>
              </ul>
              <p className="pt-2">
                Information reasonably necessary to investigate security incidents may be retained where legally permitted.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 17. Marketing Communications */}
            <section aria-labelledby="section-17" className="space-y-4">
              <h2 id="section-17" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                17. Marketing Communications
              </h2>
              <p>
                Where required, we will obtain appropriate consent before sending promotional communications.
              </p>
              <p>
                You may request to stop receiving marketing communications at any time through the available unsubscribe or contact mechanism.
              </p>
              <p>
                Transactional and service-related communications may still be sent where necessary.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 18. Third-Party Links */}
            <section aria-labelledby="section-18" className="space-y-4">
              <h2 id="section-18" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                18. Third-Party Links
              </h2>
              <p>
                Our website may contain links to third-party websites and services.
              </p>
              <p>
                We are not responsible for the privacy practices, content, security, or policies of third-party websites.
              </p>
              <p>
                Users should review the privacy policies of third-party services before providing personal information.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 19. Changes to This Privacy Policy */}
            <section aria-labelledby="section-19" className="space-y-4">
              <h2 id="section-19" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                19. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy when our services, technology, legal requirements, or business practices change.
              </p>
              <p>
                The updated version will be published on this page with a revised &quot;Last Updated&quot; date.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 20. Applicable Law */}
            <section aria-labelledby="section-20" className="space-y-4">
              <h2 id="section-20" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                20. Applicable Law
              </h2>
              <p>
                This Privacy Policy is intended to operate in accordance with applicable laws and regulations governing privacy, data protection, information technology, consumer protection, and electronic communications.
              </p>
              <p>
                Where mandatory legal requirements apply to a particular processing activity, those requirements will take precedence over inconsistent provisions of this Privacy Policy.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 21. Contact and Privacy Requests */}
            <section aria-labelledby="section-21" className="space-y-4">
              <h2 id="section-21" className="font-headline-md text-2xl font-semibold text-primary border-l-4 border-secondary pl-4">
                21. Contact and Privacy Requests
              </h2>
              <p>
                For privacy-related questions, requests, complaints, or concerns, contact us through the official contact information published on our website.
              </p>
              <p>
                We may request reasonable information necessary to verify the identity of the requester and properly process the request.
              </p>
            </section>

            <hr className="border-outline-variant opacity-50" />

            {/* 22. Important Disclaimer */}
            <section aria-labelledby="section-22" className="bg-surface-container-high/60 p-6 rounded-xl border border-outline-variant space-y-3">
              <h2 id="section-22" className="font-headline-md text-2xl font-semibold text-primary">
                22. Important Disclaimer
              </h2>
              <p>
                This Privacy Policy provides general information about our data-handling practices.
              </p>
              <p>
                It does not replace a legally negotiated data-processing agreement, client agreement, or other contractual document where such documents are required.
              </p>
              <p>
                Different clients, jurisdictions, services, and processing activities may require additional privacy and data-protection terms.
              </p>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}
