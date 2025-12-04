import { useState } from 'react';
import { Modal } from '../design-system/Modal';
import { Button } from '../design-system';

interface UserAgreementModalProps {
  onClose: () => void;
}

export function UserAgreementModal({ onClose }: UserAgreementModalProps) {
  const [hasConsented, setHasConsented] = useState(false);

  const USER_AGREEMENT = (
    <>
      <pre className="whitespace-pre-line">
        {`Last Updated: November 11th, 2025

        This User Agreement ("Agreement") governs your use of the Creditable platform and services provided by Creditable LLC, a Missouri limited liability company ("Creditable," "we," "us," or "our"). By accessing or using our platform, you ("User," "you," or "your") agree to be bound by this Agreement.

        1. Acceptance of Terms
        By creating an account, accessing, or using the Creditable platform, you acknowledge that you have read, understood, and agree to be bound by this Agreement and our Privacy Policy. If you do not agree to these terms, you may not use our platform.

        2. Description of Service
        Creditable provides a web-based software platform that allows users to test group health insurance plans with prescription drug coverage against CMS creditable coverage requirements. Our services include:
        - Plan testing and analysis tools
        - Automated creditable coverage determinations
        - Reporting and documentation features
        - Access to current CMS guideline interpretations
        - Technical support and platform maintenance

        3. User Accounts and Registration
        Account Creation: You must create an account to use our platform. You agree to provide accurate, current, and complete information during registration and to update such information as necessary.
        Account Security: You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account.
        Account Eligibility: You represent that you are at least 18 years old and have the authority to enter into this Agreement on behalf of yourself or your organization.

        4. Acceptable Use
        You agree to use the platform only for lawful purposes and in accordance with this Agreement. You may not:
        - Use the platform for any illegal, fraudulent, or unauthorized purpose
        - Attempt to gain unauthorized access to our systems or other user accounts
        - Upload or transmit viruses, malware, or other harmful code
        - Interfere with or disrupt the platform's functionality
        - Reverse engineer, decompile, or attempt to extract source code
        - Use automated scripts or bots to access the platform without authorization
        - Share your account credentials with unauthorized third parties
        - Submit false, misleading, or incomplete plan information

        5. User Data and Privacy
        Data Ownership: You retain ownership of all data you submit to the platform, including plan information and test results.
        Data Use: We may use your data to provide services, generate reports, and improve our platform, as described in our Privacy Policy.
        Data Security: We implement commercially reasonable security measures to protect your data, but cannot guarantee absolute security.
        Confidentiality: Both parties agree to maintain the confidentiality of proprietary or sensitive information disclosed through the platform, and not to disclose such information to third parties except as permitted under this Agreement or required by law.
        Data Retention: We will retain your data in accordance with our Privacy Policy and applicable legal requirements.
        HIPAA Disclaimer: Creditable does not require, request, or intend to process Protected Health Information ("PHI") as defined under HIPAA. Users shall not upload PHI into the platform. If PHI is uploaded, Creditable disclaims any responsibility for HIPAA compliance obligations with respect to such PHI.

        6. Results and Disclaimers
        Tool Nature: The platform provides automated actuarial tools intended to assist plan sponsors with CMS creditable coverage analysis. Results are for informational purposes only and do not constitute legal, compliance, or actuarial advice.
        User Responsibility: You are solely responsible for ensuring that all plan data and inputs submitted to the platform are complete and accurate. You are also responsible for verifying all test results and determining compliance with CMS and ERISA requirements.
        Regulatory Disclaimer: Creditable provides automated actuarial testing tools but does not provide legal advice, actuarial certification, or fiduciary services. Plan sponsors remain responsible for compliance with CMS, ERISA, and other applicable laws. Creditable does not process PHI under HIPAA.
        Fiduciary Responsibility: Users acknowledge that fiduciary responsibility under ERISA remains solely with the plan sponsor. Creditable does not act as a fiduciary under ERISA or any similar law.
        CMS Updates: CMS guidance and regulations may change. Creditable uses commercially reasonable efforts to update the platform, but makes no guarantee that updates will occur immediately or that regulatory interpretations will remain consistent.

        7. Intellectual Property
        Our IP: We retain all rights to our platform, software, algorithms, content, and related intellectual property. You may not copy, modify, distribute, or create derivative works based on our proprietary technology.
        Limited License: We grant you a limited, non-exclusive, non-transferable license to use the platform solely for its intended purpose during your subscription period.
        Feedback: Any feedback, suggestions, or improvements you provide may be used by us without compensation or attribution.

        8. Payment and Subscription
        Payment terms are governed by your separate Service Agreement with Creditable. Continued use of the platform constitutes acceptance of any fee changes made in accordance with your Service Agreement.

        9. Termination
        By You: You may terminate your account at any time by contacting us or using account settings.
        By Us: We may suspend or terminate your access immediately if you violate this Agreement or for non-payment of fees.
        Effect of Termination: Upon termination, your right to use the platform ceases immediately. We may delete your account and data in accordance with our data retention policies.
        Data Retention After Termination: Upon termination, Creditable may retain plan testing results and associated data for a commercially reasonable period to comply with legal obligations or maintain business records, after which such data may be deleted.

        10. Disclaimers and Warranties
        THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.

        11. Limitation of Liability
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM. WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION.

        12. Indemnification
        You agree to indemnify and hold us harmless from any claims, damages, losses, or expenses arising from your use of the platform, violation of this Agreement, or infringement of any third-party rights.

        13. Compliance and Regulatory Changes
        You acknowledge that healthcare and insurance regulations may change, affecting the accuracy or applicability of platform results. Creditable uses commercially reasonable efforts to update the platform for material regulatory changes but makes no guarantees about timing or completeness of such updates. Users should independently confirm current CMS requirements.

        14. Platform Modifications
        Creditable may modify, update, or discontinue features of the platform at any time without notice, provided that such modifications do not materially reduce core functionality during a paid subscription term.

        15. Force Majeure
        Creditable shall not be liable for any failure or delay in performance due to causes beyond its reasonable control, including but not limited to natural disasters, labor disputes, government actions, or internet and telecommunications outages. This provision does not excuse Customer’s payment obligations for services already rendered.

        16. Technical Support
        We provide technical support during standard business hours. Support does not include compliance advice, plan interpretation, or regulatory guidance.

        17. Governing Law and Dispute Resolution
        This Agreement is governed by Missouri law. Any disputes shall be resolved through binding arbitration in Kansas City, Missouri, under the rules of the American Arbitration Association.

        18. Miscellaneous
        Entire Agreement: This Agreement, together with our Privacy Policy and your Service Agreement, constitutes the complete agreement regarding platform use.
        Severability: If any provision is found unenforceable, the remainder shall remain in effect.
        Assignment: We may assign this Agreement; you may not assign it without our written consent.
        Waiver: Failure to enforce any right or provision shall not constitute a waiver.
        Survival: Sections relating to Intellectual Property, Disclaimers, Limitation of Liability, Indemnification, and Governing Law shall survive termination of this Agreement.
        Contact: For questions about this Agreement, contact us at [support@joincreditable.com].

        By using the Creditable platform, you acknowledge that you have read, understood, and agree to be bound by this User Agreement.`}
      </pre>
    </>
  );

  const ACCEPTANCE_FOOTER = (
    <div className="flex flex-col gap-4">
      <label className="flex items-baseline gap-2">
        <input
          id="acknowledgeUserCheckbox"
          type="checkbox"
          checked={hasConsented}
          onChange={(e) =>
            setHasConsented(e.target.checked)
          }
          className="ml-2"
        />
        <p>
          By checking this box I acknowledge and accept the Creditable Platform User Agreement. I have read, understood, and agree to the Terms and Conditions and Privacy Policy.
        </p>
      </label>
      <Button
        variant={hasConsented ? 'default' : 'disabled'}
        disabled={!hasConsented}
        onClick={onClose}
      >
        Save and Continue
      </Button>
    </div>
  );

  return (
    <Modal
      open
      onClose={onClose}
      title="Creditable Platform User Agreement"
      footer={ACCEPTANCE_FOOTER}
      closeable={false}
    >
      <p className="mb-4">
        Welcome to our service. By using this app, you agree to the following terms:
      </p>
      <div className="max-h-72 overflow-y-auto p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
        {USER_AGREEMENT}
      </div>
    </Modal>
  );
}
